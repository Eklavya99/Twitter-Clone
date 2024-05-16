let typing = false;
let lastTypingTime;

$(document).ready(() => {

    socket.emit("Join-chat-room", chatId);
    socket.on("typing", () => { $(".typing-dots").show(); })
    socket.on("stop-typing", () => { $(".typing-dots").hide(); })

    $.get(`/api/chats/${chatId}`, (data) => $("#chatName").text(getChatName(data)));

    $.get(`/api/chats/${chatId}/messages`, (data) => {
        let messages = [];
        let lastSenderId = "";
        data.forEach((message, index) => {
            let html = createChatHTML(message, data[index + 1], lastSenderId);
            messages.push(html)
            lastSenderId = message.sender._id;
        })
        let messageHTML = messages.join("");
        renderMessages(messageHTML);
        scrollToBottom(false)
        markAllMessagesAsRead();
    })
})

$("#modifyChatNameModalButton").click(() => {
    let name = $("#chatNameText").val().trim();
    $.ajax({
        url: `/api/chats/${chatId}`,
        type: "PUT",
        data: { chatName: name },
        success: (data, status, xhr) => {
            if (xhr.status != 204)
                return console.error("Couldnot update resource");
            else {
                location.reload();
            }
        }
    })
})

$(".inputTextBox").keydown((event) => {
    displayTypingIndicator();
    if (event.which === 13) {
        submitMessage();
        return false;
    }
})

$(".sendMessage").click(() => {
    submitMessage();
})

function submitMessage() {
    let content = $(".inputTextBox").val().trim();
    if (content != "") {
        sendMessage(content);
        $(".inputTextBox").val("");
        socket.emit("stop-typing", chatId);
        typing = false;
    }


}

function sendMessage(content) {
    $.post("/api/messages", { content, chatId }, (data, status, xhr) => {
        if (xhr.status != 201) {
            console.error("Failed to send message");
            $(".inputTextBox").val(content);
            return;
        }
        createChatMessageContainer(data);

        if (connected) {
            socket.emit("new-message", data)
        }
    })
}

function createChatMessageContainer(message) {
    if (!message || !message._id) {
        console.error(`message is invalid`);
        return;
    }
    let messageHTML = createChatHTML(message);
    renderMessages(messageHTML);
    scrollToBottom(true);
}

function createChatHTML(message, nextMessage = null, lastSenderId = "") {
    let sender = message.sender;
    let senderName = `${sender.firstName} ${sender.lastName}`;

    let currentSenderId = sender._id;
    let nextSenderId = nextMessage != null ? nextMessage.sender._id : "";

    let isFirst = lastSenderId != currentSenderId;
    let isLast = nextSenderId != currentSenderId;

    let isMine = message.sender._id === loggedInUser._id;
    let className = isMine ? "mine" : "theirs";
    let nameEle = "";

    if (isFirst) {
        className += " first";
        if (!isMine) {
            nameEle = `<span class="sendername">${senderName}</span>`
        }
    }
    let profileImg = "";
    if (isLast) {
        className += " last";
        profileImg = `<img src="${sender.profilePic}">`
    }
    let imgContainer = "";
    if (!isMine) {
        imgContainer = `<div class="imageContainer">
                            ${profileImg}
                        </div>`
    }

    return `<li class="message ${className}">
                ${imgContainer}
                <div class="messageContainer">
                    ${nameEle}
                    <span class="messageBody">${message.content}</span>
                </div>
            </li>`
}

function renderMessages(html) {
    $(".chatMessages").append(html);
}

function scrollToBottom(animate) {
    let container = $(".chatMessages");
    let scrollHeight = container[0].scrollHeight;
    if (animate) {
        container.animate({ scrollTop: scrollHeight }, "slow")
    }
    else {
        container.scrollTop(scrollHeight);
    }
}

function displayTypingIndicator() {
    if (!connected) return;

    if (!typing) {
        typing = true;
        socket.emit("typing", chatId);
    }
    lastTypingTime = new Date().getTime();
    let timeoutLength = 3000;

    setTimeout(() => {

        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timeoutLength && typing) {
            socket.emit("stop-typing", chatId);
            typing = false
        }
    }, timeoutLength)
}

function markAllMessagesAsRead() {
    $.ajax({
        url: `/api/chats/${chatId}/messages/markAsRead`,
        type: "PUT",
        success: (data) => refreshNotficationBadges("message")
    })
}
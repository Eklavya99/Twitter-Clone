$(document).ready(() => {
    $.get("/api/chats", (data, status, xhr) => {
        if (xhr.status === 400) {
            console.error("Unable to retrieve chats");
            return;
        }
        else {
            outputChatList(data, $(".resultsContainer"));
        }
    })
})

function outputChatList(chatList, container) {
    chatList.forEach((chat) => {
        let html = createChatHtml(chat);
        container.append(html);
    })
    if (chatList.length == 0) {
        container.append(`<span class="no-results">Nothing to show</span>`)
    }
}


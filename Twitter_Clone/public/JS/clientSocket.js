let connected = false;

let socket = io("http://localhost:5000")

socket.emit("setup", loggedInUser)

socket.on("connected", () => {
    connected = true;
})
socket.on("message-received", (newMessage) => {
    messageReceived(newMessage);
})
socket.on("notification-received", () => {
    $.get("/api/notifications/latest", (data) => {
        displayNotificationPopup(data);
        refreshNotficationBadges("notification");
    })
})

function emitNotification(userId){
    if(userId == loggedInUser._id) return;
    socket.emit("notification-received", userId)
}
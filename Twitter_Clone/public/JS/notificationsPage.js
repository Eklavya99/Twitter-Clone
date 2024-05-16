$(document).ready(() => {
    $.get("/api/notifications", (data) => {
        outputNotifications(data, $(".resultsContainer"));
    })
})

$("#markAsReadBtn").click(() => {
    markNotificationsAsRead();
})


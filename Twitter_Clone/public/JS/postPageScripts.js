$(document).ready(() => {
    $.get(`/api/posts/${postId}`, response => {
        outputPostsAndReplies(response, $(".postContainer"))
    })
})
$(document).ready(() => {
  if (selectedTab === 'replies') {
    loadReplies();
  }
  else {
    loadPosts();
  }
});

let loadPosts = () => {
  $.get("/api/posts", { postedBy: userId, pinned: true }, (response) => {
    outputPinnedPost(response, $(".pinnedPostContainer"));
  });
  $.get("/api/posts", { postedBy: userId, isReply: false }, (response) => {
    outputPosts(response, $(".postsContainer"));
  });
};
let loadReplies = () => {
  $.get("/api/posts", { postedBy: userId, isReply: true }, (response) => {
    outputPosts(response, $(".postsContainer"));
  });
};

function outputPinnedPost(results, container) {
  if(results.length == 0){
    container.hide();
    return;
  }
  container.html("");
  results.forEach((element) => {
    let html = createPostHTML(element);
    container.append(html);
  });
}
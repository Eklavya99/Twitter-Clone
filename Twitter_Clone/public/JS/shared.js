//GLOBALS
let cropper;
let searchTimer;
const selectedUser = [];
$(document).ready(() => {
  refreshNotficationBadges("message");
  refreshNotficationBadges("notification")
})
$("#postText").keyup((event) => {
  let textbox = $(event.target);
  let value = textbox.val().trim();
  let submitBtn = $("#submitPost");
  if (submitBtn.length == 0) return console.error("No valid submission found");
  if (value == "") {
    submitBtn.prop("disabled", true);
    return;
  }
  submitBtn.prop("disabled", false);
});

$("#replyText").keyup((event) => {
  let textbox = $(event.target);
  let value = textbox.val().trim();
  let submitBtn = $("#submitReply");
  if (submitBtn.length == 0) return console.error("No valid submission found");
  if (value == "") {
    submitBtn.prop("disabled", true);
    return;
  }
  submitBtn.prop("disabled", false);
});

$("#submitPost").click((event) => {
  let btn = $(event.target);
  let textbox = $("#postText");

  let data = {
    content: textbox.val(),
  };

  $.post("/api/posts", data, (postData) => {
    let html = createPostHTML(postData);
    $(".postContainer").prepend(html);
    textbox.val("");
    btn.prop("disabled", true);
  });
});

$("#submitReply").click((event) => {
  let Btn = $(event.target);

  let isModal = Btn.parents(".modal").length == 1;
  let textbox = isModal ? $("#replyText") : $("#postText");

  let data = {
    content: textbox.val(),
  };

  if (isModal) {
    let id = Btn.data().id;
    if (id == null) return console.error("error happened");
    console.log(id);
    data.replyTo = id;
  }
  $.post("/api/posts", data, (postData) => {
    if (postData.replyTo) {
      emitNotification(postData.replyTo.postedBy);
      location.reload();
    } else {
      let html = createPostHTML(postData);
      $(".postContainer").prepend(html);
      textbox.val("");
      btn.prop("disabled", true);
    }
  });
});

$(document).on("click", ".likeBtn", (event) => {
  let btn = $(event.target);
  let postId = getPostId(btn);
  if (postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (result) => {
      btn.find("span").text(result.likes.length || "");
      if (result.likes.includes(loggedInUser._id)) {
        btn.addClass("active");
        emitNotification(result.postedBy)
      } else {
        btn.removeClass("active");
      }
    },
  });
});

$(document).on("click", ".retweetBtn", (event) => {
  let Btn = $(event.target);
  let postId = getPostId(Btn);
  if (postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (result) => {
      Btn.find("span").text(result.retweetUsers.length || "");
      if (result.retweetUsers.includes(loggedInUser._id)) {
        Btn.addClass("active");
        emitNotification(result.postedBy);
      } else Btn.removeClass("active");
    },
  });
});

$(document).on("click", ".post", (event) => {
  let postItem = $(event.target);
  let postId = getPostId(postItem);
  if (postId !== undefined && !postItem.is("button")) {
    window.location.href = `/post/${postId}`;
  }
});

$("#replyModal").on("show.bs.modal", (event) => {
  let Btn = $(event.relatedTarget);
  let postId = getPostId(Btn);
  $("#submitReply").data("id", postId);
  $.get(`api/posts/${postId}`, (response) => {
    outputPosts(response.postData, $("#postSectionContainer"));
  });
});

$("#deletePostModal").on("show.bs.modal", (event) => {
  let button = $(event.relatedTarget);
  let postId = getPostId(button);
  $("#submitDeletePost").data("id", postId);
  console.log($("#submitDeletePost").data().id);
});

$("#PinPostModal").on("show.bs.modal", (event) => {
  let button = $(event.relatedTarget);
  let postId = getPostId(button);
  $("#submitPinPostBtn").data("id", postId);
  console.log($("#submitPinPostBtn").data().id);
});

$("#submitDeletePost").click((event) => {
  let postId = $(event.target).data("id");
  $.ajax({
    url: `/api/posts/${postId}`,
    type: "DELETE",
    success: (response, status, xhr) => {
      location.reload();
    },
  });
});

$("#submitPinPostBtn").click((event) => {
  let postId = $(event.target).data("id");
  $.ajax({
    url: `/api/posts/${postId}`,
    type: "PUT",
    data: { pinned: true },
    success: (response, status, xhr) => {
      if (xhr.status != 204) {
        console.error('Couldnot pin post');
        return
      }
      console.log(response)
      location.reload();
    },
  });
});

$("#replyModal").on("hidden.bs.modal", () =>
  $("#postSectionContainer").html("")
);

$(document).on('click', '.followBtn', (event) => {
  let btn = $(event.target);
  let userId = btn.data().user;
  $.ajax({
    url: `/api/users/${userId}/follow`,
    type: "PUT",
    success: (response, status, xhr) => {
      if (xhr.status == 404) {
        return console.log('Cannot find user: ' + userId);
      }
      let diff = 1;
      if (response.following && response.following.includes(userId)) {
        btn.addClass("following")
        btn.text("following");
        emitNotification(userId);
      }
      else {
        btn.removeClass("following")
        btn.text("follow");
        diff = -1;
      }
      let followersLabel = $('#followersValue');
      if (followersLabel.length != 0) {
        let followerCount = parseInt(followersLabel.text());
        followersLabel.text(followerCount + diff);
      }
    }
  })
})

$("#imageFile").change(function () {
  let uploadedFile = this.files;
  if (uploadedFile && uploadedFile[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let image = $("#imagePreview");
      image.attr("src", e.target.result);

      if (cropper !== undefined) cropper.destroy();

      cropper = image.cropper({
        aspectRatio: 1 / 1,
        background: false
      });

    }
    reader.readAsDataURL(uploadedFile[0]);
  }
  else {
    console.error('file not loaded!')
  }
})
$("#coverPhotoFile").change(function () {
  let uploadedFile = this.files;
  if (uploadedFile && uploadedFile[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let image = $("#coverPhotoPreview");
      image.attr("src", e.target.result);

      if (cropper !== undefined) cropper.destroy();

      cropper = image.cropper({
        aspectRatio: 16 / 9,
        background: false
      });

    }
    reader.readAsDataURL(uploadedFile[0]);
  }
  else {
    console.error('file not loaded!')
  }
})

$("#profileImageUploadBtn").click(() => {
  let image = $("#imagePreview");
  let croppedArea = image.cropper('getCroppedCanvas');
  if (croppedArea == null) {
    console.error("Error uploading the image. Make sure it a valid image.")
    return;
  }
  croppedArea.toBlob((blob) => {
    let formData = new FormData();
    formData.append('croppedImage', blob);
    $.ajax({
      url: "/api/users/profilePicture",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: () => { location.reload(); }
    })
  })
})

$("#coverPhotoUploadBtn").click(() => {
  let image = $("#coverPhotoPreview");
  let croppedArea = image.cropper('getCroppedCanvas');
  if (croppedArea == null) {
    console.error("Error uploading the image. Make sure it a valid image.")
    return;
  }
  croppedArea.toBlob((blob) => {
    let formData = new FormData();
    formData.append('croppedImage', blob);
    $.ajax({
      url: "/api/users/coverphoto",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: () => { location.reload(); }
    })
  })
})

$("#userSearchBox").keydown((event) => {
  clearTimeout(searchTimer);
  let textbox = $(event.target);
  let searchTextValue = textbox.val();

  if (searchTextValue == "" && (event.which == 8 || event.keyCode == 8)) {
    selectedUser.pop();
    updateSelectedUser();
    $(".resultsContainer").html("");
    if (selectedUser.length == 0) {
      $("#createChatButton").prop("disabled", true);
    }
    return;
  }

  searchTimer = setTimeout(() => {
    searchTextValue = textbox.val().trim();
    if (searchTextValue === "") {
      $(".resultsContainer").html("")
    }
    else {
      searchUsers(searchTextValue);
    }
  }, 1000)
})

$("#createChatButton").click(() => {
  let data = JSON.stringify(selectedUser);

  $.post("/api/chats/", { users: data }, response => {
    if (!response || !response._id) {
      return console.error("Invalid response from the server")
    }
    window.location.href = `/messages/${response._id}`
  })
})

$(document).on("click", ".notification.active", (e) => {
  let container = $(e.target);
  let notificationId = container.data().id;
  let href = container.attr("href");
  e.preventDefault();
  let callback = () => window.location = href;
  markNotificationsAsRead(notificationId, callback);
})

//Utility functions
function createPostHTML(postData, focusPost = false) {
  if (postData == null) console.error("post object is null");
  let isPostRetweet = postData.retweetData !== undefined;
  let retweetedBy = isPostRetweet ? postData.postedBy.username : null;
  postData = isPostRetweet ? postData.retweetData : postData;

  let postedBy = postData.postedBy;
  if (postedBy._id == undefined) {
    return console.error("User object not found");
  }
  let displayName = postedBy.firstName + " " + postedBy.lastName;
  let timeStamp = timeDifference(new Date(), new Date(postData.createdAt));
  let likeBtnActiveClass = postData.likes.includes(loggedInUser._id)
    ? "active"
    : "";
  let retweetBtnActiveClass = postData.retweetUsers.includes(loggedInUser._id)
    ? "active"
    : "";
  let focus = focusPost ? "focus" : "";
  let retweetInfo = "";
  let retweetText = "";
  if (isPostRetweet) {
    retweetInfo = "retweet-info";
    retweetText = `<i class="fa-solid fa-retweet"></i> <span>Retweeted by <a href="/profile/${retweetedBy}">@ ${retweetedBy}</a></span>`;
  }
  let replyFlag = "";
  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return console.error("Reply-to field not populated");
    }
    let replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = `<div class="replyFlag">
                    Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
                  </div>`;
  }

  let buttons = "";
  let pinnedPostHtml = "";
  if (postData.postedBy._id == loggedInUser._id) {
    let isPinned = "";
    let dataTarget = "#PinPostModal";
    if (postData.pinned === true) {
      isPinned = "active";
      dataTarget = "#unpinPostModal"
      pinnedPostHtml = `<i class="fa-solid fa-thumbtack"></i> <span>Pinned post</span>`
    }
    buttons = ` <button class="${isPinned} pin" data-id="${postData._id}" data-bs-toggle="modal" data-bs-target="${dataTarget}"><i class="fa-solid fa-thumbtack"></i></button>
                <button data-id="${postData._id}" data-bs-toggle="modal"            data-bs-target="#deletePostModal"><i class="fa-solid fa-trash"></i></button>`;
  }

  const html = `<div class="post ${focus}" data-id=${postData._id}>
  <div class=${retweetInfo}>
    ${retweetText}
  </div>
  <div class="postContentContainer">
      <div class="userImageContainer">
          <img src="${postedBy.profilePic}" />
      </div>
      <div class="postContent">
          <div class="pinnedPost">${pinnedPostHtml}</div>
          <div class="postHeader">
              <a href="/profile/${postedBy.username
    }" class="displayName">${displayName}</a>
              <span class="username">@${postedBy.username}</span>
              <span class="date">${timeStamp}</span>
              ${buttons}
          </div>
          ${replyFlag}
          <div class="postBody">
              <span>${postData.content}</span>
          </div>
          <div class="postFooter">
              <div class="postButton">
                  <button data-bs-toggle="modal" data-bs-target="#replyModal">
                    <i class="fa-solid fa-comments"></i>
                  </button>
              </div>
              <div class="postButton green">
                  <button class="retweetBtn ${retweetBtnActiveClass}">
                    <i class="fa-solid fa-retweet"></i>
                    <span>${postData.retweetUsers.length || ""}</span>
                  </button>
              </div>
              <div class="postButton red ">
                  <button class="likeBtn ${likeBtnActiveClass}">
                    <i class="fa-regular fa-heart"></i>
                    <span>${postData.likes.length || ""}</span>
                  </button>
              </div>
          </div>
      </div>
  </div>
                </div>`;
  return html;
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just now..";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return +Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return +Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return +Math.round(elapsed / msPerYear) + " years ago";
  }
}

function getPostId(element) {
  let isRoot = element.hasClass("post");
  let root = isRoot ? element : element.closest(".post");
  return root.data().id;
}

function outputPosts(results, container) {
  container.html("");
  if (!Array.isArray(results)) {
    results = [results];
  }
  results.forEach((element) => {
    let html = createPostHTML(element);
    container.append(html);
  });
  if (results.length == 0) {
    container.append(`<span class="no-results">Nothing to show!</span>`);
  }
}

function outputPostsAndReplies(results, container) {
  container.html("");
  if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
    let html = createPostHTML(results.replyTo);
    container.append(html);
  }
  let mainPostHtml = createPostHTML(results.postData, true);
  container.append(mainPostHtml);
  results.replies.forEach((result) => {
    let html = createPostHTML(result);
    container.append(html);
  });
}

function outputUsers(results, container) {
  container.html("");
  results.forEach(result => {
    let html = createUserHTML(result, true)
    container.append(html)
  });
  if (results.length === 0) {
    container.append(`<span class="no-results">No results found!</span>`)
  }
}

function createUserHTML(userData, showFollowButton) {
  let name = userData.firstName + " " + userData.lastName;
  let isFollowing = loggedInUser.following && loggedInUser.following.includes(userData._id);
  let buttonText = isFollowing ? "Following" : "Follow";
  let buttonClass = isFollowing ? "followBtn following" : "followBtn"
  let followBtn = "";
  if (showFollowButton && loggedInUser._id != userData._id) {
    followBtn = `<div class="followBtnContainer">
                      <button class="${buttonClass}" data-user="${userData._id}">${buttonText}</button>
                  </div>`
  }
  return `<div class="user">
              <div class="userImageContainer">
                  <img src='${userData.profilePic}'>
              </div>
              <div class="userDetailsContainer">
                  <div class="header">
                      <a href='/profile/${userData.username}'>${name}</a>
                      <span class="username">@${userData.username}</span>
                  </div>
              </div>
              ${followBtn}
          </div>`
}

function searchUsers(searchString) {
  $.get("/api/users", { search: searchString }, (results) => {
    renderSelectedUser(results, $(".resultsContainer"))
  })
}

function renderSelectedUser(results, container) {
  container.html("");
  results.forEach(result => {
    if (result._id == loggedInUser._id || selectedUser.some(u => u._id == result._id)) {
      return;
    }
    let html = createUserHTML(result, false);
    let element = $(html)
    element.click(() => selectUser(result))
    container.append(element);
  })
  if (results.length == 0) {
    container.append(`<span class="no-results">No users found! Check the username any try again</span>`)
  }
}

function selectUser(user) {
  selectedUser.push(user);
  updateSelectedUser();
  $('#userSearchBox').val("").focus();
  $('.resultsContainer').html("");
  $('#createChatButton').prop("disabled", false);
}

function updateSelectedUser() {
  let elements = [];
  selectedUser.forEach((user) => {
    let name = user.firstName + " " + user.lastName;
    let userElement = $(`<span class='selectedUser'>${name}</span>`);
    elements.push(userElement);
  })
  $('.selectedUser').remove();
  $('#selectedUsers').prepend(elements)
}

function getChatName(chatData) {
  let chatName = chatData.chatName;
  if (!chatName) {
    let otherUsers = getOtherUsers(chatData.users);
    let namesArray = otherUsers.map((user) => user.firstName + " " + user.lastName);
    chatName = namesArray.join(", ")
  }
  return chatName
}

function getOtherUsers(users) {
  if (users.length == 1) return users;
  return users.filter((user) => user._id != loggedInUser._id);
}

function messageReceived(newMessage) {
  if ($(`[data-room] = "${newMessage.chat._id}"`).length == 0) {
    displayMessagePopup(newMessage);
  }
  else {
    createChatMessageContainer(newMessage);
  }
  refreshNotficationBadges("message");
}

function markNotificationsAsRead(notificationId = null, callback = null) {
  if (callback == null) callback = () => location.reload();
  let url = notificationId != null ? `/api/notifications/${notificationId}/markAsRead` : `/api/notifications/markAsRead`;

  $.ajax({
    url,
    type: "PUT",
    success: () => callback()
  })
}

function refreshNotficationBadges(type) {
  if (type === "notification") {
    $.get("/api/notifications", { unreadOnly: true }, (data) => {
      let unreadCount = data.length;
      if (unreadCount > 0) {
        $("#notificationBadge").text(unreadCount).addClass("active")
      }
      else {
        $("#notificationBadge").text("").removeClass("active")
      }
    })
  }
  else {
    $.get("/api/chats", { unreadOnly: true }, (data) => {
      let unreadCount = data.length;
      if (unreadCount > 0) {
        $("#messageBadge").text(unreadCount).addClass("active")
      }
      else {
        $("#messageBadge").text("").removeClass("active")
      }
    })
  }
}

function displayNotificationPopup(data) {
  let html = createNotificationHTML(data);
  let element = $(html);
  element.hide().prependTo("#notificationList").slideDown("fast");
  setTimeout(() => {
    element.fadeOut(400)
  }, 5000);
}
function displayMessagePopup(data) {
  if (!data.chat.latestMessage._id) {
    data.chat.latestMessage = data;
  }
  let html = createChatHtml(data.chat);
  let element = $(html);
  element.hide().prependTo("#notificationList").slideDown("fast");
  setTimeout(() => {
    element.fadeOut(400)
  }, 5000);
}

function outputNotifications(notifications, container) {
  notifications.forEach(notification => {
    let html = createNotificationHTML(notification);
    container.append(html);
  });

  if (notifications.length == 0) {
    container.append(`<span class="no-results">Nothing to show!</span>`)
  }
}

function createNotificationHTML(notification) {
  let text = getNotificationText(notification);
  let href = getNotificationURL(notification);
  let className = notification.openned ? "" : "active"
  return `<a href="${href}" class="resultListItem notification ${className}" data-id="${notification._id}">
              <div class="userImageContainer">
                  <img src="${notification.userFrom.profilePic}">
              </div>
              <div class="resultsDetailsContainer ellipsis">
                  ${text}
              </div>
          </a>`
}

function getNotificationText(notification) {
  let userFrom = notification.userFrom;
  let notificationType = notification.notificationType;
  if (!userFrom.firstName || !userFrom.lastName) return console.error("User data not populated");

  let userName = `${userFrom.firstName} ${userFrom.lastName}`;
  let text;

  if (notificationType == "retweet") text = `${userName} retweeted one of your posts`;
  else if (notificationType == "follow") text = `${userName} followed you`;
  else if (notificationType == "like") text = `${userName} liked one of your posts`;
  else if (notificationType == "reply") text = `${userName} replied to one of your posts`;

  return `<span class="ellipsis">${text}</span>`;
}

function getNotificationURL(notification) {
  let url = "#";
  let notificationType = notification.notificationType;
  if (notificationType == "retweet" || notificationType == "like" || notificationType == "reply") {
    url = `/post/${notification.entityId}`
  }
  else if (notificationType == "follow") {
    url = `/profile/${notification.entityId}`;
  }

  return url;
}


function createChatHtml(chatData) {
  let chatName = getChatName(chatData)
  let img = getChatImage(chatData);
  let latestMessage = retriveLastSentMessage(chatData.latestMessage);
  let activeClass = !chatData.latestMessage || chatData.latestMessage.readBy.includes(loggedInUser._id) ? "" : "active";
  return `<a href="/messages/${chatData._id}" class="chatListItem ${activeClass}">
              ${img}
              <div class="chatDetailsContainer ellipsis">
                  <span class="heading ellipsis">${chatName}</span>
                  <span class="subText ellipsis">${latestMessage}</span>

              </div>
          </a>`
}

function retriveLastSentMessage(latestMessage) {
  if (latestMessage != null) {
    let sender = latestMessage.sender;
    return `${sender.firstName} ${sender.lastName}: ${latestMessage.content}`
  }
  return 'New chat'
}

function getChatImage(chatData) {
  let otherUsers = getOtherUsers(chatData.users);
  let groupChatClass = "";
  let chatImg = getUserChatImage(otherUsers[0]);

  if (otherUsers.length > 1) {
    groupChatClass = "groupChatImage";
    chatImg += getUserChatImage(otherUsers[1]);
  }
  return `<div class="resultsImageContainer ${groupChatClass}">${chatImg}</div>`
}

function getUserChatImage(user) {
  if (!user || !user.profilePic) {
    return console.error("Invalid user")
  }
  return `<img src="${user.profilePic}" alt="User profile picture">`
}
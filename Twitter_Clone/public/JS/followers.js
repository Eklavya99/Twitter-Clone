$(document).ready(() => {
    if (selectedTab === 'followers') {
        loadFollowers();
    }
    else {
        loadFollowing();
    }
});

let loadFollowers = () => {
    $.get(`/api/users/${userId}/followers`, (response) => {
        outputUsers(response.followers, $(".resultsContainer"));
    });
};
let loadFollowing = () => {
    $.get(`/api/users/${userId}/following`, (response) => {
        outputUsers(response.following, $(".resultsContainer"));
    });
};


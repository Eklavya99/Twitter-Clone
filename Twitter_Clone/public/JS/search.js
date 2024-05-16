// let searchTimer;

$("#searchBox").keydown((event) => {
    clearTimeout(searchTimer);
    let textbox = $(event.target);
    let searchTextValue = textbox.val();
    let searchType = textbox.data().search;

    searchTimer = setTimeout(() => {
        searchTextValue = textbox.val().trim();
        if (searchTextValue === "") {
            $(".resultsContainer").html("")
        }
        else {
            search(searchTextValue, searchType);
        }
    }, 1000)
})

function search(searchTerm, searchType) {
    let url = searchType == "users" ? "/api/users" : "/api/posts";

    $.get(url, { search: searchTerm }, (results) => {
        if(searchType == 'users'){
            outputUsers(results, $(".resultsContainer"));
        }
        else{
            outputPosts(results, $(".resultsContainer"));
        }
    })
}
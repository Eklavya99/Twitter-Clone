const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    let payload = getPayLoad(req.session.user);
    res.status(200).render("searchPage", payload);
})

router.get("/:selectedTab", (req, res) => {
    let payload = getPayLoad(req.session.user);
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("searchPage", payload)
})

let getPayLoad = function(loggedInUser){
    return {
        pageTitle: "search",
        loggedInUser,
        loggedInUser_js: JSON.stringify(loggedInUser)
    }
}

module.exports = router;
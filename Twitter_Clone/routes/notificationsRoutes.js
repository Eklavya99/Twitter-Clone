const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
    let payload = {
        pageTitle: "Notifications",
        loggedInUser: req.session.user,
        loggedInUser_js: JSON.stringify(req.session.user)
    }
    res.render("notificationsPage", payload);
})

module.exports = router;
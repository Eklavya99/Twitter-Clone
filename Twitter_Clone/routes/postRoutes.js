const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require("../schemas/userSchema");

const app = express();
const router = express.Router();

router.get("/:id", async (req, res) => {
    
    let payload = {
        pageTitle: "View post",
        loggedInUser: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    res.status(200).render("postPage", payload);
})


module.exports = router;
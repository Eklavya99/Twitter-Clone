const express = require('express');
const bodyParser = require('body-parser');
const Chat = require("../schemas/chatsSchema");
const User = require("../schemas/userSchema");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
    let payload = {
        pageTitle: "Messages",
        loggedInUser: req.session.user,
        loggedInUser_js: JSON.stringify(req.session.user)
    }
    res.status(200).render("inboxPage", payload);
})

router.get("/new", async (req, res) => {
    let payload = {
        pageTitle: "New chat",
        loggedInUser: req.session.user,
        loggedInUser_js: JSON.stringify(req.session.user)
    }
    res.status(200).render("newChatPage", payload);
})

router.get("/:chatId", async (req, res) => {
    let userId = req.session.user._id;
    let chatId = req.params.chatId;
    let isValidId = mongoose.isValidObjectId(chatId);

    let payload = {
        pageTitle: "Chat",
        loggedInUser: req.session.user,
        loggedInUser_js: JSON.stringify(req.session.user)
    }

    if (!isValidId) {
        payload.errorMessage = "Chat doesnot exist or you dont have access to it";
        return res.status(200).render("chatPage", payload);
    }

    let chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } }).populate("users");

    if (chat == null) {
        let userFound = await User.findById(chatId);

        if (userFound != null) {
            chat = await getChatByUserId(userFound._id, userId);
        }
    }

    if (chat == null) {
        payload.errorMessage = "Chat doesnot exist or you dont have access to it"
    }
    else {
        payload.chat = chat;
    }

    res.status(200).render("chatPage", payload);
})

function getChatByUserId(loggedInUserId, otherUserId) {
    return Chat.findOneAndUpdate({
        isGroupChat: false,
        users: {
            $size: 2,
            $all: [
                { $elemMatch: { $eq: new mongoose.Types.ObjectId(loggedInUserId) } },
                { $elemMatch: { $eq: new mongoose.Types.ObjectId(loggedInUserId) } }
            ]
        }
    }, {
        $setOnInsert: {
            users: [loggedInUserId, otherUserId]
        }
    }, {
        new: true,
        upsert: true
    }).populate('users')
}

module.exports = router;
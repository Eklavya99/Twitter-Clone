const express = require('express');
const bodyParser = require('body-parser');
const Chat = require("../../schemas/chatsSchema");
const User = require("../../schemas/userSchema");
const Message = require("../../schemas/messageSchema");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        if (!req.body.users) {
            console.error("User params not sent with the request");
            return res.sendStatus(400)
        }
        let users = JSON.parse(req.body.users);

        if (users.length == 0) {
            console.error("users array is empty");
            return res.sendStatus(400)
        }
        users.push(req.session.user);

        let chatData = {
            users: users,
            isGroupChat: true
        };

        let results = await Chat.create(chatData);
        return res.status(200).send(results);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }


})

router.get("/", async (req, res) => {
    try {
        let result = await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } }).populate("users").populate("latestMessage").sort({ updatedAt: -1 });
        if (req.query.unreadOnly !== undefined && req.query.unreadOnly == true) {
            result = result.filter(r => r.latestMessage && !r.latestMessage.readBy.includes(req.session.user._id));
        }
        result = await User.populate(result, { path: "latestMessage.sender" })
        res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

router.get("/:chatId", async (req, res) => {
    try {
        const result = await Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.session.user._id } } }).populate("users")
        res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

router.get("/:chatId/messages", async (req, res) => {
    try {
        let result = await Message.find({ chat: req.params.chatId }).populate("sender");
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

router.put("/:chatId", async (req, res) => {
    try {
        const result = await Chat.findByIdAndUpdate(req.params.chatId, req.body);
        res.sendStatus(204)
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})
router.put("/:chatId/messages/markAsRead", async (req, res) => {
    try {
        const result = await Message.updateMany({ chat: req.params.chatId }, { $addToSet: { readby: req.session.user._id } })
        res.sendStatus(204)
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

module.exports = router;
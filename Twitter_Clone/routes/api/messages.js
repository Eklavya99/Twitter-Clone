const express = require('express');
const bodyParser = require('body-parser');
const Message = require("../../schemas/messageSchema")
const Chat = require("../../schemas/chatsSchema");
const User = require("../../schemas/userSchema");
const Notification = require("../../schemas/notificationsSchema");

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res) => {
    try {
        if (!req.body.content || !req.body.chatId) {
            console.error("Invalid data passed into request");
            return res.sendStatus(400)
        }
        let newMessage = {
            sender: req.session.user._id,
            content: req.body.content,
            chat: req.body.chatId
        }
        Message.create(newMessage).then(
            async (message) => {
                message = await message.populate("sender")
                message = await message.populate("chat");
                message = await User.populate(message, { path: "chat.users" })
                let chat = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
                insertMessageNotification(chat, message);
                res.status(201).send(message)
            }
        ).catch((err) => {
            console.error(err);
            throw new Error(err);
        })

    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

function insertMessageNotification(chat, message) {
    chat.users.forEach(userId => {
        if (userId == (message.sender._id).toString()) return;
        Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id)
    });
}

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const Notification = require('../../schemas/notificationsSchema');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => {
    try {
        let filter = { userTo: req.session.user._id, notificationType: { $ne: "newMessage" } };
        if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
            filter.openned = false;
        }
        const result = await Notification.find(filter).populate("userTo").populate("userFrom").sort({ createdAt: -1 });
        res.status(200).send(result)
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400)
    }
})
router.put("/:id/markAsRead", async (req, res) => {
    try {
        const result = await Notification.findByIdAndUpdate(req.params.id, { openned: true })
        res.sendStatus(204)
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400)
    }
})
router.put("/markAsRead", async (req, res) => {
    try {
        const result = await Notification.updateMany({ userTo: req.session.user._id }, { openned: true })
        res.sendStatus(204)
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400)
    }
})

router.get("/latest", async (req, res) => {
    try {
        const result = await Notification.findOne({ userTo: req.session.user._id }).populate("userTo").populate("userFrom").sort({ createdAt: -1 });
        res.status(200).send(result)
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400)
    }
})

module.exports = router;
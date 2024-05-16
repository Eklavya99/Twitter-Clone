const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const User = require('../../schemas/userSchema')
const Post = require('../../schemas/postSchema')
const Notification = require('../../schemas/notificationsSchema')

const app = express();
const router = express.Router();
const upload = multer({ dest: "uploads/" })
app.use(bodyParser.urlencoded({ extended: false }))

router.get("/", async (req, res) => {
    try {
        let filter = req.query;
        if (req.query.search !== undefined) {
            filter = {
                $or: [
                    { firstName: { $regex: req.query.search, $options: "i" } },
                    { lastName: { $regex: req.query.search, $options: "i" } },
                    { username: { $regex: req.query.search, $options: "i" } },
                ]
            }
        }
        let users = await User.find(filter);
        res.status(200).send(users);
    } catch (err) {
        console.error(err);
        res.sendStatus(400)
    }
})

router.put("/:userId/follow", async (req, res) => {
    let userId = req.params.userId;
    try {
        let user = await User.findById(userId);
        if (user == null) {
            return res.sendStatus(404);
        }
        let isFollowing = user.followers && user.followers.includes(req.session.user._id);
        let option = isFollowing ? "$pull" : "$addToSet";
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, { new: true });

        await User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } });
        if (!isFollowing) {
            await Notification.insertNotification(userId, req.session.user._id, "follow", req.session.user._id)
        }
        res.status(200).send(req.session.user);
    }
    catch (err) {
        res.status(400).send(new Error(err));
    }
})

router.get("/:userId/following", async (req, res) => {
    User.findById(req.params.userId).populate("following").then(result => {
        res.status(200).send(result)
    }).catch(err => { console.error(err); res.sendStatus(400) })
})
router.get("/:userId/followers", async (req, res) => {
    User.findById(req.params.userId).populate("followers").then(result => {
        res.status(200).send(result)
    }).catch(err => { console.error(err); res.sendStatus(400) })
})

router.post("/profilePicture", upload.single("croppedImage"), async (req, res) => {
    if (!req.file) {
        console.error('No file uploaded.')
        return res.sendStatus(400)
    }
    let filePath = `/uploads/images/${req.file.filename}.png`;
    let tempPath = req.file.path;
    let targetPath = path.join(__dirname, `../../${filePath}`)
    fs.rename(tempPath, targetPath, async (err) => {
        if (err != null) {
            console.error(err);
            return res.sendStatus(400)
        }
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, { new: true });
        res.sendStatus(204);
    })
})
router.post("/coverphoto", upload.single("croppedImage"), async (req, res) => {
    if (!req.file) {
        console.error('No file uploaded.')
        return res.sendStatus(400)
    }
    let filePath = `/uploads/images/${req.file.filename}.png`;
    let tempPath = req.file.path;
    let targetPath = path.join(__dirname, `../../${filePath}`)
    fs.rename(tempPath, targetPath, async (err) => {
        if (err != null) {
            console.error(err);
            return res.sendStatus(400)
        }
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { coverPhoto: filePath }, { new: true });
        res.sendStatus(204);
    })
})

module.exports = router;
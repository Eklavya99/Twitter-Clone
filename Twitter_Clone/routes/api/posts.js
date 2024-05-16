const express = require("express");
const bodyParser = require("body-parser");
const Post = require("../../schemas/postSchema");
const User = require("../../schemas/userSchema");
const Notification = require("../../schemas/notificationsSchema");
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => {
  try {
    let filter = req.query;

    if (filter.isReply !== undefined) {
      let isReply = filter.isReply == 'true'
      filter.replyTo = { $exists: isReply }
      delete filter.isReply
    }

    if (filter.followingOnly !== undefined) {
      let followingOnly = filter.followingOnly == "true";
      if (followingOnly) {
        let objectIds = [];
        if (!req.session.user.following) {
          req.session.user.following = [];
        }
        req.session.user.following.forEach(user => {
          objectIds.push(user);
        })
        objectIds.push(req.session.user._id);
        filter.postedBy = { $in: objectIds };
      }
      delete filter.followingOnly;
    }

    if (filter.search !== undefined) {
      filter.content = { $regex: filter.search, $options: "i" };
      delete filter.search
    }
    let data = await getPosts(filter)
    if (data == null) throw new Error("unable to fetch posts!")
    res.status(200).send(data);
  }
  catch (err) {
    console.error(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let postData = await getPosts({ _id: req.params.id })
    if (postData == null) {
      throw Error('Unable to fetch the post!');
    }
    postData = postData[0]
    let results = {
      postData
    }
    if (postData.replyTo !== undefined) {
      results.replyTo = postData.replyTo
    }
    results.replies = await getPosts({ replyTo: req.params.id })
    res.status(200).send(results);
  }
  catch (err) {
    console.error(err);
  }
})

router.post("/", async (req, res) => {

  if (!req.body.content) {
    console.log("No content specified.");
    return res.sendStatus(400);
  }
  const postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  if (req.body.replyTo) {
    postData.replyTo = req.body.replyTo
  }

  try {
    let post = await Post.create(postData);
    let newPost = await User.populate(post, { path: "postedBy" });
    newPost = await Post.populate(post, { path: "replyTo" });
    if (newPost.replyTo !== undefined) {
      await Notification.insertNotification(newPost.replyTo.postedBy, req.session.user._id, "reply", newPost._id);
    }
    res.status(201).send(newPost);
  } catch (err) {
    console.error(err);
  }
});
router.put("/:id/like", async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user._id;

  let isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);
  let option = isLiked ? "$pull" : "$addToSet";

  //Insert user like
  try {
    req.session.user = await User.findByIdAndUpdate(
      userId,
      {
        [option]: { likes: postId },
      },
      { new: true }
    );
  } catch (err) {
    console.error(err);
  }
  //Insert post like
  try {
    let post = await Post.findByIdAndUpdate(
      postId,
      {
        [option]: { likes: userId },
      },
      { new: true }
    );
    if (!isLiked) {
      await Notification.insertNotification(post.postedBy, userId, "like", post._id);
    }
    res.status(200).send(post);

  } catch (err) {
    console.error(err);
  }
});

router.post("/:id/retweet", async (req, res) => {
  let postId = req.params.id;
  let userId = req.session.user._id;

  let deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId,
  }).catch((err) => {
    console.error(err);
    res.sendStatus(400);
  });

  let option = deletedPost != null ? "$pull" : "$addToSet";

  let repost = deletedPost;
  if (repost == null) {
    repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
      (err) => {
        console.error(err);
        res.sendStatus(400);
      }
    );
  }
  req.session.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: {
        retweets: repost._id,
      },
    },
    { new: true }
  ).catch((err) => {
    console.error(err);
    res.sendStatus(400);
  });
  let post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { retweetUsers: userId },
    },
    { new: true }
  ).catch((err) => {
    console.error(err);
    res.sendStatus(400);
  });
  if (!deletedPost) {
    await Notification.insertNotification(post.postedBy, userId, "retweet", post._id);
  }
  res.status(200).send(post);
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.sendStatus(202)
  } catch (err) {
    console.error("Delete failed!");
    res.sendStatus(400)
  }
})

router.put("/:id", async (req, res) => {
  try {
    if (req.body.pinned !== undefined) {
      await Post.updateMany({ postedBy: req.session.user }, { pinned: false });
    }
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(204);
  } catch (err) {
    console.error({ Error: err, message: "Error pining the post." });
    res.sendStatus(400)
  }
})


async function getPosts(filter) {
  let result = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ createdAt: -1 })
    .catch(err => console.error(err));

  result = await User.populate(result, { path: "replyTo.postedBy" })
  return await User.populate(result, { path: "retweetData.postedBy" })


}

module.exports = router;

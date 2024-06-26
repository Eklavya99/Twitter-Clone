const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pinned: { type: Boolean },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    pinned: {
      type: Boolean
    },
  },
  { timestamps: true }
);

let Post = mongoose.model("Post", PostSchema);
module.exports = Post;

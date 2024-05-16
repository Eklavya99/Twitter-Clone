const express = require("express");
const User = require("../schemas/userSchema");

const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
  let payload = {
    pageTitle: `${req.session.user.username} profile`,
    loggedInUser: req.session.user,
    loggedInUser_js: JSON.stringify(req.session.user),
    userProfile: req.session.user,
  };
  res.status(200).render("profilePage", payload);
});
router.get("/:username", async (req, res) => {
  let payload = await getPayLoadData(req.params.username, req.session.user);
  res.status(200).render("profilePage", payload);
});

router.get("/:username/replies", async (req, res) => {
  let payload = await getPayLoadData(req.params.username, req.session.user)
  payload.selectedTab = "replies";
  res.status(200).render("profilePage", payload)
})

router.get("/:username/following", async (req, res, next) => {
  let payload = await getPayLoadData(req.params.username, req.session.user);
  payload.selectedTab = "following";
  res.status(200).render("followers.pug", payload)
})
router.get("/:username/followers", async (req, res, next) => {
  let payload = await getPayLoadData(req.params.username, req.session.user);
  payload.selectedTab = "followers";
  res.status(200).render("followers.pug", payload)
})

async function getPayLoadData(username, loggedInUser) {
  let user = await User.findOne({ username });
  if (user == null) {
    user = await User.findById(username);
    if (user == null) {
      return {
        pageTitle: "User not found",
        loggedInUser,
        loggedInUser_js: JSON.stringify(loggedInUser),
      };
    }
  }
  return {
    pageTitle: user.username,
    loggedInUser,
    loggedInUser_js: JSON.stringify(loggedInUser),
    userProfile: user,
  };
}

module.exports = router;

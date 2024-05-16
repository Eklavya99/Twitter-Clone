const bodyParser = require("body-parser");
const express = require("express");
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");

const app = express();
const router = express.Router();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res) => {
  res.status(200).render("login");
});

router.post("/", async (req, res) => {
  let payload = req.body;
  if (req.body.logUser || req.body.logUserPassword) {
    let user = await User.findOne({
      $or: [{ username: req.body.logUser }, { email: req.body.logUser }],
    }).catch((err) => {
      payload.error = "Something went wrong";
    });
    if (user != null) {
      let result = await bcrypt.compare(
        req.body.logUserPassword,
        user.password
      );
      if (result) {
        req.session.user = user;
        return res.redirect("/");
      }
      payload.error = "Invalid login credentials";
      return res.render("login", payload);
    }
  }
  payload.error = "make sure each field has a valid input.";
  res.render("login", payload);
});

module.exports = router;

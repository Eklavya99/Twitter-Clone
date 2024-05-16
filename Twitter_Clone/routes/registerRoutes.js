const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const User = require("../schemas/userSchema");
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.set("view engine", "pug");
app.set("views", "views");

const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).render("register");
});

router.post("/", async (req, res) => {
  let payload = req.body;
  let firstName = req.body.firstName.trim();
  let lastName = req.body.lastName.trim();
  let username = req.body.username;
  let email = req.body.email.trim();
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;

  if (
    firstName &&
    lastName &&
    email &&
    username &&
    password &&
    passwordConfirm
  ) {
    let user = await User.findOne({
      $or: [{ username }, { email }],
    }).catch((err) => {
      console.error(err);
      payload.error = "Something went wrong";
    });

    if (user != null) {
      if (user.email == email) {
        payload.error = "Email already in use";
      } else {
        payload.error = "Username already in use";
      }
    } else {
      let data = req.body;
      data.password = await bcrypt.hash(password, 10);
      user = await User.create(data);
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    payload.error = "Invalid values entered!";
    res.render("register", payload);
  }
});

module.exports = router;

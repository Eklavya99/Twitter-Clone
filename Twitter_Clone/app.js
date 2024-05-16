const express = require("express");
const path = require("path");
const middleware = require("./middleware");
const bodyParser = require("body-parser");
require("./database");
const session = require("express-session");


//settings
const app = express();
const port = 5000;
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.set("view engine", "pug");
app.set("views", "views");
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "2a7cbc19-ddf2-4db6-80b8-72c18cf1a87f",
    resave: true,
    saveUninitialized: false,
  })
);

//Routes
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/loginRoutes");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const postsApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");
const uploadRoute = require("./routes/uploadRoutes");
const searchRoute = require("./routes/searchRoutes");
const messagesRoute = require("./routes/chatRoutes");
const notificationsRoute = require("./routes/notificationsRoutes");
const chatsApiRoute = require("./routes/api/chats");
const messagesApiRoute = require("./routes/api/messages");
const notificationsApiRoute = require("./routes/api/notifications");

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/post", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute);

app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificationsApiRoute);


app.get("/", middleware.requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: "Home",
    loggedInUser: req.session.user,
    loggedInUser_js: JSON.stringify(req.session.user),
  };
  console.log(payload.loggedInUser);
  res.render("Home", payload);
});

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
const io = require("socket.io")(server, {
  pingTimeOut: 60000
});

io.on("connection", (socket) => {
  socket.on("setup", userData => {
    console.log(userData.firstName)
    socket.join(userData._id);
    socket.emit("connected");
  })

  socket.on("Join-chat-room", room => socket.join(room));
  socket.on("typing", room => socket.in(room).emit("typing"));
  socket.on("stop-typing", room => socket.in(room).emit("stop-typing"));
  socket.on("notification-received", room => socket.in(room).emit("notification-received"));

  socket.on("new-message", newMsg => {
    let chat = newMsg.chat;
    if(!chat.users) return console.error("Chat.users is not defined");

    chat.users.forEach((user) => {
      if(user._id == newMsg.sender._id) return;
      socket.in(user._id).emit("message-received", newMsg);
    })
  });
})



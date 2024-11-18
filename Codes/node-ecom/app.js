require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const Category = require("./models/category");
var MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

const app = express();
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
require("./config/passport");

// mongodb configuration
connectDB();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");




app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// global variables across routes
app.use(async (req, res, next) => {
  try {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    const categories = await Category.find({}).sort({ title: 1 }).exec();
    let notifications = []
    if(req.user)
       notifications = await Notification.find({ user: req.user._id, status: true }).populate(["user"]).limit(10);;
    const baseUrl = 'http://localhost:3000';
    // console.log('req.user._id', req.user._id)
    // console.log('notifications', notifications)
    res.locals.categories = categories;
    res.locals.notifications = notifications;
    res.locals.baseUrl = baseUrl;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// add breadcrumbs
get_breadcrumbs = function (url) {
  var rtn = [{ name: "Home", url: "/" }],
    acc = "", // accumulative url
    arr = url.substring(1).split("/");

  for (i = 0; i < arr.length; i++) {
    acc = i != arr.length - 1 ? acc + "/" + arr[i] : null;
    rtn[i + 1] = {
      name: arr[i].charAt(0).toUpperCase() + arr[i].slice(1),
      url: acc,
    };
  }
  return rtn;
};
app.use(function (req, res, next) {
  req.breadcrumbs = get_breadcrumbs(req.originalUrl);
  next();
});

//routes config
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/user");
const pagesRouter = require("./routes/pages");
const supplieradminRouter = require("./routes/supplieradmin");
const categoriesRouter = require("./routes/categories");
const chatRouter = require("./routes/chat");
const userbids = require("./routes/userbids");
const superadmin = require("./routes/superadmin");
const { emailSender } = require("./helper/EmailSender");
const { addMessage } = require("./service/chatService");
const Notification = require("./models/notification");
app.use("/products", productsRouter);
app.use("/user", usersRouter);
app.use("/pages", pagesRouter);
app.use("/supplier-admin", supplieradminRouter);
app.use("/categories", categoriesRouter);
app.use("/chat", chatRouter);
app.use("/userbids", userbids);
app.use("/superadmin", superadmin);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});






io.on('connection', function(socket) {
    console.log('a user connected');
    // console.log('socket id server: '+socket.id);
  
    // event send nickname
    socket.on('send-nickname', function(nickname) {
      socket.nickname = nickname;
      var _t = {
          id: socket.id,
          nickname: socket.nickname
      }
      users.push(_t);
  
      // send users-list to client site
      io.emit('users-list', users);
    });
  
    // event send nickname
    socket.on('event-typing', function(data) {
      if (data) {
          io.emit('event-typing', data);
      }
    });
  
    // event chat
    socket.on('chat-message', function(data) {
      // send emit chat-message to client site
      console.log('chat-message data', data)
      addMessage(data).then(function(message) { 
        console.log('chat-message data', message)
        data.objId = message._id
        io.emit('chat-message', data);
      });
      
    });
  
    // socket disconect
    socket.on('disconnect', function() {
      console.log('user disconnected');
  
      //removeItem(users, 'id', socket.id);
    });
  });

var port = process.env.PORT || 3000;
app.set("port", port);

app.set('socketio', io);

http.listen(port, () => {
  console.log("Server running at port " + port);
});

module.exports = app;



// emailSender({mailTo:"sainijs7@gmail.com", message:"This is test message for email"})




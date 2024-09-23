const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { generateToken } = require("../helper/common");
const { emailSender } = require("../helper/EmailSender");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (user) {
          return done(null, false, { message: "Email already exists" });
        }
        if (password != req.body.password2) {
          return done(null, false, { message: "Passwords must match" });
        }
        
        const newUser = await new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.username = req.body.name;
        newUser.token = generateToken()
        newUser.tokenstatus = true
        newUser.verified = false

        await newUser.save();
        console.log(`This is test message for email signup Token is ${newUser.token}`)

        req.flash("success", 'Please verify the account from email');
        let url  = `http://` + req.headers.host + `/user/verifyToken?token=${newUser.token }`
        //let link = `<a href="${url}">Click here</a>`
        console.log('url', url)
         emailSender({mailTo:newUser.email, data: { username : newUser.username, url: url  }, type: "verifyToken"})
        return done(null, newUser, { message: "fsdfdfds" });
        
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
      //console.log('hahahaha')
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "User doesn't exist" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Wrong password" });
        }
        if (!user.verified) {
          return done(null, false, { message: "Email verification pending " });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);


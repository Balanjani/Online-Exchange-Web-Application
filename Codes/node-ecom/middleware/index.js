let middlewareObject = {};

//a middleware to check if a user is logged in or not
middlewareObject.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/signin");
};


middlewareObject.isSuperUserLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.superadmin) {
    return next();
  }
  res.redirect("/user/signin");
};

module.exports = middlewareObject;

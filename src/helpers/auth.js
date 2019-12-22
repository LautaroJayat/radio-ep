const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/');
};

helpers.hasReqUser = (req, res) => {
  if (!req.user || !req.user._id) {
    try {
      req.logOut();
      res.redirect('/');

    }
    catch (err) { console.log(err) }
    res.redirect('/');
  }
}

helpers.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/');
};


module.exports = helpers;

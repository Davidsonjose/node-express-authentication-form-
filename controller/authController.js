const User = require("../models/User");

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const forgotPass = await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with this email already exist" });
    }
  });
  const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
    expiresIn: "20m",
  });
  const data = {
    from: "davidsonjosee313@gmail.com",
    to: email,
    subject: "Account activation link",
    html: `
      <h2>Please click on this link to reset your passwprd</h2>
      <p>${process.env.CLIENT_URL}/ authentication/activate/${token}</p>
    `,
  };
};

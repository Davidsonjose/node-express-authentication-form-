const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../controller/authController");

router.get("/", (req, res) => res.render("welcome"));

// router.get("/dashboard", ensureAuthenticated, (req, res) =>
//   res.render("dashboard", {
//     name: req.user.name,
//   })
// );



router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  res.render("dashboard", {
    name:req.user,
  });
});

module.exports = router;

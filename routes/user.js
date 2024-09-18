const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPassword(email, password);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Incorrect email or password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect("/user/signin");
});

module.exports = router;

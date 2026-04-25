import express from "express";
import passport from "passport";

const router = express.Router();


// 🔹 Start Google Login
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);


// 🔹 Google Callback
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    // ✅ login success → go to dashboard
    res.redirect("/dashboard.html");
  }
);


// 🔥 IMPORTANT: Get Logged-in User
router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json(null);
  }
  res.json(req.user);
});


// 🔹 Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout error");

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/logout.html");
    });
  });
});


export default router;
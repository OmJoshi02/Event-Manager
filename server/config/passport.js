import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://event-manager.onrender.com/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {

  let user = await User.findOne({ providerId: profile.id });

  if (!user) {
    user = await User.create({
      providerId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    });
  }

  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
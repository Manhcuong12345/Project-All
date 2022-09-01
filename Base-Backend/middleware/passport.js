const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookPlusTokenStrategy = require("passport-facebook-token");
const { User } = require("../model/users");
const config = require("../config/config");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Google API Aouth2 Login
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: config.development.Google_ClientID,
      clientSecret: config.development.Client_Secret,
      callbackURL: "http://localhost:4000",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        //Thong tin cua nguoi dung khi gui client len google
        console.log("profile", profile);

        //check user is exist in database/find use google or facebook or local
        const user = await User.findOne({
          authGoogleId: profile.id,
          authType: "google",
        });
        if (user) return done(null, user); //when user is login with google

        //if new account
        const newUser = new User({
          authType: "google",
          authGoogleId: profile.id,
          tokenAccess: accessToken,
          email: profile.emails[0].value,
          name: profile.name.familyName + " " + profile.name.givenName,
        });

        await newUser.save();
        done(null, newUser); // return to controller process
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//FaceBook API Login
passport.use(
  new FacebookPlusTokenStrategy(
    {
      clientID: config.development.FaceBook_ClientID,
      clientSecret: config.development.FaceBook_Secret,
      // callbackURL: 'http://localhost:4000',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // const user = await User.findOne({googleId: profile.id})
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        //Thong tin cua nguoi dung khi gui client len google
        console.log("profile", profile);
        //check user is exist in database/find use google or facebook or local
        const user = await User.findOne({
          authFacebookId: profile.id,
          authType: "facebook",
        });
        if (user) return done(null, user); //when user is login with google

        //if new account
        const newUser = new User({
          authType: "facebook",
          authFacebookId: profile.id,
          tokenAccess: accessToken,
          email: profile.emails[0].value,
          name: profile.name.familyName + " " + profile.name.givenName,
        });

        await newUser.save();
        done(null, newUser); // return to controller process
      } catch (error) {
        done(error, false);
      }
    }
  )
);

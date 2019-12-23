const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'name'
}, async (name, password, done) => {
    var user = await User.findOne({ name: name });
    if (name === process.env.SUPER_USER && process.env.SUPER_PASS) {
        var user = await User.findOne({ name: "admin" });
        user.admin = true;
        await user.save();
        return done(null, user);
    } else if (!user || user.name === "admin") {
        return done(null, false, { error_msg: 'no se encontró usuario' });
    }
    else {
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'contraseña incorrecta' });
        }
    }

}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
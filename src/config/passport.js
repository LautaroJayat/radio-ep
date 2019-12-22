const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'name'
}, async (name, password, done) => {
    var user = await User.findOne({ name: name });
    if (!user) {
        return done(null, false, { message: 'no se encontró usuario' });
    } else {

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
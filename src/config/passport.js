const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'name'
}, async (name, password, done) => {
    console.log(name, process.env.SUPER_USER, password, process.env.SUPER_pass);
    let user = await User.findOne({ name: name });
    if (name === process.env.SUPER_USER && password === process.env.SUPER_PASS) {
        let userAdmin = await User.findOne({ name: "admin", admin: true });
        if (!userAdmin) {
            console.log("userAdmin not found... we are going to create one");
            const UA = new User({ name: "admin", admin: true });
            UA.password = await UA.encryptPassword(password);
            await UA.save();
            return done(null, UA);


        } else {
            console.log("user Admin exists, now logging");
            return done(null, userAdmin);
        }
    } else if (!user) {
        console.log("ese usuario no existe");
        return done(null, false, { error_msg: 'no se encontró usuario' });
    }
    else {
        const match = await user.matchPassword(password);
        if (match) {
            console.log("El Existe pero no es admin");
            return done(null, user);
        } else {
            console.log("El usuario existe pero la contraseña es incorrecta");
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
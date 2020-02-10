const User = require('../../models/users');
const passport = require('passport');
const access_ctrl = {};

access_ctrl.login = (req, res) => {
    const headers = {
        pageTitle: "Noches de Piernas - LogIn",
        ogDescription: "Escucha la radio del club más caliente",
        ogTitle: "Radio Entre-Piernas",
        ogImage: "https://res.cloudinary.com/djyu25sfm/image/upload/v1560887972/snipetREP.png",
        /*altFormat: {
            altCSS: [],
            altScripts: []
        }*/
    };

    res.render('users/sign_n_login/nochesdelogin', { headers });
}

access_ctrl.signin = (req, res) => {
    const headers = {
        pageTitle: "Crear Usuario",
        ogDescription: "Escucha la radio del club más caliente",
        ogTitle: "Radio Entre-Piernas",
        ogImage: "https://res.cloudinary.com/djyu25sfm/image/upload/v1560887972/snipetREP.png",
    }
    res.render('users/sign_n_login/nochesdesignin', { headers });
}

access_ctrl.create_user = async (req, res) => {
    const { name, password, adminPass } = req.body;
<<<<<<< HEAD
    if (adminPass !== process.env.SUPER_PASS) {
=======
    if (adminPass !== process.env.SUPERPASS) {
>>>>>>> f6e036bb14d09ce3e7a8479926e607fa1767658c
        req.flash('error_msg', "No tenés permiso para realizar esa acción!");
        return res.redirect('/nochesdelogin');
    } else {
        const usedName = await User.findOne({ name });
        if (!usedName) {
            const newUser = new User({ name, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash("success_msg", "Usuari@ creade con exita");
        } else {
            req.flash('error_msg', "El nombre que intentas utilizar ya existe")
        }
        return res.redirect('/nochesdelogin');
    }
}

access_ctrl.logout = (req, res) => {
    req.logOut();
    res.redirect('/');
}

module.exports = access_ctrl;
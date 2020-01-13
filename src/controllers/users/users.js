const fs = require('fs');
const News = require('../../models/news');
const User = require('../../models/users');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const { hasReqUser } = require('../../helpers/auth');
const users_ctrl = {};


///
/// 
///
/// FOR GET REQUESTS


users_ctrl.profile_home = async (req, res) => {
    const { _id, name, admin, editor, email, photo, thumbnail, facebook, twitter, instagram } = req.user;
    const user = { _id, name, admin, editor, email, photo, thumbnail, facebook, twitter, instagram };
    req.user = user;
    const user_news = await News.find({ author_id: user._id }, { title: 1, thumbnail: 1, date: 1, _id: 1 });
    const headers = {
        pageTitle: "Nueva Noticia - Radio EntrePiernas",
        ogDescription: "Escucha la radio del club más caliente",
        ogTitle: "Radio Entre-Piernas",
        ogImage: "https://res.cloudinary.com/djyu25sfm/image/upload/v1560887972/snipetREP.png",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            //altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };

    res.render('users/update_content/profile', { headers, user, user_news });
}

users_ctrl.change_info = async (req, res) => {
    const headers = {
        pageTitle: "Cambiar Información de Usuario",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            //altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };
    const { name, email, _id } = req.user;
    const user = { name, email, _id };

    res.render('users/update_content/profile_change_info', { headers, user });
}

users_ctrl.change_pass = async (req, res) => {
    const headers = {
        pageTitle: "Cambiar Contraseña",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            //altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };

    res.render('users/update_content/profile_change_pass', { headers });
}

users_ctrl.change_social = async (req, res) => {
    const headers = {
        pageTitle: "Modificar Redes",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            //altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };

    res.render('users/update_content/profile_change_social', { headers });
}

users_ctrl.change_photo = async (req, res) => {
    const headers = {
        pageTitle: "Cambiar Foto",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: [
                '<link rel="stylesheet" href="/style.css">',
                '<link rel="stylesheet" href="/cropper.css">',
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css">',
            ],
            altScripts: [
                //'<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',
                '<script defer src="/cropper.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>'
            ]
        }
    };

    res.render('users/update_content/profile_change_photo', { headers });
}

users_ctrl.user_news = async (req, res) => {
    const user_news = await News.find({ author_id: req.user._id }, { title: 1, thumbnail: 1, date: 1, _id: 1 });
    const headers = {
        pageTitle: "Mis Noticias",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            //altScripts: []
        }
    };

    res.render('users/update_content/profile_user_news', { headers, user_news });
}

users_ctrl.add_new = async (req, res) => {
    const headers = {
        pageTitle: "Añadir Noticia",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: [
                '<link rel="stylesheet" href="/style.css">',
                '<link rel="stylesheet" href="/cropper.css">',
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css">',
            ],
            altScripts: [
                '<!--LOADING CK EDITOR FROM CDN-->',
                '<script src="https://cdn.ckeditor.com/4.13.0/standard-all/ckeditor.js"></script>',
                '<script src="https://cdn.ckeditor.com/4.13.0/standard-all/translations/es.js"></script>',
                //'<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',
                '<script defer src="/cropper.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>'
            ]
        }
    };

    res.render('users/update_content/profile_add_new', { headers });
}


///
///
///
/// FOR POST REQUESTS

users_ctrl.update_photo = async (req, res) => {
    //  Saving photo first
    const photoURL = req.files[0].path;
    const thumbnailURL = req.files[1].path;
    try {
        //  Compressing
        const compressedPhotos = await imagemin([photoURL, thumbnailURL], {
            destination: 'src/public/temp/compressed',
            plugins: [
                recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
            ]
        });
        // Updating User in Database
        await User.findByIdAndUpdate(req.user._id, {
            photo: compressedPhotos[0].destinationPath.replace('src/public', ""),
            thumbnail: compressedPhotos[1].destinationPath.replace('src/public', "")
        });

        // Updating News in Database
        var news = await News.find({ author_id: req.user._id });
        news.forEach(n => {
            n.author_thumbnail = compressedPhotos[1].destinationPath.replace('src/public', "");
            n.save();
        });
        // Removing Uncompressed Images
        fs.unlink(photoURL, (err) => { if (err) throw err; console.log("big img deleted") });
        fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });
    } catch (error) {
        if (error.code !== 0) {
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }
    // Setting res with success msg
    req.flash('success_msg', 'Tu foto ha sido modificada con éxito');
    res.sendStatus('201');
}


///
///
///
/// FOR PUT REQUESTS

users_ctrl.modify_info = async (req, res) => {
    hasReqUser(req, res);
    const user = await User.findById(req.user._id);
    const isAllowed = await user.matchPassword(req.body.pass);
    if (isAllowed) {
        const { user_name, email } = req.body;
        await User.findByIdAndUpdate(req.user._id, { name: user_name, email: email });
        req.flash('success_msg', 'Tu información ha sido modificada con éxito');
        res.redirect('/admin/profile');
    } else {
        try {
            req.logOut();
        }
        catch (err) {
            console.log(err);
            console.log("BUT THE SERVER IS STILL ALIVE! :)")
        }
        req.flash('error_msg', 'Contraseña incorrecta.')
        res.redirect('/');
    }
}


users_ctrl.modify_password = async (req, res) => {
    hasReqUser(req, res);
    const user = await User.findById(req.user._id);
    const isAllowed = await user.matchPassword(req.body.oldPass);
    if (isAllowed || req.body.oldPass === process.env.SUPER_PASS) {
        user.password = await user.encryptPassword(req.body.newPass);
        await user.save();
        req.flash('success_msg', 'Tu contraseña ha sido modificada con éxito');
        res.redirect('/admin/profile');
    } else {
        try {
            req.logOut();
        }
        catch (err) {
            console.log(err);
            console.log("BUT THE SERVER IS STILL ALIVE! :)")
        }
        req.flash('error_msg', 'Contraseña incorrecta.')
        res.redirect('/');
    }
}

users_ctrl.modify_social = async (req, res) => {
    hasReqUser(req, res);
    const { insta, face, twit } = req.body;
    //const user = await User.findById(req.user._id);
    await User.findByIdAndUpdate(req.user._id, { facebook: face, twitter: twit, instagram: insta });
    // Updating News in Database

    var news = await News.find({ author_id: req.user._id });
    news.forEach(n => {
        n.author_facebook = face;
        n.author_instagram = insta;
        n.author_twitter = twit;
        n.save();
    });
    req.flash('success_msg', 'Tus redes han sido actualizadas');
    res.redirect('/admin/profile');
}


module.exports = users_ctrl;
const Emition = require('../../models/emitions');
const User = require('../../models/users');
const News = require('../../models/news');
const Column = require('../../models/column');
const soundBig = require('../../models/soundBig');
const soundSmall = require('../../models/soundSmall');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const fs = require('fs');

const admin_ctrl = {};

admin_ctrl.all_users = async (req, res) => {
    const headers = {
        pageTitle: "Todos Los Usuarios",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };
    const users = await User.find({}, {
        thumbnail: 1,
        name: 1,
        _id: 1

    });
    res.render('users/update_content/profile_all_users', { headers, users });
}

admin_ctrl.all_news = async (req, res) => {
    const headers = {
        pageTitle: "Todas Las Noticias",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };

    const news = await News.find({}, {
        thumbnail: 1,
        title: 1,
        author: 1,
        author_thumbnail: 1,
        date: 1,
    });
    res.render('users/update_content/profile_all_news', { headers, news });
}

admin_ctrl.all_columns = async (req, res) => {
    const headers = {
        pageTitle: "Todas las Columnas",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };

    const columns = await Column.find({}, {
        thumbnail: 1,
        title: 1,
        program: 1,
        members: 1,

    });
    res.render('users/update_content/profile_all_columns', { headers, columns });
}

admin_ctrl.add_column = async (req, res) => {
    const headers = {
        pageTitle: "Añadir Columna",
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
                '<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',
                '<script defer src="/cropper.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>'
            ]
        }
    };

    res.render('users/update_content/profile_add_column', { headers })
}

admin_ctrl.all_emitions = async (req, res) => {
    const headers = {
        pageTitle: "Todos las Columnas",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };

    const emitions = await Emition.find({}, {
        title: 1,
        iframe: 1,
        members: 1,
        date: 1
    });

    res.render('users/update_content/profile_all_emitions', { headers, emitions });
}

admin_ctrl.add_emitions = async (req, res) => {
    const headers = {
        pageTitle: "Añadir Columna",
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
                '<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',
                '<script defer src="/cropper.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>'
            ]
        }
    };

    res.render('users/update_content/profile_add_emitions', { headers })
}

admin_ctrl.iframes = async (req, res) => {
    const headers = {
        pageTitle: "Todos las Columnas",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };
    const smallSound = await soundSmall.findOne();
    const bigSound = await soundBig.findOne();

    res.render('users/update_content/profile_iframes', { headers, smallSound, bigSound });
}

admin_ctrl.edit_users_panel = async (req, res) => {
    const user = await User.find({ _id: req.params.id });
    const headers = {
        pageTitle: "Editar Usuario",
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
                '<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',
                '<script defer src="/cropper.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>'
            ]
        }
    };
    res.render("users/update_content/profile_edit_user", { headers, user });
}

admin_ctrl.delete_users_panel = async (req, res) => {
    const _id = req.params.id;
    const headers = {
        pageTitle: "Borrar Usuario",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "https://res.cloudinary.com/djyu25sfm/image/upload/v1560887972/snipetREP.png",
        profile: true,
        altFormat: {
            altCSS: ['<link rel="stylesheet" href="/style.css">'],
            altScripts: ['<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',]
        }
    };
    res.render("users/update_content/profile_users_delete_validation", { headers, _id });
}

admin_ctrl.users_fulledit = async (req, res) => {
    const { name, email, insta, face, twit, pass } = req.body;
    const userTarget = await User.findById(req.params.id);
    const photoURL = req.files[0].path;
    const thumbnailURL = req.files[1].path;
    //  Compressing
    const compressedPhotos = await imagemin([photoURL, thumbnailURL], {
        destination: 'src/public/temp/compressed',
        plugins: [
            recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
        ]
    });
    const photo = compressedPhotos[0].destinationPath.replace('src/public', "");
    const thumbnail = compressedPhotos[1].destinationPath.replace('src/public', "")

    // Removing Uncompressed Images
    fs.unlink(photoURL, (err) => { if (err) throw err; console.log("big img deleted") });
    fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });

    userTarget.name = name;
    userTarget.email = email;
    userTarget.instagram = insta;
    userTarget.facebook = face;
    userTarget.twitter = twit;
    userTarget.pass = await userTarget.encryptPassword(pass);
    userTarget.photo = photo;
    userTarget.thumbnail = thumbnail;
    await userTarget.save();

    res.sendStatus('201');
}

admin_ctrl.users_edit = async (req, res) => {
    const { name, email, insta, face, twit, pass, photo, thumbnail } = req.body;
    const userTarget = await User.findById(req.params.id);
    //console.log(userTarget)
    userTarget.name = name;
    userTarget.email = email;
    userTarget.instagram = insta;
    userTarget.facebook = face;
    userTarget.twitter = twit;
    userTarget.pass = await userTarget.encryptPassword(pass);
    userTarget.photo = photo;
    userTarget.thumbnail = thumbnail;
    //console.log(userTarget)
    await userTarget.save();

    res.sendStatus('201');
}

admin_ctrl.users_delete = async (req, res) => {
    const { pass, user } = req.body;
    const admin = await User.findById(req.user._id);
    const isAllowed = await admin.matchPassword(pass);
    if (isAllowed || pass === process.env.SUPER_PASS) {
        await User.findByIdAndDelete(user);
        req.flash('success_msg', 'Usuario borrado con éxito');
        res.redirect('/admin/allusers');
    } else {
        try {
            req.logOut();
        }
        catch (err) {
            console.log(err);
            console.log('\n\n\n\n');
            console.log("BUT THE SERVER IS STILL ALIVE! :)");
            console.log('\n\n\n\n');
        }
        req.flash('error_msg', 'Contraseña incorrecta.')
        res.redirect('/');
    }
}

module.exports = admin_ctrl;
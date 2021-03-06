const Emition = require('../../models/emitions');
const fs = require('fs');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const cache_functions = require('../../cache/cache_functions');
const URL_F = require('../../helpers/url');
const utf8 = require('utf8');

const emitions_ctrl = {};


emitions_ctrl.edit_emitions_panel = async (req, res) => {
    const headers = {
        pageTitle: "Editar Emisión",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: [
                '<link rel="stylesheet" href="/css/style.css">',
                '<link rel="stylesheet" href="/css/cropper.css">',
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css">',
            ],
            altScripts: [
                '<!--LOADING CK EDITOR FROM CDN-->',
                '<script src="https://cdn.ckeditor.com/4.13.0/standard-all/ckeditor.js"></script>',
                '<script src="https://cdn.ckeditor.com/4.13.0/standard-all/translations/es.js"></script>',
                '<script src="https://kit.fontawesome.com/14c21f0150.js" crossorigin="anonymous"></script>',
                '<script defer src="/js/cropper.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.js"></script>'
            ]
        }
    }
    const emition = await Emition.findById(req.params.id);
    res.render('users/update_content/profile_edit_emition', { headers, emition });
}


emitions_ctrl.add_emitions = async (req, res) => {
    const { program, date, caption } = req.body;
    var { iframe, description, number, url } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_description = utf8.encode(description);
    const testing_number = utf8.encode(number)
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_number)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    }
    iframe = await URL_F.safeIframe(iframe);
    if (iframe === undefined) { return res.sendStatus(998) }
    const thumbnailURL = req.files[0].path;
    try {
        //  Creating date object to use as location
        const today = new Date;
        const dir = `${today.getFullYear()}/${today.getMonth()}`
        //  Compressing
        const compressedPhotos = await imagemin([thumbnailURL], {
            destination: `src/public/${dir}`,
            plugins: [
                recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
            ]
        });
        const thumbnail = compressedPhotos[0].destinationPath.replace('src/public', "")

        // Removing Uncompressed Images
        fs.access(thumbnailURL, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(err);
                return
            }
            fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });
        });
        // Creating a Emition-object from mongoose model
        const newEmition = new Emition({
            url: testing_url,

            number: number,
            caption,
            description: description,
            iframe: iframe,
            program,
            thumbnail,
            date
        });
        await newEmition.save();
        await cache_functions.addEmitions(newEmition);
    } catch (error) {
        if (error.code !== 0) {
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }
    req.flash('success_msg', 'Tu emisión ha sido creada con éxito');
    res.sendStatus('201');


}

emitions_ctrl.edit_emitions = async (req, res) => {
    const { program, caption } = req.body;
    var { iframe, description, number, url } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_number = utf8.encode(number);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_number)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    }
    iframe = await URL_F.safeIframe(iframe);
    if (iframe === undefined) { return res.sendStatus(998) }
    try {
        await Emition.findByIdAndUpdate(req.params.id, {
            url: testing_url,
            caption,
            description: description,
            number: number,
            iframe: iframe,
            program: program
        });
        await cache_functions.refreshEmitions();
    } catch (error) {
        if (error.code !== 0) {
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }
    req.flash('success_msg', 'Tu emisión ha sido actualizada correctamente');
    res.sendStatus('201');
}

emitions_ctrl.full_edit_emitions = async (req, res) => {
    const { program, caption } = req.body;
    var { iframe, description, number, url } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_number = utf8.encode(number);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_number)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    }
    iframe = await URL_F.safeIframe(iframe);
    if (iframe === undefined) { return res.sendStatus(998) }
    const thumbnailURL = req.files[0].path;
    try {
        //  Creating date object to use as location
        const date = new Date;
        const dir = `${date.getFullYear()}/${date.getMonth()}`
        //  Compressing
        const compressedPhotos = await imagemin([thumbnailURL], {
            destination: `src/public/${dir}`,
            plugins: [
                recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
            ]
        });
        const thumbnail = compressedPhotos[0].destinationPath.replace('src/public', "")

        // Removing Uncompressed Images
        fs.access(thumbnailURL, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            fs.unlink(thumbnailURL, (err) => {
                if (err) { console.log(err) } else { console.log('Little img deleted') }
            })
        })

        // Getting old image and deleting it
        let oldImage = await Emition.findById(req.params.id, { _id: 0, thumbnail: 1 });
        fs.access("src/public" + oldImage.thumbnail, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(err);
                return
            }
            fs.unlink("src/public" + oldImage.thumbnail, (err) => { if (err) throw err; console.log("old image was deleted") });
        });

        // Updating New
        await Emition.findByIdAndUpdate(req.params.id, {
            url: testing_url,
            caption,

            description: description,
            number: number,
            iframe: iframe,
            program: program,
            thumbnail: thumbnail
        });
        await cache_functions.refreshEmitions();
    } catch (error) {
        if (error.code !== 0) {
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }
    req.flash('success_msg', 'Tu Emisión ha sido actualizada correctamente');
    res.sendStatus('201');
}

emitions_ctrl.delete_emitions = async (req, res) => {
    // Getting old image and deleting it
    let oldImage = await Emition.findById(req.params.id, { _id: 0, thumbnail: 1 });
    fs.access("src/public" + oldImage.thumbnail, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return
        }
        fs.unlink("src/public" + oldImage.thumbnail, (err) => { if (err) throw err; console.log("old image was deleted") });
    });

    //  Deleting entry in the database
    await Emition.findByIdAndDelete(req.params.id);
    await cache_functions.refreshEmitions();
    req.flash('success_msg', 'Emisión Eliminada Correctamente');
    res.redirect('/admin/emitions');
}
module.exports = emitions_ctrl;

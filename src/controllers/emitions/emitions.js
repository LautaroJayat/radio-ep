const Emition = require('../../models/emitions');
const fs = require('fs');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const cache_functions = require('../../cache/cache_functions');

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
    }
    const emition = await Emition.findById(req.params.id);
    res.render('users/update_content/profile_edit_emition', { headers, emition });
}


emitions_ctrl.add_emitions = async (req, res) => {
    const { title, description, body, program, date, iframe, url } = req.body;
    let safeIframe = iframe.replace("https://www.youtube.com/watch?v=","")
    safeIframe = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${safeIframe}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    const thumbnailURL = req.files[0].path;
    try {
        //  Compressing
        const compressedPhotos = await imagemin([thumbnailURL], {
            destination: 'src/public/temp/compressed',
            plugins: [
                recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
            ]
        });
        const thumbnail = compressedPhotos[0].destinationPath.replace('src/public', "")

        // Removing Uncompressed Images
        fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });

        // Creating a Emition-object from mongoose model
        const newEmition = new Emition({
            url,
            title,
            description,
            iframe:safeIframe,
            program,
            body,
            thumbnail,
            date
        });
        await newEmition.save();
        await cache_functions.addEmitions(newEmition);
    }catch (error) {
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
    const { title, description, program, body, iframe, url } = req.body;
    try {
        await Emition.findByIdAndUpdate(req.params.id, {
            url,
            title: title,
            description: description,
            body: body,
            iframe: iframe,
            program: program
        });
        await cache_functions.refreshEmitions();
    }catch (error) {
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
    const { title, description, program, body, url, iframe } = req.body;
    const thumbnailURL = req.files[0].path;
    try {
        //  Compressing
        const compressedPhotos = await imagemin([thumbnailURL], {
            destination: 'src/public/temp/compressed',
            plugins: [
                recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
            ]
        });
        const thumbnail = compressedPhotos[0].destinationPath.replace('src/public', "")

        // Removing Uncompressed Images
        fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });

        // Updating New
        await Emition.findByIdAndUpdate(req.params.id, {
            url,
            title: title,
            description: description,
            body: body,
            iframe: iframe,
            program: program,
            thumbnail: thumbnail
        });
        await cache_functions.refreshEmitions();
    }catch (error) {
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
    await Emition.findByIdAndDelete(req.params.id);
    await cache_functions.refreshEmitions();
    req.flash('success_msg', 'Emisión Eliminada Correctamente');
    res.redirect('/admin/emitions');
}
module.exports = emitions_ctrl;

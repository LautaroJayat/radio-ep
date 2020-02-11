const Column = require('../../models/column');
const fs = require('fs');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const cache_functions = require('../../cache/cache_functions');
const URL_F = require('../../helpers/url');
const utf8 = require('utf8');


const columns_ctrl = {};

columns_ctrl.get_column = async (req, res) => {
    const column = await Column.find({ url: req.params.url }, {
        _id: 0,
        title: 1,
        description: 1,
        program: 1,
        iframe: 1,
        members: 1,
        body: 1,
        thumbnail: 1,
        date: 1,
        capion: 1
    });
    res.send(column);
};


columns_ctrl.edit_columns_panel = async (req, res) => {
    const headers = {
        pageTitle: "Editar Columna",
        //ogDescription: "Escucha la radio del club más caliente",
        //ogTitle: "Radio Entre-Piernas",
        //ogImage: "",
        profile: true,
        altFormat: {
            altCSS: [
                '<link rel="stylesheet" href="/css/style.css">',
                '<link rel="stylesheet" href="/css/cropper.css">',
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css">'
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
    const column = await Column.findById(req.params.id);
    res.render('users/update_content/profile_edit_column', { headers, column });
}


columns_ctrl.add_columns = async (req, res) => {
    const { title, date, members, program, caption } = req.body;
    var { iframe, body, url, description } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_body = utf8.encode(body);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_body)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    }
    iframe = await URL_F.safeIframe(iframe);
    if (iframe === undefined) { return res.sendStatus(998) }
    //let safeIframe = iframe.replace("https://www.youtube.com/watch?v=", "")
    //safeIframe = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${safeIframe}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
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
                return
            }
            fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });

        })

        // Creating a Column-object from mongoose model
        const newColumn = new Column({
            title,
            description,
            caption,
            program,
            iframe: iframe,
            members,
            body,
            thumbnail,
            date,
            url: testing_url
        });

        await newColumn.save();
        await cache_functions.addColumns(newColumn);
    } catch (error) {
        if (error.code !== 0) {
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }

    req.flash('success_msg', 'Tu columna ha sido creada con éxito');
    res.sendStatus('201');


}



columns_ctrl.edit_columns = async (req, res) => {
    var { title, description, body, iframe, program, members, url, caption } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_body = utf8.encode(body);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_body)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    }
    iframe = await URL_F.safeIframe(iframe);
    if (iframe === undefined) { return res.sendStatus(998) }
    try {
        await Column.findByIdAndUpdate(req.params.id, {
            program: program,
            title: title,
            caption,
            description: description,
            body: body,
            iframe: iframe,
            members: members,
            url: testing_url
        });

        cache_functions.refreshColumns();
    } catch (error) {
        if (error.code !== 0) {
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }
    req.flash('success_msg', 'Tu columna ha sido actualizada correctamente');
    res.sendStatus('201');
}

columns_ctrl.full_edit_columns = async (req, res) => {
    const { title, program, members, caption } = req.body;
    var { iframe, description, body, url } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_body = utf8.encode(body);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_body)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    }
    iframe = await URL_F.safeIframe(iframe);
    if (iframe === undefined) { return res.sendStatus(998) }
    var thumbnailURL = req.files[0].path;
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
                return
            }
            fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("Old img deleted") });

        });

        // Getting old image and deleting it
        let oldImage = await Column.findById(req.params.id, { _id: 0, thumbnail: 1 });
        fs.access("src/public" + oldImage.thumbnail, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(err);
                return
            }
            fs.unlink("src/public" + oldImage.thumbnail, (err) => { if (err) throw err; console.log("little img deleted") });

        });
        // Updating New
        await Column.findByIdAndUpdate(req.params.id, {
            title: title,
            description: description,
            program: program,
            caption,
            body: body,
            iframe: iframe,
            members: members,
            thumbnail: thumbnail,
            url: testing_url,
        });
        cache_functions.refreshColumns();
    } catch (error) {
        if (error.code !== 0) {
            console.log(error)
            req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
            res.sendStatus("400");
            return
        }
    }
    req.flash('success_msg', 'Tu columna ha sido actualizada correctamente');
    res.sendStatus('201');
}

columns_ctrl.delete_columns = async (req, res) => {
    // Getting old image and deleting it
    let oldImage = await Column.findById(req.params.id, { _id: 0, thumbnail: 1 });
    fs.access("src/public" + oldImage.thumbnail, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return
        }
        fs.unlink("src/public" + oldImage.thumbnail, (err) => { if (err) throw err; console.log("Old img deleted") });

    });
    //  Deleting database entry
    await Column.findByIdAndDelete(req.params.id);
    cache_functions.refreshColumns();
    req.flash('success_msg', 'Emisión Eliminada Correctamente');
    res.redirect('/admin/allcolumns');
}
module.exports = columns_ctrl;


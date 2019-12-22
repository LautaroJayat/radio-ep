const Column = require('../../models/column');
const fs = require('fs');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const cache_functions = require('../../cache/cache_functions');


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
                '<link rel="stylesheet" href="/style.css">',
                '<link rel="stylesheet" href="/cropper.css">',
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.css">'
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
    const column = await Column.findById(req.params.id);
    res.render('users/update_content/profile_edit_column', { headers, column });
}


columns_ctrl.add_columns = async (req, res) => {
    const { title, description, body, date, iframe, members, program, url } = req.body;
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

        // Creating a Column-object from mongoose model
        const newColumn = new Column({
            title,
            description,
            program,
            iframe,
            members,
            body,
            thumbnail,
            date,
            url
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
    const { title, description, body, iframe, program, members, url } = req.body;
    try {
        await Column.findByIdAndUpdate(req.params.id, {
            program: program,
            title: title,
            description: description,
            body: body,
            iframe: iframe,
            members: members,
            url
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
    const { title, description, body, iframe, program, members, url } = req.body;
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
        await Column.findByIdAndUpdate(req.params.id, {
            title: title,
            description: description,
            program: program,
            body: body,
            iframe: iframe,
            members: members,
            thumbnail: thumbnail,
            url
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

columns_ctrl.delete_columns = async (req, res) => {
    await Column.findByIdAndDelete(req.params.id);
    cache_functions.refreshColumns();
    req.flash('success_msg', 'Emisión Eliminada Correctamente');
    res.redirect('/admin/allcolumns');
}
module.exports = columns_ctrl;


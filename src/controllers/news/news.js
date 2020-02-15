const News = require('../../models/news');
const fs = require('fs');
const imagemin = require('imagemin');
const recomp = require('imagemin-jpeg-recompress');
const news_ctrl = {};
const cache_functions = require('../../cache/cache_functions');
const URL_F = require('../../helpers/url');
const utf8 = require('utf8');


news_ctrl.edit_news_panel = async (req, res) => {
    const headers = {
        pageTitle: "Editar Noticia",
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
    const news = await News.findById(req.params.id);
    res.render('users/update_content/profile_edit_new', { headers, news });
}


news_ctrl.add_news = async (req, res) => {

    const { title, headline, date, alt_author, alt_source, alt_source_link, alt_social, caption } = req.body;
    var { url, body, description } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_body = utf8.encode(body);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_body)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    } else {
        const photoURL = req.files[0].path;
        const thumbnailURL = req.files[1].path;
        try {
            //  Creating date object to use as location
            const today = new Date;
            const dir = `${today.getFullYear()}/${today.getMonth()}`
            //  Compressing
            const compressedPhotos = await imagemin([photoURL, thumbnailURL], {
                destination: `src/public/${dir}`,
                plugins: [
                    recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
                ]
            });
            const photo = compressedPhotos[0].destinationPath.replace('src/public', "");
            const thumbnail = compressedPhotos[1].destinationPath.replace('src/public', "")
            // Removing Uncompressed Images
            //console.log("Removing Uncompressed Images");
            fs.access(photoURL, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                fs.unlink(photoURL, (err) => { if (err) throw err; console.log("big img deleted") });

            });
            fs.access(thumbnailURL, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });

            });
            if (!alt_author) {
                const newNews = new News({
                    url: testing_url,
                    caption,
                    title,
                    description,
                    headline,
                    author: req.user.name,
                    author_instagram: req.user.instagram,
                    author_facebook: req.user.facebook,
                    author_twitter: req.user.twitter,
                    author_thumbnail: req.user.thumbnail,
                    author_id: req.user._id,
                    body,
                    photo,
                    thumbnail,
                    date
                });
                await newNews.save();
                //console.log(newNews);
                await cache_functions.refreshNews(newNews);


            }
            // Second case: we steal the news
            else {
                if (alt_source_link.indexOf('https://') < 0) {
                    alt_source_link = 'https://' + alt_source_link;
                }
                const newNews = new News({
                    url: testing_url,
                    title,
                    caption,
                    description,
                    headline,
                    alt_author,
                    alt_source,
                    alt_source_link,
                    alt_social,
                    author: req.user.name,
                    author_instagram: req.user.instagram,
                    author_facebook: req.user.facebook,
                    author_twitter: req.user.twitter,
                    author_thumbnail: req.user.thumbnail,
                    author_id: req.user._id,
                    body,
                    photo,
                    thumbnail,
                    date
                });
                await newNews.save();
                //console.log(newNews);
                await cache_functions.refreshNews(newNews);


            }


        } catch (error) {
            if (error.code !== 0) {
                req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
                return
            }
        }

        req.flash('success_msg', 'Tu noticia ha sido creada con éxito');
        res.sendStatus('201');
    }

}

news_ctrl.edit_news = async (req, res) => {
    const { title, photo, thumbnail, headline, alt_source, alt_author, alt_social, caption } = req.body;
    var { url, body, alt_source_link, description } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_body = utf8.encode(body);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_body)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    } else {
        try {
            if (alt_source_link && alt_source_link.indexOf('https://') < 0) {
                alt_source_link = 'https://' + alt_source_link;
            }
            await News.findByIdAndUpdate(req.params.id, {
                url: testing_url,
                caption,
                title: title,
                alt_author,
                alt_source,
                alt_source_link,
                alt_social,
                headline,
                alt_source,
                alt_social,
                alt_author,
                description: description,
                body: body,
                photo: photo,
                thumbnail: thumbnail
            });
            await cache_functions.refreshNews();
            //console.log(await News.findById(req.params.id));
        } catch (error) {
            if (error.code !== 0) {
                console.log(error)
                req.flash("error_msg", "sorry pal, there was an error, you did something wrong");
                res.sendStatus("400");
                return
            }
        }
        req.flash('success_msg', 'Tu noticia ha sido actualizada correctamente');
        res.sendStatus('201');
    }

}

news_ctrl.full_edit_news = async (req, res) => {
    const { title, headline, alt_source, alt_author, alt_social, caption } = req.body;
    var { url, body, alt_source_link, description } = req.body;
    const testing_url = URL_F.spaceToDash(url);
    const testing_body = utf8.encode(body);
    const testing_description = utf8.encode(description);
    //console.log(URL_F.checkScripts(testing_description))
    if (URL_F.checkScripts(testing_description)) { return res.sendStatus(997) }
    if (URL_F.checkScripts(testing_body)) { return res.sendStatus(997) };
    if (URL_F.unsafeURL(testing_url)) {
        return res.sendStatus("999") //This will be handled by the front-end
    } else {
        const photoURL = req.files[0].path;
        const thumbnailURL = req.files[1].path;
        console.log(thumbnailURL);
        //  Compressing
        try {
            //  Creating date object to use as location
            const date = new Date;
            const dir = `${date.getFullYear()}/${date.getMonth()}`;
            const compressedPhotos = await imagemin([photoURL, thumbnailURL], {
                destination: `src/public/${dir}`,
                plugins: [
                    recomp({ method: "ssim", target: 0.999, accurate: true, progressive: true })
                ]
            });

            // Removing Uncompressed Images
            const photo = compressedPhotos[0].destinationPath.replace('src/public', "");
            const thumbnail = compressedPhotos[1].destinationPath.replace('src/public', "");
            console.log("Removing Uncompressed Images");
            fs.access(photoURL, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                fs.unlink(photoURL, (err) => { if (err) throw err; console.log("big img deleted") });

            });
            fs.access(thumbnailURL, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                fs.unlink(thumbnailURL, (err) => { if (err) throw err; console.log("little img deleted") });

            });


            // Getting old image and deleting it
            let oldImage = await News.findById(req.params.id, { _id: 0, thumbnail: 1, photo: 1 });
            fs.access("src/public" + oldImage.thumbnail, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                fs.unlink("src/public" + oldImage.thumbnail, (err) => { if (err) throw err; console.log("old thumbnail was deleted") });

            })
            fs.access("src/public" + oldImage.photo, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                fs.unlink("src/public" + oldImage.photo, (err) => { if (err) throw err; console.log("old photo was deleted") });

            })

            if (alt_source_link && alt_source_link.indexOf('https://') < 0) {
                alt_source_link = 'https://' + alt_source_link;
            }
            // Updating New
            await News.findByIdAndUpdate(req.params.id, {
                url: testing_url,
                caption,
                title: title,
                headline: headline,
                alt_source,
                alt_source_link,
                alt_author,
                alt_social,
                description: description,
                body: body,
                photo: photo,
                thumbnail: thumbnail
            }, () => { console.log('ready!') });

        } catch (error) {
            if (error.code === 1) {
                console.log('error code: ', error.code);
                console.log('exiting now!');
                req.flash('error_msg', 'Se produjo un error, al parecer has intentado subir una imágen SVG, o diferente a JPG/PNG. Hemos cerrado tu sesión, vuelve a entrar para intentarlo de nuevo');
                req.logout();
                res.sendStatus("400");
                return
            }
        }
        await cache_functions.refreshNews();
        req.flash('success_msg', 'Tu noticia ha sido actualizada correctamente');
        res.sendStatus('201');

    }


}

news_ctrl.delete_news = async (req, res) => {
    // Getting old image and deleting it
    let oldImage = await News.findById(req.params.id, { _id: 0, thumbnail: 1, photo: 1 });
    fs.access("src/public" + oldImage.thumbnail, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return
        }
        fs.unlink("src/public" + oldImage.thumbnail, (err) => { if (err) throw err; console.log("old thumbnail was deleted") });

    })
    fs.access("src/public" + oldImage.photo, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return
        }
        fs.unlink("src/public" + oldImage.photo, (err) => { if (err) throw err; console.log("old photo was deleted") });

    })

    // Deleting database entry
    await News.findByIdAndDelete(req.params.id);
    await cache_functions.refreshNews();
    req.flash('success_msg', 'Noticia Eliminada Correctamente');
    res.redirect('/admin/profile');
}
module.exports = news_ctrl;
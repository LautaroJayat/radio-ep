const router = require('express').Router();
const SoundBig = require('../models/soundBig');
const cache_functions =require('../cache/cache_functions');
const { isAuthenticated } = require('../helpers/auth');
const { safeIframe } = require('../helpers/url');
const HOME_CACHE = require('../cache/HOME_CACHE');
const contents_ctrl = require('../controllers/users/contents');



router.delete('/iframes/delete/:_id', async (req, res) => {
    console.log(req.params._id);
    await SoundBig.findByIdAndDelete(req.params._id);

    res.redirect('/admin/iframes');
});

router.post('/admin/bigsound/register', async (req, res) => {
    var { iframe } = req.body;
    const onlyID = true;
    let video_id = await safeIframe(iframe, onlyID);
    console.log(video_id);
    if (video_id === undefined) {
        req.flash("error_msg", "Querid@, ingresastemal el iframe");
        return res.redirect('/admin/iframes')
    } else {
        console.log("we are in else");
        const newIframe = new SoundBig({ video_id });
        await newIframe.save();
        await cache_functions.addBigSound(newIframe);
        return res.redirect('/admin/iframes');
    }

});

router.get('/superlist', contents_ctrl.get_cache, async (req, res) => {
    let index = Math.floor(Math.random() *10)
    console.log(index);
    iframe = HOME_CACHE.bigSound[index];
    return res.json({ id: iframe.video_id })
})


module.exports = router;
const router = require('express').Router();
const SoundSmall = require('../models/soundSmall');
//const Sound = require('../models/sound');
const { isAuthenticated } = require('../helpers/auth');
const cache_functions = require('../cache/cache_functions');


router.put('/admin/smallsound/register',isAuthenticated, async (req, res) => {
    const { iframe } = req.body;
    const registeredIframe = await SoundSmall.findOne();
    if (registeredIframe === null) {
        const newIframe = new SoundSmall({ iframe });
        await newIframe.save();
    } else {
        registeredIframe.iframe = iframe;
        await registeredIframe.save()
    }
    await cache_functions.refreshSmallSound();
    res.redirect('/admin/iframes');

});


module.exports = router;
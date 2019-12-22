const router = require('express').Router();
const SoundBig = require('../models/soundBig');
//const Sound = require('../models/sound');
const { isAuthenticated } = require('../helpers/auth');

router.put('/admin/bigsound/register', async (req, res) => {
    const { iframe } = req.body;
    const registeredIframe = await SoundBig.findOne();
    if (registeredIframe === null) {
        const newIframe = new SoundBig({ iframe });
        await newIframe.save();
    } else {
        registeredIframe.iframe = iframe;
        await registeredIframe.save()
    }
    res.redirect('/admin/iframes');

});


module.exports = router;
const router = require('express').Router();
const HOME_CACHE = require('../cache/HOME_CACHE');
const cache_functions = require('../cache/cache_functions');

router.get('/', async (req, res) => {
    await cache_functions.mainFunction();
    const { news, emitions, smallSound, columns } = HOME_CACHE;
    const headers = {
        pageTitle: "Radio Entre-Piernas",
        ogDescription: "Escucha la radio del club más caliente",
        ogTitle: "Radio Entre-Piernas",
        ogImage: "https://res.cloudinary.com/djyu25sfm/image/upload/v1560887972/snipetREP.png",
    }
    res.render('index', { news, emitions, smallSound, columns, headers });

});


router.get('/test', async (req, res) => {
    await cache_functions.mainFunction();
    const { news, emitions, smallSound, columns } = HOME_CACHE;
    res.render('test', { news, emitions, smallSound, columns });

});

module.exports = router;
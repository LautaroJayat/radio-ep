const News = require('../../models/news');
const Emitions = require('../../models/emitions');
const Columns = require('../../models/column');
const HOME_CACHE = require('../../cache/HOME_CACHE');
const cache_functions = require('../../cache/cache_functions');
const contents_ctrl = {};

// Helper to remove HTML tags from the description in order to put it
// in the og:description meta-tag
function makeOGdescriptionsSafeAgain(description) {
    let safe = description.replace(/<\/?\w*\W*>/gm, "");
    return safe
}

// Middleware to populate the cache if its empty
// in the case that the first request is directly to one of the contents routes
contents_ctrl.get_cache = async (req, res, next) => {
    if (HOME_CACHE.news.length < 1) {
        await cache_functions.mainFunction();
        return next();
    }
    else {
        next();
    }
}

contents_ctrl.get_new = async (req, res) => {
    let headers;
    let news
    const _news = HOME_CACHE.news;
    const _columns = HOME_CACHE.columns.slice(3)
    const url = req.params.url;
    if (_news.filter(element => element.url === url).length > 0) {
        news = _news.filter(element => element.url === url);
        news = news[0];
        console.log(news);
        headers = {
            pageTitle: news.title + " | Radio Entre-Piernas",
            ogDescription: makeOGdescriptionsSafeAgain(news.description),
            ogTitle: "Radio Entre-Piernas",
            ogImage: news.thumbnail,
            news: true,
            altFormat: {
                altCSS: ['<link rel="stylesheet" href="/content.css">'],
                altScripts: []
            }
        };
        //console.log('from cache works?');
        //console.log(news);
        console.log("We are in if");
        return res.render("contents", { news, headers, _columns, _news });
    } else {
        news = await News.findOne({ url: url }, { _id: 0 });
        console.log("We are in else");
        headers = {
            pageTitle: news.title + " | Radio Entre-Piernas",
            ogDescription: await makeOGdescriptionsSafeAgain(news.description),
            ogTitle: news.title + " | Noticias | Radio Entre-Piernas",
            ogImage: news.thumbnail,
            news: true,
            altFormat: {
                altCSS: ['<link rel="stylesheet" href="/content.css">'],
                altScripts: []
            }
        };
        console.log(headers.pageTitle, "\n", headers.ogTitle)
        //console.log(news);
        //console.log("from database works?");
        res.render("contents", { news, headers, _columns, _news });
    }
}

contents_ctrl.get_column = async (req, res) => {
    let headers;
    const _news = HOME_CACHE.news;
    const _columns = HOME_CACHE.columns.slice(3)
    const url = req.params.url;
    const HC_columns = HOME_CACHE.columns;
    //const REDUCED_CACHE
    if (HC_columns.filter(element => element.url === "mi-url-de-noticia").length) {
        let columns = _columns.filter(element => element.url === url);
        columns = columns[0];
        headers = {
            pageTitle: columns.title + " | Radio Entre-Piernas",
            ogDescription: columns.description,
            ogTitle: "Radio Entre-Piernas",
            ogImage: columns.thumbnail,
            profile: false,
            altFormat: {
                altCSS: ['<link rel="stylesheet" href="/content.css">'],
                altScripts: []
            }
        };
        //console.log("columns works!");
        res.render("contents", { columns, headers, _news, _columns })
    } else {
        let columns = await Columns.find({ url: url }, { _id: 0 });
        columns = columns[0];
        headers = {
            pageTitle: columns.title + " | Radio Entre-Piernas",
            ogDescription: columns.description,
            ogTitle: "Radio Entre-Piernas",
            ogImage: columns.thumbnail,
            profile: false,
            altFormat: {
                altCSS: ['<link rel="stylesheet" href="/content.css">'],
                altScripts: []
            }
        };
        //console.log("columns works!");
        res.render("contents", { columns, headers, _news, _columns });
    }
}
contents_ctrl.get_emition = async (req, res) => {
    let headers;
    const url = req.params.url;
    const _news = HOME_CACHE.news;
    const _columns = HOME_CACHE.columns.slice(3)
    const _emitions = HOME_CACHE.emitions;
    if (_emitions.filter(element => element.url === "mi-url-de-noticia").length) {
        let emitions = _emitions.filter(element => element.url === url);
        emitions = emitions[0];
        headers = {
            pageTitle: emitions.title + " | Radio Entre-Piernas",
            ogDescription: emitions.description,
            ogTitle: "Radio Entre-Piernas",
            ogImage: emitions.thumbnail,
            profile: false,
            altFormat: {
                altCSS: ['<link rel="stylesheet" href="/content.css">'],
                altScripts: []
            }
        };
        //console.log("emitions works!");
        res.render("contents", { emitions, headers, _news, columns });
    } else {
        let emitions = await Emitions.find({ url: url }, { _id: 0 });
        emitions = emitions[0];
        headers = {
            pageTitle: emitions.title + " | Radio Entre-Piernas",
            ogDescription: emitions.description,
            ogTitle: "Radio Entre-Piernas",
            ogImage: emitions.thumbnail,
            profile: false,
            altFormat: {
                altCSS: ['<link rel="stylesheet" href="/content.css">'],
                altScripts: []
            }
        };
        //console.log("emitions works!");
        res.render("contents", { emitions, headers, _news, _columns });
    }
}


contents_ctrl.get_author = async (req, res) => {

    res.send("working");
}

contents_ctrl.get_all_news = async (req, res) => {
    if (req.query.page) {
        const news = await News.find({}, { _id: 0 }).sort({ _id: -1 }).limit(3).skip(parseInt(req.query.page));
        if (news.length < 1) { res.sendStatus(500) } else {
            res.json({ news });
        }
    } else {
        const { news } = HOME_CACHE;
        //console.log(HOME_CACHE);
        res.render("all_news", { news });
    }
}

contents_ctrl.get_all_emitions = async (req, res) => {
    if (req.query.page) {
        const emitions = await Emitions.find({}, { _id: 0 }).sort({ _id: -1 }).limit(3).skip(parseInt(req.query.page));
        if (emitions.length < 1) { res.sendStatus(500) } else {
            res.json({ emitions });
        }
    } else {
        const { emitions } = HOME_CACHE;
        res.render("all_emitions", { emitions });
    }
}
contents_ctrl.get_all_columns = async (req, res) => {
    if (req.query.page) {
        const columns = await Columns.find({}, { _id: 0 }).sort({ _id: -1 }).limit(3).skip(parseInt(req.query.page));
        //console.log(columns)
        if (columns.length < 1) {
            res.sendStatus(500)
        } else {
            res.json({ columns });

        }
    } else {
        const { columns } = HOME_CACHE;
        res.render("all_columns", { columns });
    }
}



module.exports = contents_ctrl;

const News = require('../../models/news');
const Emitions = require('../../models/emitions');
const Columns = require('../../models/column');
const HOME_CACHE = require('../../cache/HOME_CACHE');
const contents_ctrl = {};

contents_ctrl.get_new = async (req, res) => {
    const url = req.params.url;
    if (HOME_CACHE.columns.filter(element => element.url === url)) {
        console.log("works")
        res.send(HOME_CACHE.columns.filter(element => element.url === url))
    } else {
        const columns = await News.find({ url: url }, { _id: 0 });
        res.send(columns);
    }
}

contents_ctrl.get_column = async (req, res) => {
    const url = req.params.url;
    if (HOME_CACHE.columns.filter(element => element.url === url)) {
        console.log("works")
        res.send(HOME_CACHE.columns.filter(element => element.url === url))
    } else {
        const columns = await Columns.find({ url: url }, { _id: 0 });
        res.send(columns);
    }
}
contents_ctrl.get_emition = async (req, res) => {
    const url = req.params.url;
    if (HOME_CACHE.emition.filter(element => element.url === url)) {
        console.log("works")
        res.send(HOME_CACHE.emition.filter(element => element.url === url))
    } else {
        const emition = await News.find({ url: url }, { _id: 0 });
        res.send(emition);
    };
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
        res.render("all_news", { news });
    }
}
contents_ctrl.get_all_emitions = async (req, res) => {
    res.send("working");
}
contents_ctrl.get_all_columns = async (req, res) => {
    res.send("working");
}




module.exports = contents_ctrl;

const router = require('express').Router();
const contents_ctrl = require('../controllers/users/contents');

router.get('/contents/news/:url', contents_ctrl.get_cache, contents_ctrl.get_new);
router.get('/contents/columns/:url', contents_ctrl.get_cache, contents_ctrl.get_column);
router.get('/contents/emitions/:url', contents_ctrl.get_cache, contents_ctrl.get_emition);
router.get('/all/news', contents_ctrl.get_cache, contents_ctrl.get_all_news);
router.get('/all/columns', contents_ctrl.get_cache, contents_ctrl.get_all_columns);
router.get('/all/emitions', contents_ctrl.get_cache, contents_ctrl.get_all_emitions);
router.get('/contents/iframe/column/:url', contents_ctrl.get_iframe_column);
router.get('/contents/iframe/emition/:url', contents_ctrl.get_iframe_emition);



module.exports = router;

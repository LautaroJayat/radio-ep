const router = require('express').Router();
const c_ctrl = require('../controllers/users/contents');

router.get('/news/:url', c_ctrl.get_new);
router.get('/columns/:url', c_ctrl.get_column);
router.get('/emitions/:url', c_ctrl.get_emition);
router.get('/all/news', c_ctrl.get_all_news);
router.get('/all/columns', c_ctrl.get_all_columns);
router.get('/all/emitions', c_ctrl.get_all_emitions);


module.exports = router;

const router = require('express').Router();
const n_ctrl = require('../controllers/news/news');
const { isAuthenticated } = require('../helpers/auth');


router.get('/news/edit/:id',/* isAuthenticated,*/ n_ctrl.edit_news_panel);

router.post('/news/add', /*isAuthenticated,*/ n_ctrl.add_news);

router.post('/news/partialedit/:id', n_ctrl.edit_news);

router.post('/news/fulledit/:id', n_ctrl.full_edit_news);

router.delete('/news/delete/:id', isAuthenticated, n_ctrl.delete_news);




module.exports = router;
const router = require('express').Router();
const c_ctrl = require('../controllers/columns/columns');
const { isAuthenticated, isAdmin } = require('../helpers/auth');

router.get('/columns/:url', c_ctrl.get_column);

router.get('/columns/edit/:id', isAuthenticated, isAdmin, c_ctrl.edit_columns_panel);

router.post('/columns/add', isAuthenticated, isAdmin, c_ctrl.add_columns);

router.post('/columns/partialedit/:id', isAuthenticated, isAdmin, c_ctrl.edit_columns);

router.post('/columns/fulledit/:id', isAuthenticated, isAdmin, c_ctrl.full_edit_columns);

router.delete('/columns/delete/:id', isAuthenticated, isAdmin, c_ctrl.delete_columns);




module.exports = router;
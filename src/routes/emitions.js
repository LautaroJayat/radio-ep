const router = require('express').Router();
const e_ctrl = require('../controllers/emitions/emitions');
const { isAuthenticated, isAdmin } = require('../helpers/auth');


router.get('/emitions/edit/:id',/*isAuthenticated, isAdmin,*/ e_ctrl.edit_emitions_panel);

router.post('/emitions/add', /*isAuthenticated, isAdmin,*/ e_ctrl.add_emitions);

router.post('/emitions/partialedit/:id',/*isAuthenticated, isAdmin,*/ e_ctrl.edit_emitions);

router.post('/emitions/fulledit/:id',/*isAuthenticated, isAdmin,*/ e_ctrl.full_edit_emitions);

router.delete('/emitions/delete/:id', /*isAuthenticated, isAdmin,*/ e_ctrl.delete_emitions);




module.exports = router;
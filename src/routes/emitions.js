const router = require('express').Router();
const e_ctrl = require('../controllers/emitions/emitions');
const { isAuthenticated } = require('../helpers/auth');


router.get('/emitions/edit/:id',/* isAuthenticated,*/ e_ctrl.edit_emitions_panel);

router.post('/emitions/add', /*isAuthenticated,*/ e_ctrl.add_emitions);

router.post('/emitions/partialedit/:id', e_ctrl.edit_emitions);

router.post('/emitions/fulledit/:id', e_ctrl.full_edit_emitions);

router.delete('/emitions/delete/:id', isAuthenticated, e_ctrl.delete_emitions);




module.exports = router;
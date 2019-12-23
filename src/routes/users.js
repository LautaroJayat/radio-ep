const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');
//const { isAdmin } = require('../helpers/auth');
const u_ctrl = require('../controllers/users/users');
const a_ctrl = require('../controllers/users/admin');
const access = require('../controllers/users/access');



/// ACCESS ROUTES
/// ACCESS ROUTES

router.get('/nochesdelogin', access.login);

router.post('/nochesdelogin', passport.authenticate('local', { failureRedirect: '/nochesdelogin' }),
    (req, res) => {
        res.redirect('/admin/profile');
    });

router.get('/nochesdesignin', access.signin);

router.get('/logoutbyebye', access.logout);

router.post('/nochesdesignin', access.create_user);


/// USERS AND ADMIN PANEL ROUTES
/// USERS AND ADMIN PANEL ROUTES


/// GET REQUESTS
router.get('/admin/profile', isAuthenticated, u_ctrl.profile_home);

router.get('/admin/allusers', /*isAuthenticated,isAdmin,*/ a_ctrl.all_users);

router.get('/admin/changeinfo', /*isAuthenticated,*/ u_ctrl.change_info);

router.get('/admin/changepass', /*isAuthenticated,*/ u_ctrl.change_pass);

router.get('/admin/changesocial', /*isAuthenticated,*/ u_ctrl.change_social);

router.get('/admin/changephoto', /*isAuthenticated,*/ u_ctrl.change_photo);

router.get('/admin/allnews', /*isAuthenticated,isAdmin,*/ a_ctrl.all_news);

router.get('/admin/usernews', /*isAuthenticated,*/ u_ctrl.user_news);

router.get('/admin/addnew', /*isAuthenticated,*/ u_ctrl.add_new);

router.get('/admin/allcolumns', /*isAuthenticated,isAdmin,*/ a_ctrl.all_columns);

router.get('/admin/addcolumn', /*isAuthenticated,isAdmin,*/ a_ctrl.add_column);

router.get('/admin/emitions', /*isAuthenticated,isAdmin,*/ a_ctrl.all_emitions);

router.get('/admin/addemition', /*isAuthenticated,isAdmin,*/ a_ctrl.add_emitions);

router.get('/admin/iframes', /*isAuthenticated,isAdmin,*/ a_ctrl.iframes);

router.get('/admin/users/editpanel/:id',/*isAuthenticated,isAdmin,*/ a_ctrl.edit_users_panel);

router.get('/admin/users/deletepanel/:id',/*isAuthenticated,isAdmin,*/ a_ctrl.delete_users_panel);




/// POST REQUESTS
router.post('/upload/user/photo', u_ctrl.update_photo);
router.post('/admin/users/edit/:id',/*isAuthenticated,isAdmin,*/ a_ctrl.users_edit);
router.post('/admin/users/fulledit/:id',/*isAuthenticated,isAdmin,*/ a_ctrl.users_fulledit);



/// PUT REQUESTS
router.put('/users/info/modify/', u_ctrl.modify_info);

router.put('/users/pass/modify', u_ctrl.modify_password);

router.put('/users/social/modify/', u_ctrl.modify_social);

router.post('/admin/users/fulledit/:id',/*isAuthenticated,isAdmin,*/ a_ctrl.users_fulledit);


/// DELETE REQUESTS

router.delete('/admin/users/delete',/*isAuthenticated,isAdmin,*/ a_ctrl.users_delete);








module.exports = router;

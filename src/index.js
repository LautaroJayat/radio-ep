const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const helmet = require('helmet');

// Initializations
require('dotenv').config();
const app = express();
require('./database');
app.use(helmet())
require('./config/passport');


// Settings
!process.env.PORT || process.env.NODE_ENV === 'dev' ? app.set(3000) : app.set('port', process.env.PORT);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/temp/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
app.use(multer({ storage }).array('image'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/columns'));
app.use(require('./routes/emitions'));
app.use(require('./routes/news'));
app.use(require('./routes/soundSmall'));
app.use(require('./routes/soundBig'));
app.use(require('./routes/contents'));




// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server Is Listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});


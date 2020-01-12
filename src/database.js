const mongoose = require('mongoose');
const DB_URI = !process.env.PORT || process.env.NODE_ENV === 'dev' ? 'mongodb://localhost/radioentrepiernas' : process.env.DB_ATLAS_MONGODB 
mongoose.connect( DB_URI ,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));

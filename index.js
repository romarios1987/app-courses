const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const csurf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const mongoose = require('mongoose');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

// const mongoURI = 'mongodb://localhost/e-courses';

const keys = require('./keys');


// Require routes
const home = require('./routes/home');
const courses = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const orders = require('./routes/orders');
const authRoutes = require('./routes/auth');


const app = express();


const store = new MongoDBStore({
    uri: keys.MONGO_URI,
    collection: 'sessions'
});


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csurf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
});

// register Handlebars
app.engine('hbs', hbs.engine);
// use Handlebars
app.set('view engine', 'hbs');
app.set('views', 'views');


// Use Routes
app.use('/', home);
app.use('/courses', courses);
app.use('/cart', cartRoutes);
app.use('/orders', orders);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect(keys.MONGO_URI, {useNewUrlParser: true, useFindAndModify: false});

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();







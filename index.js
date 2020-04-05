const express = require('express');
const cookieParser = require('cookie-parser')
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const csurf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const mongoose = require('mongoose');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');

const fileMiddleware = require('./middleware/file');

//! ------Uncaught Exceptions ------
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shuting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
//! ------Uncaught Exceptions  ------

const keys = require('./keys');


// Require routes
const home = require('./routes/home');
const courses = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const orders = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


const app = express();


const store = new MongoDBStore({
  uri: keys.MONGO_URI,
  collection: 'sessions'
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(cookieParser());

app.use(fileMiddleware.single('avatar'));

app.use(csurf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);


const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  // handlebars: allowInsecurePrototypeAccess(exphbs),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers'),
});
//
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// register Handlebars
app.engine('hbs', hbs.engine);
// use Handlebars
app.set('view engine', 'hbs');
app.set('views', 'views');




// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');
//
// app.set('views', 'views');




// Use Routes
app.use('/', home);
app.use('/courses', courses);
app.use('/cart', cartRoutes);
app.use('/orders', orders);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(keys.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();







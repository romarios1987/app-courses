const express = require('express');
var exphbs = require('express-handlebars');
const path = require('path');

// Require routes
const home = require('./routes/home');
const courses = require('./routes/courses');
const courseAdd = require('./routes/course-add');
const cartRoutes = require('./routes/cart');


const app = express();

app.use(express.static(path.join(__dirname, 'public')));


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// register Handlebars
app.engine('hbs', hbs.engine);
// use Handlebars
app.set('view engine', 'hbs');
app.set('views', 'views');


// Use Routes
app.use('/', home);
app.use(express.urlencoded({extended: true}));
app.use('/course-add', courseAdd);
app.use('/courses', courses);
app.use('/cart', cartRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



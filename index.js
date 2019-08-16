const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

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
// app.use('/course-add', courseAdd);
app.use('/courses', courses);
app.use('/cart', cartRoutes);


const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect('mongodb://localhost/e-courses', {useNewUrlParser: true, useFindAndModify: false});
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();







const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const User = require('./models/user');


// Require routes
const home = require('./routes/home');
const courses = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const orders = require('./routes/orders');


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


app.use(async (req, res, next) => {

    try {
        const user = await User.findById('5d56789bbbc6ea67bc2634f9');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }


});


// Use Routes
app.use('/', home);
app.use(express.urlencoded({extended: true}));
app.use('/courses', courses);
app.use('/cart', cartRoutes);
app.use('/orders', orders);


const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect('mongodb://localhost/e-courses', {useNewUrlParser: true, useFindAndModify: false});

        const candidate = await User.findOne();

        if (!candidate) {
            const user = new User({
                email: 'remi9988@mail.ru',
                name: 'Roman',
                cart: {items: []}
            });
            await user.save();
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();







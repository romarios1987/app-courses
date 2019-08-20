const {Router} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    });
});

router.post('/login', async (req, res) => {

    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {

            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save((err) => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/')
                    }
                });
            } else {
                req.flash('loginError', 'Wrong password');
                res.redirect('/auth/login');
            }

        } else {
            req.flash('loginError', 'User with this email not found');
            res.redirect('/auth/login');
        }

    } catch (e) {
        console.log(e);
    }


});


router.post('/register', async (req, res) => {
    try {
        const {email, name, password, password_confirm} = req.body;

        const candidate = await User.findOne({email});
        if (candidate) {
            req.flash('registerError', 'User with this email already exists');
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            });
            await user.save();
            res.redirect('/auth/login#register')
        }


    } catch (e) {
        console.log(e);
    }

});


module.exports = router;
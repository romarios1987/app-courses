const {Router} = require('express');
const auth = require('../middleware/auth');


const User = require('../models/user');


const router = Router();

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        tittle: 'Profile',
        isProfile: true,

        user: req.user.toObject()
    })
});


router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        //console.log(user);


        const toChange = {
            name: req.body.name
        };

        // console.log(req.file);

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }


        Object.assign(user, toChange);

        await user.save();
        res.redirect('/profile');

    } catch (e) {
        console.log(e);
    }
});


module.exports = router;

const {Router} = require('express');
const auth = require('../middleware/auth');
const Course = require('../models/course');

const router = Router();


function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

// Get All courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img');
        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses,
        })
    } catch (e) {
        console.log(e);
    }

});


// Get course for Edit by ID
router.get('/:id/edit', auth, async (req, res) => {

    if (!req.query.allow) {
        res.redirect('/')
    }
    try {
        const course = await Course.findById(req.params.id);

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit | ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e);
    }


});

// Post course for Edit by ID
router.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body;
        delete req.body.id;

        const course = await Course.findById(id);

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        Object.assign(course, req.body);
        await course.save();


        // await Course.findByIdAndUpdate(id, req.body);
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});


router.get('/add', auth, (req, res) => {
    res.render('course-add', {
        title: 'Add Course',
        isAdd: true
    })
});

router.post('/add', auth, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    });
    try {
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
});


// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.render('course', {
            title: `Course | ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e);
    }
});


// Delete course
router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
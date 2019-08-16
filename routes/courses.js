const {Router} = require('express');

const Course = require('../models/course');

const router = Router();


// Get All courses
router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses,
    })
});


// Get course for Edit by ID
router.get('/:id/edit', async (req, res) => {

    if (!req.query.allow) {
        res.redirect('/')
    }

    const course = await Course.findById(req.params.id);

    res.render('course-edit', {
        title: `Edit | ${course.title}`,
        course
    })
});

// Post course for Edit by ID
router.post('/edit', async (req, res) => {
    const {id} = req.body;
    delete req.body.id;

    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
});


router.get('/add', (req, res) => {
    res.render('course-add', {
        title: 'Add Course',
        isAdd: true
    })
});

router.post('/add', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
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
    const course = await Course.findById(req.params.id);
    res.render('course', {
        title: `Course | ${course.title}`,
        course
    })
});


// Delete course
router.post('/remove', async (req, res) => {

    try {
        await Course.deleteOne({_id: req.body.id});
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
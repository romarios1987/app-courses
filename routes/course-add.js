// const {Router} = require('express');
//
// const Course = require('../models/course');
//
// const router = Router();
//
//
// router.get('/add', (req, res) => {
//     res.render('course-add', {
//         title: 'Add Course',
//         isAdd: true
//     })
// });
//
//
// router.post('/add', async (req, res) => {
// //    console.log(req.body);
//    const course = new Course(req.body.title, req.body.price, req.body.img);
//
//     await course.save();
//
//    res.redirect('/')
//
// });
//
//
//
// module.exports = router;
const express = require('express')
const router = new express.Router();

const auth = require("../auth/auth");

const Task = require('../Modal/task');


//post a router
router.post('/createTask', auth, async (req, res) => {

    const task = new Task({ ...req.body, auther: req.user._id })
    try {
        await task.save();
        res.status(201).send(task)
    } catch (error) {
        res.send(error)
    }

})
// get all task
router.get('/getAllTask', auth, async (req, res) => {
    let match = {};
    let sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        let parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 ;
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort

            }
        }).execPopulate();
        res.send(req.user.tasks)
    } catch (error) {
        res.send(error)
    }
})
//get a router 

router.get('/getTask/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, auther: req.user._id })
        if (task) {

            res.send(task)
        }


    } catch (error) {
        res.send(error)

    }
})

//upadate task
router.patch('/update/:id', auth, async (req, res) => {
    const upate = Object.keys(req.body);
    const allowedField = ['description', 'completed'];
    const isMatch = upate.every((value, ind) => allowedField.includes(value));

    if (!isMatch) {
        res.send('You are not allowed for this field')
    }
    try {
        let task = await Task.findOne({ _id: req.params.id, auther: req.user._id })
        upate.forEach((val, ind) => {
            task[val] = req.body[val]
        })
        await task.save();
        res.send(task)
    } catch (error) {
        res.send(error)
    }
});

// delete task
router.delete('/deleteTask/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, auther: req.user._id });
        if (!task) {
            res.send('Resource not Found')
        }
        res.send('Resource was deleted')
    } catch (error) {
        res.send(error)
    }
})
module.exports = router
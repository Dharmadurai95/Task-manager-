const express = require('express');
const User = require('../Modal/modal')
const router = new express.Router();
const sharp = require('sharp');
const auth = require('../auth/auth');
const multer = require('multer');
const { sendWelcomeMail,sendCancelMail } = require('../mail/mail')


//get all users
router.get('/userProfile', auth, async (req, res) => {
    // const user = await User.find({});
    // try {
    //     if(!user) {
    //         res.send("user not found")
    //     }
    //     res.status(201).send(user)


    // } catch (error) {
    //     res.send(error)
    // }
    res.send(req.user)
});
//register router 
router.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        const user = new User({ name, email, password, age });
        const token = await user.generateAuthToken();
        if (user) {
             await user.save()
             sendWelcomeMail(user.email,user.name)
            res.status(201).send({ user, token })
        }

    } catch (error) {
        res.send(error)
    }
})

//login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findByCredentials(email, password);
        let token = await user.generateAuthToken();
        res.status(200).send({ user, token })
    } catch (error) {
        res.send(error.message)
    }
})
//logout user
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.Tokens = req.user.Tokens.filter((token, index) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send("Successfully logged out")
    } catch (error) {
        res.status(500).send('Your are Still logged in')
    }

})
//logout all
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.Tokens = [];
        await req.user.save();
        res.send("successfully logout all")
    } catch (error) {
        res.send(error)
    }

})
//update users 
router.patch('/update/me', auth, async (req, res) => {
    const inputAllFields = Object.keys(req.body);
    const allowedFields = ["name", "age", "password"];
    const isMatch = inputAllFields.every((values, index) => allowedFields.includes(values))
    if (isMatch) {
        try {
            // let user = await req.user;
            inputAllFields.forEach((values, index) => {
                req.user[values] = req.body[values]
            });
            await req.user.save();
            res.status(201).send(req.user)


        } catch (error) {
            res.status(404).send(error)
        }
    }
    res.send("Invalid Updates")
})

//delede User
router.delete("/deleteUser/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelMail(req.user.email,req.user.name)
        res.send("User Deleted ")
    } catch (error) {
        res.status(501).send(error)
    }
});

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            throw new Error("Please upload image")
        }
        cb(undefined, true)
    }
})
//upload user profile
router.post('/profile', auth, upload.single('avatar'), async (req, res) => {
    let profile = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.avatar = profile;
    await req.user.save();
    res.send('successfully update your profile')
}, (error, req, res, next) => {
    res.status(400).send(error)
})

//DELETE user Profile
router.post("/profile/delete", auth, async (req, res) => {
    req.user.avatar = undefined;
    try {
        await req.user.save();
        res.send('profile successfully deleted')
    } catch (error) {
        res.send(error)
    }
})

//get user profile
router.get('/getProfile/:id/me', async (req, res) => {
    try {
        let profile = await User.findById(req.params.id)
        if (!profile || !profile.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(profile.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})
module.exports = router;
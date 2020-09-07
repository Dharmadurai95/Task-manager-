const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../db/db');
const jwt = require('jsonwebtoken')
const Task = require('./task')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(values) {
            if (values.toLowerCase().includes('password')) {
                throw new Error("Password is not a password")
            }
        }
    },
    age: {
        type: String,
        default: 5,
        required: true,
        validate(val) {
            if (val < 5) {
                throw new Error('You are not eligible for this ')
            }
        }

    },
    avatar: {
        type: Buffer
    },
    Tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


//create relation between two modals 
UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'auther',
})

//filter password and token 
UserSchema.methods.toJSON = function () {
    const user = this;

    let userObject = user.toObject();
    delete userObject.password;
    delete userObject.Tokens;
    delete userObject.avatar;
    return userObject;
}
//user login and register time generate auth token
UserSchema.methods.generateAuthToken = async function () {
    let user = this;
    let token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.Tokens = user.Tokens.concat({ token })
    await user.save()
    return token
}
//find user login method
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = User.findOne({ email })
    if (!user) {
        throw new Error("Invalid Email")
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(' Password is Incorrect')
    }
    return user;

}


//hash the password
UserSchema.pre('save', async function (next) {

    let user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})
//delete user at the same time delete the task
UserSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ auther: user._id });
    next()
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
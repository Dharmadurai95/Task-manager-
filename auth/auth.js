
const jwt = require('jsonwebtoken');
const User = require('../Modal/modal')
const auth =async (req,res,next) => {
    try {
        const token =await req.header("Authorization").replace("Bearer ",'');
        const decoded =await jwt.verify(token,process.env.JWT_SECRET);
    
        const user =await User.findOne({_id:decoded._id ,'Tokens.token':token});
        if(!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next()
        
    } catch (error) {
        res.status(401).send("Please Authenticate !")
    }
};
module.exports = auth;
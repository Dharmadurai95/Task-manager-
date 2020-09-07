const mongoose = require('mongoose');
// let db = 'mongodb+srv://Dharmadurai:Dharma@123!@cluster0.t7mif.mongodb.net/learn-backend?retryWrites=true&w=majority'
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
}, () => {
    console.log('connected successfully')
})
////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;
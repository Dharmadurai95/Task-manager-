const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API);

const sendWelcomeMail = (email,name) => {
     sgMail.send({
        to:email,
        from:'dharmadurai@autonom8.com',
        subject:'Using node js app checking email',
        text:`welcome to the app ${name} let me know how get along the app`
    })
};

const sendCancelMail = (email,name) => {
    sgMail.send({
        to:email,
        from:'dharmadurai@autonom8.com',
        subject:'Cancelation Email',
        text:`Good bye ${name} see you later`
    })
}

module.exports = {
    sendWelcomeMail ,
    sendCancelMail
}


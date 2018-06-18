var express = require('express');
var router = express.Router();
var sgMail = require('@sendgrid/mail');
var validator = require('validator');

const pug = require('pug');



// Send email
router.get('/',function(req, res, next) {
    res.send('respond with a resource');

});

router.post('/',function (req,res,next) {
    req.checkBody("email","Enter a valid email").isEmail();
    req.checkBody("name","Enter a valid name").not().isEmpty();
    req.checkBody("phone","Enter a valid phone").isMobilePhone('any');
    req.checkBody("message","Enter a valid message").not().isEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var data = {
            sender:'contact@ebreika.com',
            receiver:req.body.email,
            name:req.body.name,
            phone:req.body.phone,
            message:req.body.message
        };
        sendMailToCustomer(data);
        sendMailToOwner(data);
        res.json({ message: 'email send!' });
    }

})


// Send email for customer
function sendMailToCustomer(data){
    let sendgridkey = process.env.SENDGRID_KEY;
    sgMail.setApiKey(sendgridkey);
    const compiledFunction = pug.compileFile('email-meeting.pug');
    const msg = {
        to: data.receiver,
        from: data.sender,
        subject: 'Cita Adagio',
        text: 'Nos pondremos en contacto lo mas pronto posible',
        html: compiledFunction({ name: data.name   })
    }
    sgMail.send(msg);
}


// Send email for customer
function sendMailToOwner(data){
    let sendgridkey = process.env.SENDGRID_KEY;
    sgMail.setApiKey(sendgridkey);
    const compiledFunction = pug.compileFile('email-information.pug');
    const msg = {
        to: data.sender,
        from: data.sender,
        subject: 'Cita Adagio',
        text: 'Nos pondremos en contacto lo mas pronto posible',
        html: compiledFunction({ name: data.name ,phone:data.phone,email: data.receiver,message:data.message  })
    }
    sgMail.send(msg);
}


module.exports=router
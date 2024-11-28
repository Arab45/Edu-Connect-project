const nodemailer = require("nodemailer");


const sendMail = (to, subject, body) => {
    const transporter = nodemailer.createTransport({
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // secure: false, // true for port 465, false for other ports
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // Ignore invalid/self-signed certificates
        }      
      });

      const emailBody = {
        from: `"Edu Connect" <${process.env.EMAIL_USERNAME}>`,  // sender address
        replyTo: process.env.APP_EMAIL,  // sender address
        to: to,  // list of receivers
        subject: subject,  // Subject line
        html: body  // html body
      };

      transporter.sendMail(emailBody, (error, success) => {
        if(error){
            console.log(`Unable to send email, something went wrong ${error}`);
        };

        if(success){
            console.log(`successfully send email. ${success.messageId}`);
        }
      });
};

module.exports = sendMail;

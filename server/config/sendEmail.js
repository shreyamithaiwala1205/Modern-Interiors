const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {

    user: process.env.SMTP_USER,

    pass: process.env.SMTP_PASS,

  },

});

transporter.verify(function(error, success) {

    if (error) {

        console.log(error);

    }

    else {

        console.log("SMTP Ready");

    }

});

module.exports = transporter;
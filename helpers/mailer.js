const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_MAIL_ACCOUNT,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

sendEmail = (req, res, next) => {
  const mailOptions = {
    from: req.mailOptions.from,
    to: req.mailOptions.to,
    subject: req.mailOptions.subject,
    generateTextFromHTML: true,
    html: `
        <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
              <title>Document</title>
            </head>
            <body>
                <div style="font-size: 14pt; font-family: verdana, geneva, sans-serif;">
                    From: ${req.mailOptions.name} - ${req.mailOptions.from} 
                </div>
                ${req.mailOptions.message}
            </body>
          </html>
      `,
  };
  if (mailOptions.from && mailOptions.to) {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send({ ...req.passedResponse });
      }
      smtpTransport.close();
    });
  } else {
    res.status(500).send({
      success: false,
      message: "No mail options specified",
    });
  }
};

module.exports = {
  sendEmail,
};

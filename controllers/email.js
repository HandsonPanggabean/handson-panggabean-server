class EmailController {
  static sendEmailToMe = async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
      req.mailOptions = {
        name,
        from: email,
        to: process.env.GMAIL_MAIL_ACCOUNT,
        subject,
        message,
      };
      req.passedResponse = {
        success: true,
        message: "Your message was sent to Handson.",
      };
      next();
    } catch (err) {
      console.log("error: ", err.message);
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  };
}

module.exports = EmailController;

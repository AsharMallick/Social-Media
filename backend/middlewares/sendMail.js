import nodemailer from 'nodemailer';



export const sendEmail = async (options) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6e99b3fe3caf9b",
          pass: "99ae3da64470e6"
        }
      });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject:options.subject,
        text:options.message
    }
    await transport.sendMail(mailOptions);
}
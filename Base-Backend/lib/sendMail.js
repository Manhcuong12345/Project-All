const nodemailer = require('nodemailer')
const config = require('../config/config')

/**
 * Function send Mail
 * @param {} email
 * @param {} html
 */
async function sendMail(email, html) {
    let toEmails = email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.development.mailAddress, // generated ethereal user
            pass: config.development.mailPassword // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"Công Ty TNHH JoyTechs"', // sender address
        to: toEmails, // list of receivers
        subject: "Đổi Mật Khẩu ✔", // Subject line
        text: "Forgot Password", // plain text body
        html: html
    });

    console.log("Message sent: %s", info.messageId)
}


module.exports = sendMail
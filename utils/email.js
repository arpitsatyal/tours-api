let nodemailer = require('nodemailer')
let oAuthConfig = require('../oAuth')

async function sendMail(options) {
    // 1 create a transporter!
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: oAuthConfig
    })

    // 2 define the email options
    let mailOptions = {
        from: 'arpited7@gmail.com',
        to: options.email,
        text: options.message,
        subject: options.subject
    }

    await transporter.sendMail(mailOptions)

    // 3 send the email
    console.log('email sent')
}

module.exports = sendMail
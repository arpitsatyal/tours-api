let nodemailer = require('nodemailer')
// let oAuthConfig = require('../oAuth')

// async function sendMail(options) {
//     // 1 create a transporter!
//     let transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         port: 465,
//         auth: oAuthConfig
//     })

//     // 2 define the email options
//     let mailOptions = {
//         from: 'arpited7@gmail.com',
//         to: options.email,
//         text: options.message,
//         subject: options.subject
//     }

//     await transporter.sendMail(mailOptions)

//     // 3 send the email
//     console.log('email sent')
// }

// module.exports = sendMail

let sendEmail = async options => {
    // 1 create a transporter
    let transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2 define the email options
    let mailOptions = {
        from: 'Arpit Satyal <arpited7@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    // 3 send the damn email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
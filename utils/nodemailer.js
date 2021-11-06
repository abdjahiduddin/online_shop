const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

module.exports = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    }
})
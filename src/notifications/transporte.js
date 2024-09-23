const  nodemailer = require('nodemailer')
const { GMAIL_ACCOUNT, GMAIL_CREDENTIALS } = require('../const/globalConst')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: GMAIL_ACCOUNT,
      pass: GMAIL_CREDENTIALS,
    },
})


module.exports = transporter
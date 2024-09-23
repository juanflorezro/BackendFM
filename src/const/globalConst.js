require('dotenv').config()

module.exports  = {
    PORT : process.env.PORT,
    MONGODBCONNECTION: process.env.MONGODBCONNECTION,
    CLAVEJWT: process.env.CLAVEJWT,
    CLAVECRYPTO: process.env.CLAVECRYPTO,
    CLAVEUSUARIO: process.env.CLAVEUSUARIO,
    CLAVEAPIDRIVE: process.env.GOOGLE_CREDENTIALS,
    GMAIL_CREDENTIALS: process.env.GMAIL_CREDENTIALS,
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT
}
require('dotenv').config()

module.exports  = {
    PORT : process.env.PORT,
    MONGODBCONNECTION: process.env.MONGODBCONNECTION,
    CLAVEJWT: process.env.CLAVEJWT,
    CLAVECRYPTO: process.env.CLAVECRYPTO,
    CLAVEUSUARIO: process.env.CLAVEUSUARIO
}
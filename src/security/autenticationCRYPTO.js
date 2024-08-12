const crypto = require('crypto')
const { CLAVECRYPTO } = require('../const/globalConst')
const algoritmo = 'aes-256-cbc'
const key = crypto.createHash('sha256').update(CLAVECRYPTO).digest()
const iv = crypto.randomBytes(16)

const encriptarJWT = (token) => {
    const cipher = crypto.createCipheriv(algoritmo,key,iv)
    const jwtEncripted = Buffer.concat([cipher.update(token), cipher.final()])
    return{
        iv: iv.toString('hex'),
        encripted: jwtEncripted.toString('hex')
    }
}

module.exports = encriptarJWT
const crypto = require('crypto')
const { CLAVECRYPTO } = require('../const/globalConst')
const algoritmo = 'aes-256-cbc'

const desencriptar = (token) => {
    try {
        const iv = Buffer.from(token.iv, 'hex') 
        const encripted = Buffer.from(token.encripted, 'hex')
        const tokenDesencripted = crypto.createDecipheriv(algoritmo, crypto.createHash('sha256').update(CLAVECRYPTO).digest(), iv)
        return Buffer.concat([tokenDesencripted.update(encripted), tokenDesencripted.final()]).toString()
    } catch (error) {
        return null
    }
    
}

module.exports = desencriptar
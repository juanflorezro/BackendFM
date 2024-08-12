const jwt = require('jsonwebtoken')
const { CLAVEJWT } = require('../const/globalConst')
const desencriptar = require('./validationCRYPTO')
function validationJWT(token1){
  return new Promise(( resolve , reject ) => {
   
    const token = desencriptar(token1)
    jwt.verify(token, CLAVEJWT, function(error, user){
      if (error) {
       reject(false) 
      } else {
        resolve(user)
      }
    })
  })
}

module.exports = validationJWT
const jwt = require('jsonwebtoken')
const { CLAVEJWT } = require('../const/globalConst')
const encriptarJWT = require('./autenticationCRYPTO')
const login = require('../models/login');
const usuario = require('../models/usuario');

function autenticationJWT(user) {
    return new Promise((resolve, reject) => {
        login.findOne(user)  
            .then((res) => {
                try {
                    if (!res) {
                        reject('Usuario no encontrado');
                    } else if (res.estado) {
                        userAutentication = {
                            usuario: res.usuario,
                            contraseña: res.contraseña
                        }
                        const tokenJWT = jwt.sign(userAutentication, CLAVEJWT, {expiresIn: '1440m'})
                        const token = encriptarJWT(tokenJWT)
                        resolve(token);
                    } else {
                        reject('Usuario inactivo');
                    }
                } catch (error) {
                    console.log(error)
                    reject('Error en la autenticación',error);
                }
            })
            .catch((err) => {
                reject('Error en la consulta de usuario');
            });
    });
}

module.exports = autenticationJWT;

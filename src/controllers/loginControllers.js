const Login = require('../models/login')
const autenticationJWT = require('../security/autenticationJWT')
const validationJWT = require('../security/validationJWT')

module.exports = {
    listar: async (req, res) => {
        try {
            const login = await Login.find() 
            res.json(login)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    listarB: async (req, res) => {
        const usuario = req.body.data
        try {
            const login = await Login.findOne(usuario) 
            res.json(login)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    agregar: async (req,res) => {
        const login = {usuario: 'usuaio', contraseña: 'usuario', estado: true}
        try {
            const newLogin = new Login(login)
            const loginGruardado = await newLogin.save()
            res.status(201).json(loginGruardado)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    validacion: async (req,res) => {
        const token = req.headers['authorization']
        const acesso = await validationJWT(JSON.parse(token)).catch((err)=>{console.log(err)}) //catch terminar la promesa no BORRAR
       
        if(acesso){
            res.status(201).json({message: 'acceso permitido', user: acesso})
        }else {
            res.status(500).json({message: 'acceso denegado'})
        }
    },
    autenticacion: async (req,res) => {
        const user = req.body.data.user
        
        autenticationJWT(user)
        .then( resp => {
            res.status(201).json({resp})
        })
        .catch( err => {
            res.status(500).json({message: err})
        })
        
    },
}

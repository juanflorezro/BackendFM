const Usuario = require('../models/usuario')
const validationJWT = require('../security/validationJWT')
const validateUsuario = async (nombre) => {
    if (!nombre) return null
    let usuarioDoc = await Usuario.findOne({ nombre })

    if (!usuarioDoc) {
        usuarioDoc = new Usuario({ nombre })
        await usuarioDoc.save()
    }

    return usuarioDoc._id
}

module.exports = {
    validateUsuario,
    listar: async (req, res) => {
        const token = req.headers['authorization']
        const acceso = await validationJWT(JSON.parse(token)).catch((err)=>{console.log(err)})
        if (acceso) {
            try {
                const usuario = await Usuario.find()  // Corrección en la variable "usuario"
                res.json(usuario)
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }
    },
    agregar: async (req, res) => {
        const usuario = { nombre: 'Juan Daniel' }
        try {
            const newUsuario = new Cliente(usuario)
            const usuarioGruardado = await newUsuario.save()
            res.status(201).json(usuarioGruardado);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    actualizar: async (req, res) => {
        const usuario = req.body
        try {
            const { id } = req.params
            const casoActualizado = await Usuario.findByIdAndUpdate(id, cliente/*req.body*/, { new: true });
            if (!casoActualizado) return res.status(404).json({ message: 'Caso no encontrado' })
            res.json(casoActualizado)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

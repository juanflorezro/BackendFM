const cliente = require('../models/cliente')
const Cliente = require('../models/cliente')
const validationJWT = require('../security/validationJWT.js')
async function validationClient(client) {
    try {
        let clienteDoc = await Cliente.findOne({ nombre: client })
        if (!clienteDoc) {
            clienteDoc = new Cliente({ nombre: client })
            await clienteDoc.save()
        }
        return clienteDoc._id
    } catch (error) {
        throw error
    }
}

module.exports = {
    validationClient,
    listar: async (req, res) => {
        const token = req.headers['authorization']
        const acceso = await validationJWT(JSON.parse(token)).catch((err)=>(console.log(err)))
        if(acceso){
            try {
                const clientes = await Cliente.find()  
                res.json(clientes)
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        }else{
            res.status(500).json({ message: 'Acceso Denegado' }) 
        }
        
    },
    agregar: async (req,res) => {
        const cliente = {nombre: 'Inverciones'}
        try {
            const newCliente = new Cliente(cliente)
            const clienteGruardado = await newCliente.save()
            res.status(201).json(clienteGruardado);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    actualizar: async (req, res) => {
        const cliente = req.body
        try {
            const { id } = req.params
            const clienteActualizado = await Cliente.findByIdAndUpdate(id, cliente/*req.body*/, { new: true });
            if (!clienteActualizado) return res.status(404).json({ message: 'cliente no encontrado' })
            res.json(clienteActualizado)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}


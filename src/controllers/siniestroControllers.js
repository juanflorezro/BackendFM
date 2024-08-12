const Siniestro = require('../models/siniestro')

async function validationSiniestro(numero) {
    try {
        let siniestroDoc = await Siniestro.findOne({ numero })
        if (!siniestroDoc) {
            siniestroDoc = new Siniestro({ numero })
            await siniestroDoc.save()
        }
        return siniestroDoc
    } catch (error) {
        throw error
    }
}

module.exports = {
    validationSiniestro,
    listar: async (req, res) => {
        const token = req.headers['authorization']
        const acceso = await validationJWT(JSON.parse(token)).catch((err)=>(console.log(err)))
        if(acceso){
            try {
                const siniestro = await Siniestro.find()  
                res.json(siniestro)
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        }else{
            res.status(500).json({ message: 'Acceso Denegado' }) 
        }
        
    },
    agregar: async (req,res) => {
        const siniestro = {nombre: '123'}
        try {
            const newSiniestro = new Cliente(siniestro)
            const siniestroGruardado = await newSiniestro.save()
            res.status(201).json(siniestroGruardado);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    actualizar: async (req, res) => {
        const siniestro = req.body
        
        try {
            const { id } = req.params
            const siniestroActualizado = await Siniestro.findByIdAndUpdate(id, cliente/*req.body*/, { new: true });
            if (!siniestroActualizado) return res.status(404).json({ message: 'Siniestro no encontrado' })
            res.json(siniestroActualizado)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

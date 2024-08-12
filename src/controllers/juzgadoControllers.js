const Juzgado = require('../models/juzgado')

async function validationJuzgado(nombre) {
    try {
        let juzgadoDoc = await Juzgado.findOne({ nombre })
        if (!juzgadoDoc) {
            juzgadoDoc = new Juzgado({ nombre })
            await juzgadoDoc.save()
        }
        return juzgadoDoc
    } catch (error) {
        throw error
    }
}

module.exports = {
    validationJuzgado,
    
    listar: async (req, res) => {
        const token = req.headers['authorization']
        const acceso = await validationJWT(JSON.parse(token)).catch((err)=>(console.log(err)))
        if(acceso){
            try {
                const juzgado = await Juzgado.find()  // Corrección en la variable "s"
                res.json(juzgado)
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        }else{
            res.status(500).json({ message: 'Acceso Denegado' }) 
        }
        
    },
    agregar: async (req,res) => {
        const juzgado = {nombre: 'Juzgado123'}
        try {
            const newJuzgado = new Juzgado(juzgado)
            const juzgadoGuardado = await newJuzgado.save()
            res.status(201).json(juzgadoGuardado);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    actualizar: async (req, res) => {
        const juzgado = req.body
        try {
            const { id } = req.params
            const juzgadoActualizado = await Juzgado.findByIdAndUpdate(id, cjuzgado/*req.body*/, { new: true });
            if (!juzgadoActualizado) return res.status(404).json({ message: 'Juzgado no encontrado' })
            res.json(juzgadoActualizado)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

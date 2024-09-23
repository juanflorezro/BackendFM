const router = require('express').Router()
const loginControllers = require('../controllers/loginControllers')

const CreateBackUp = require('../backupCaso/backUp')




router.get('/', loginControllers.listar)
router.get('/buscar', loginControllers.listarB)
router.post('/crear', loginControllers.agregar)
router.get('/servidor', (req, res) => {
    res.send('Servidor En EJECUCION')
})
router.post('/autenticacion', loginControllers.autenticacion)
router.post('/validacion', loginControllers.validacion)



router.get('/backup', async (req, res) => {
    try {

        CreateBackUp(res)
    } catch (error) {
        console.error('Error al crear el backup:', error);
        res.status(500).send('Error al crear el backup');
    }
});

module.exports = router

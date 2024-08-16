const router = require('express').Router()
const loginControllers = require('../controllers/loginControllers')

router.get('/', loginControllers.listar)
router.get('/buscar', loginControllers.listarB)
router.post('/crear', loginControllers.agregar)
router.get('/servidor', (req, res) => {
    res.send('Servidor En EJECUCION')
})
router.post('/autenticacion', loginControllers.autenticacion)
router.post('/validacion', loginControllers.validacion)

module.exports = router

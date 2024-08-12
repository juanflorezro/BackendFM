const router = require('express').Router()
const loginControllers = require('../controllers/loginControllers')

router.get('/', loginControllers.listar)
router.get('/buscar', loginControllers.listarB)
router.post('/crear', loginControllers.agregar)
router.post('/autenticacion', loginControllers.autenticacion)
router.post('/validacion', loginControllers.validacion)

module.exports = router

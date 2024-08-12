const router = require('express').Router()
const usuarioControllers = require('../controllers/usuarioControllers')

router.get('/', usuarioControllers.listar)
router.post('/crear', usuarioControllers.agregar)
router.get('/actualizar/:id', usuarioControllers.actualizar)

module.exports = router

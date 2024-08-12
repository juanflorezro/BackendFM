const router = require('express').Router()
const juzgadoControllers = require('../controllers/juzgadoControllers')

router.get('/', juzgadoControllers.listar)
router.post('/crear', juzgadoControllers.agregar)
router.put('/actualizar/:id', juzgadoControllers.actualizar)

module.exports = router

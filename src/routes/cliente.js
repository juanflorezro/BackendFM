const router = require('express').Router()
const clienteControllers = require('../controllers/clienteControllers')

router.get('/', clienteControllers.listar)
router.get('/crear',clienteControllers.agregar)
router.get('/actualizar/:id', clienteControllers.actualizar)


module.exports = router
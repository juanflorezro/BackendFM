const router = require('express').Router()
const siniestroControllers = require('../controllers/siniestroControllers')

router.get('/', siniestroControllers.listar)
router.post('/crear', siniestroControllers.agregar)
router.put('/actualizar/:id', siniestroControllers.actualizar)

module.exports = router

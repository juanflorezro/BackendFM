const router = require('express').Router();
const casoControllers = require('../controllers/casoControllers');

// Ruta para listar todos los casos
router.get('/', casoControllers.listar);

// Ruta para ver un caso específico
router.post('/caso', casoControllers.listar2); // Asegúrate de que esta ruta esté correcta

// Ruta para agregar un nuevo caso
router.get('/crear', casoControllers.agregarfijo); // Cambia de GET a POST para evitar conflictos
router.post('/crearlote', casoControllers.agregarLote);

// Ruta para eliminar un caso por su ID
router.delete('/eliminar/:id', casoControllers.eliminar);

// Ruta para actualizar un caso por su ID
router.put('/actualizar/:id', casoControllers.actualizar);
router.get('/eli', casoControllers.eliminarTodos);

// Ruta para actualizar un caso por su ID
module.exports = router;

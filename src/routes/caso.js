const router = require('express').Router();
const casoControllers = require('../controllers/casoControllers');

// Ruta para listar todos los casos
router.get('/', casoControllers.listar);

// Ruta para ver un caso específico
router.post('/caso', casoControllers.listar2); // Asegúrate de que esta ruta esté correcta
router.post('/casoAll', casoControllers.listar3); // Asegúrate de que esta ruta esté correcta

// Ruta para agregar un nuevo caso
router.post('/crear', casoControllers.agregarfijo); // Cambia de GET a POST para evitar conflictos
router.post('/crearlote', casoControllers.agregarLote);

// Ruta para eliminar un caso por su ID
router.delete('/eliminar/:id', casoControllers.eliminar);
router.delete('/:casoId/comentarios/:comentarioId', casoControllers.eliminarc);

// Ruta para actualizar un caso por su ID
router.post('/actualizar/:id', casoControllers.actualizar);
router.get('/eli', casoControllers.eliminarTodos);

// Ruta para actualizar un caso por su ID
module.exports = router;

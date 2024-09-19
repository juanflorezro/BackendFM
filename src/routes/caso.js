const router = require('express').Router();
const casoControllers = require('../controllers/casoControllers');

const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar el archivo temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Carpeta donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

// Define el middleware 'upload'
const upload = multer({ storage: storage });

//listar los valores unicos de cada item orientado al filtro

router.get('/unique', casoControllers.listarUnique)


// Ruta para listar todos los casos
router.post('/', casoControllers.listar);
router.get('/eli', casoControllers.eliminarTodos);
// Ruta para ver un caso específico
//router.post('/caso', casoControllers.listar2); // Asegúrate de que esta ruta esté correcta
router.get('/:id', casoControllers.listarIdcaso); // Asegúrate de que esta ruta esté correcta

// Ruta para agregar un nuevo caso
router.post('/crear', casoControllers.agregarfijo); // Cambia de GET a POST para evitar conflictos
router.post('/crearlote', casoControllers.agregarLote);


router.post('/agregarexcel', upload.single('file'), casoControllers.agregarArchivo);

// Ruta para eliminar un caso por su ID
router.delete('/eliminar/:id', casoControllers.eliminar);
router.delete('/:casoId/comentarios/:comentarioId', casoControllers.eliminarc);

// Ruta para actualizar un caso por su ID
router.post('/actualizar/:id', casoControllers.actualizar);


// Ruta para actualizar un caso por su ID
module.exports = router;

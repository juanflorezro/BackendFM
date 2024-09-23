const express = require('express');
const { PORT } = require('./src/const/globalConst')
const cors = require('cors')
const connect = require('./connection/connectDB')
const cron = require('node-cron');
const moment = require('moment-timezone');
const CreateBackUp = require('./src/backupCaso/backUp')

const casoR = require('./src/routes/caso')
const clienteR = require('./src/routes/cliente')
const usuarioR = require('./src/routes/usuario')
const juzgadoR = require('./src/routes/juzgado')
const siniestroR = require('./src/routes/siniestro')
const loginR = require('./src/routes/login')

const configApi = (app) => {
    app.use(cors({ origin: "*" }));
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    return;
}

const configRoutes = (app) => {
    app.use('/casos', casoR)
    app.use('/clientes', clienteR)
    app.use('/usuarios', usuarioR)
    app.use('/juzgados', juzgadoR)
    app.use('/siniestros', siniestroR)
    app.use('/login', loginR)
}

const init = () => {
    const app = express()
    connect()
    configApi(app)
    configRoutes(app)

    // Obtén la hora actual en la zona horaria deseada
    const timezone = 'America/Bogota'; // Cambia esto a la zona horaria que necesites
    const currentTime = moment().tz(timezone);
    const hours = currentTime.hours();
    const minutes = currentTime.minutes();

    cron.schedule(`37 ${hours} * * *`, async () => {
        try {
            console.log('Iniciando backup a las 12:35 a.m.');
            await CreateBackUp()
             // Ajusta la URL si es necesario
            console.log('Backup completado con éxito.');
        } catch (error) {
            console.error('Error al ejecutar el backup:', error);
        }
    }, {
        scheduled: true,
        timezone: timezone // Añade la opción de zona horaria
    })

    app.listen(PORT, () => {
        console.log('servidor corriendo en el puerto: ', PORT)
    })
}

init();
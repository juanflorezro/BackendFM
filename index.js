const express = require('express');
const {PORT} = require('./src/const/globalConst')
const cors = require('cors')
const connect  = require('./connection/connectDB')

const casoR = require('./src/routes/caso')
const clienteR = require('./src/routes/cliente')
const usuarioR = require('./src/routes/usuario')
const juzgadoR = require('./src/routes/juzgado')
const siniestroR = require('./src/routes/siniestro')
const loginR = require('./src/routes/login')

const configApi = (app) => {
    app.use(cors({ origin: "*" }));
    app.use(express.json())
    app.use(express.urlencoded({extended : true}))
    return;
}

const configRoutes = (app) => {
    app.use('/casos', casoR)
    app.use('/clientes', clienteR)
    app.use('/usuarios', usuarioR)
    app.use('/juzgados', juzgadoR)
    app.use('/siniestros', siniestroR)
    app.use('/login' , loginR)
}

const init = () => {
    const app = express()
    connect()
    configApi(app)
    configRoutes(app)

    app.listen(PORT, ()=>{
        console.log('servidor corriendo en el puerto: ', PORT)
    })
}

init();
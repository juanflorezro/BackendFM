const validationJWT = require('../security/validationJWT')
const Caso = require('../models/caso')
const Cliente = require('../models/cliente')
const Usuario = require('../models/usuario')
const Siniestro = require('../models/siniestro')
const Juzgado = require('../models/juzgado')
const limpiarValorMonetario = require('../helpers/limpiarValorMomentanio')
const validateCliente = require('../controllers/clienteControllers')
const validateUsuario = require('../controllers/usuarioControllers')
const validateJuzgado = require('../controllers/juzgadoControllers')
const validateSiniestro = require('../controllers/siniestroControllers')
const siniestro = require('../models/siniestro')

const XLSX = require('xlsx')
const fs = require('fs')

module.exports = {
    listar: async (req, res) => {
        const { page = 1, limit = 5 } = req.query
        const { coincidencias } = req.query
        const filtro = req.body.data
        const token = req.headers['authorization']
        if (!token) {
            return res.status(401).json({ message: 'Acceso Denegado' })
        }

        try {
            const acceso = await validationJWT(JSON.parse(token))

            if (!acceso) {
                return res.status(403).json({ message: 'Acceso Denegado' })
            }

            if (filtro) {
                const casos = await Caso.find(filtro)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('cliente abogadoACargo')

                const total = await Caso.countDocuments(filtro)
                return res.status(200).json({
                    data: casos,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(page),
                    totalCasos: total,
                })
            } else {
                if (coincidencias == '' || coincidencias == ' ') {
                    const regex = new RegExp(coincidencias, 'i')
                    console.log('entrando')
                    // Búsqueda en campos simples
                    const resultadosSimples = await Caso.find({
                        $or: [
                            { numero: regex },
                            { codigo: regex },
                            { titulo: regex },
                            { asunto: regex },
                            { area: regex },
                            { centroDeTrabajo: regex },
                            { poliza: regex },
                            { ramo: regex },
                            { amparo: regex },
                            { numeroAplicativo: regex },
                            { ciudad: regex },
                            { radicado: regex },
                            { parteActiva: regex },
                            { partePasiva: regex },
                            { tipoDeTramite: regex },
                            { claseDeProceso: regex },
                            { tipoDeVinculacionCliente: regex },
                            { pretensionesEnDinero: regex },
                            { calificacionInicialContingencia: regex },
                            { calificacionActualContingencia: regex },
                            { motivoDeLaCalificacion: regex },
                            { instancia: regex },
                            { etapaProcesal: regex },
                            { claseDeMedidaCautelar: regex },
                            { honorariosAsignados: regex },
                            { autoridadDeConocimiento: regex },
                            { delito: regex },
                            { placa: regex },
                            { evento: regex },
                            { probabilidadDeExito: regex },
                            { valorIndemnizadoCliente: regex },
                            { entidadAfectada: regex },
                            { tipoContragarantia: regex },
                            { montoDeProvision: regex },
                            { tipoDeMoneda: regex },
                            { motivoDeTerminacion: regex },
                            { seInicioEjecutivoAContinuacionDeOrdinario: regex },
                            { honorariosAsignados2: regex },
                            { valorPagado: regex },
                            { personaQueRealizoElPago: regex },
                            { departamento: regex },
                            { asegurado: regex },
                            { jurisdiccion: regex },
                            { tituloUltimaActuacion: regex },
                        ]
                    })
                        .skip((page - 1) * limit)
                        .limit(parseInt(limit))
                        .select('_i')

                    const casosSimplesIds = resultadosSimples.map(caso => caso._id)
                    // Búsqueda en colecciones referenciadas
                    const clientes = await Cliente.find({ nombre: regex })
                    const clienteIds = clientes.map(cliente => cliente._id)
                    const usuarios = await Usuario.find({ nombre: regex })
                    const usuarioIds = usuarios.map(usuario => usuario._id)
                    const siniestros = await Siniestro.find({ numero: regex })
                    const siniestroIds = siniestros.map(siniestro => siniestro._id)
                    const juzgados = await Juzgado.find({ nombre: regex })
                    const juzgadoIds = juzgados.map(juzgado => juzgado._id)

                    const resultadosCombinados = await Caso.find({
                        $or: [
                            { cliente: { $in: clienteIds } },
                            { directorACargo: { $in: usuarioIds } },
                            { abogadoACargo: { $in: usuarioIds } },
                            { abogadoInternoDeLaCompania: { $in: usuarioIds } },
                            { siniestro: { $in: siniestroIds } },
                            { juzgadoInt: { $in: juzgadoIds } },
                            { cliente2: { $in: clienteIds } },
                            { abogadoInternoDeLaCompania2: { $in: usuarioIds } },
                            { siniestro2: { $in: siniestroIds } },
                            { juzgado: { $in: juzgadoIds } },
                        ]
                    })
                        .skip((page - 1) * limit)
                        .limit(parseInt(limit))
                        .select('_id')

                    const casosReferenciadosIds = resultadosCombinados.map(caso => caso._id)
                    const todosLosIds = new Set([...casosSimplesIds, ...casosReferenciadosIds])
                    const casosFinales = await Caso.find()
                        .skip((page - 1) * limit)
                        .limit(parseInt(limit))
                        .populate('cliente abogadoACargo')
                    const total = await Caso.countDocuments()
                    return res.status(200).json({
                        data: casosFinales,
                        totalPages: Math.ceil(total / limit),
                        currentPage: parseInt(page),
                        totalCasos: total,
                    })

                } else {
                    const regex = new RegExp(coincidencias, 'i')

                    // Búsqueda en campos simples
                    const resultadosSimples = await Caso.find({
                        $or: [
                            { numero: regex },
                            { codigo: regex },
                            { titulo: regex },
                            { asunto: regex },
                            { area: regex },
                            { centroDeTrabajo: regex },
                            { poliza: regex },
                            { ramo: regex },
                            { amparo: regex },
                            { numeroAplicativo: regex },
                            { ciudad: regex },
                            { radicado: regex },
                            { parteActiva: regex },
                            { partePasiva: regex },
                            { tipoDeTramite: regex },
                            { claseDeProceso: regex },
                            { tipoDeVinculacionCliente: regex },
                            { pretensionesEnDinero: regex },
                            { calificacionInicialContingencia: regex },
                            { calificacionActualContingencia: regex },
                            { motivoDeLaCalificacion: regex },
                            { instancia: regex },
                            { etapaProcesal: regex },
                            { claseDeMedidaCautelar: regex },
                            { honorariosAsignados: regex },
                            { autoridadDeConocimiento: regex },
                            { delito: regex },
                            { placa: regex },
                            { evento: regex },
                            { probabilidadDeExito: regex },
                            { valorIndemnizadoCliente: regex },
                            { entidadAfectada: regex },
                            { tipoContragarantia: regex },
                            { montoDeProvision: regex },
                            { tipoDeMoneda: regex },
                            { motivoDeTerminacion: regex },
                            { seInicioEjecutivoAContinuacionDeOrdinario: regex },
                            { honorariosAsignados2: regex },
                            { valorPagado: regex },
                            { personaQueRealizoElPago: regex },
                            { departamento: regex },
                            { asegurado: regex },
                            { jurisdiccion: regex },
                            { tituloUltimaActuacion: regex },
                        ]
                    })
                        .select('_i')

                    const casosSimplesIds = resultadosSimples.map(caso => caso._id)
                    // Búsqueda en colecciones referenciadas
                    const clientes = await Cliente.find({ nombre: regex })
                    const clienteIds = clientes.map(cliente => cliente._id)
                    const usuarios = await Usuario.find({ nombre: regex })
                    const usuarioIds = usuarios.map(usuario => usuario._id)
                    const siniestros = await Siniestro.find({ numero: regex })
                    const siniestroIds = siniestros.map(siniestro => siniestro._id)
                    const juzgados = await Juzgado.find({ nombre: regex })
                    const juzgadoIds = juzgados.map(juzgado => juzgado._id)

                    const resultadosCombinados = await Caso.find({
                        $or: [
                            { cliente: { $in: clienteIds } },
                            { directorACargo: { $in: usuarioIds } },
                            { abogadoACargo: { $in: usuarioIds } },
                            { abogadoInternoDeLaCompania: { $in: usuarioIds } },
                            { siniestro: { $in: siniestroIds } },
                            { juzgadoInt: { $in: juzgadoIds } },
                            { cliente2: { $in: clienteIds } },
                            { abogadoInternoDeLaCompania2: { $in: usuarioIds } },
                            { siniestro2: { $in: siniestroIds } },
                            { juzgado: { $in: juzgadoIds } },
                        ]
                    })
                        .select('_id')

                    const casosReferenciadosIds = resultadosCombinados.map(caso => caso._id)
                    const todosLosIds = new Set([...casosSimplesIds, ...casosReferenciadosIds])
                    const casosFinales = await Caso.find({ _id: { $in: Array.from(todosLosIds) } })
                        .skip((page - 1) * limit)
                        .limit(parseInt(limit))
                        .populate('cliente abogadoACargo')
                    const total = await Caso.countDocuments({ _id: { $in: Array.from(todosLosIds) } })
                    return res.status(200).json({
                        data: casosFinales,
                        totalPages: Math.ceil(total / limit),
                        currentPage: parseInt(page),
                        totalCasos: total,
                    })
                }
            }

        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
    },
    listarUnique: async (req, res) => {
        const data = req.body.data

        try {

            const areas = await Caso.distinct('area')
            const centrosDeTrabajo = await Caso.distinct('centroDeTrabajo')
            const clasesDeProceso = await Caso.distinct('claseDeProceso')
            const ciudades = await Caso.distinct('ciudad')
            const clientes = await Cliente.find()
            const abogadoACargoIds = await Caso.distinct('abogadoACargo')
            const abogadosACargo = await Usuario.find({ _id: { $in: abogadoACargoIds } })

            res.json({
                clientes,
                areas,
                centrosDeTrabajo,
                clasesDeProceso,
                abogadosACargo,
                ciudades,

            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    listarIdcaso: async (req, res) => {
        const { id } = req.params
        const token = req.headers['authorization']
        if (!token) {
            return res.status(401).json({ message: 'Acceso Denegado' })
        }
        try {
            const acceso = await validationJWT(JSON.parse(token))

            if (!acceso) {
                return res.status(403).json({ message: 'Acceso Denegado' })
            }

            const caso = await Caso.findById(id)
                .populate('cliente')
                .populate('directorACargo')
                .populate('abogadoACargo')
                .populate('abogadoInternoDeLaCompania')
                .populate('siniestro')
                .populate('juzgadoInt')
                .populate('cliente2')
                .populate('abogadoInternoDeLaCompania2')
                .populate('siniestro2')
                .populate('juzgado')

            if (!caso) return res.status(404).json({ message: ' Caso no encontrado' })

            res.status(200).json({
                message: 'caso encontrado correctamente',
                caso: caso
            })

        } catch (error) {
            res.status(500).json({ message: 'Error en la búsqueda de casos', error })
        }
    },
    agregarfijo: async (req, res) => {
        const token = req.headers['authorization'];
    
        if (!token) {
            return res.status(401).json({ message: 'Acceso Denegado' });
        }
    
        try {
            const acceso = await validationJWT(JSON.parse(token));
            if (!acceso) {
                return res.status(401).json({ message: 'Acceso Denegado' });
            }
    
            const caso = req.body.data;
            console.log(caso.directorACargo);
    
            // Realizar las consultas en paralelo
            const [
                clienteDocId,
                directorDocId,
                abogadoDocId,
                abogadoInternoDocId,
                siniestroDocId,
                juzgadoIntDocId,
                cliente2DocInt,
                abogadoIntern2DocInd,
                siniestro2DocId,
                juzgadoDocId
            ] = await Promise.all([
                caso.cliente ? validateCliente.validationClient(caso.cliente) : Promise.resolve(null),
                caso.directorACargo ? validateUsuario.validateUsuario(caso.directorACargo) : Promise.resolve(null),
                caso.abogadoACargo ? validateUsuario.validateUsuario(caso.abogadoACargo) : Promise.resolve(null),
                caso.abogadoInternoDeLaCompania ? validateUsuario.validateUsuario(caso.abogadoInternoDeLaCompania) : Promise.resolve(null),
                caso.siniestro ? validateSiniestro.validationSiniestro(caso.siniestro) : Promise.resolve(null),
                caso.juzgadoInt ? validateJuzgado.validationJuzgado(caso.juzgadoInt) : Promise.resolve(null),
                caso.cliente2 ? validateUsuario.validateUsuario(caso.cliente2) : Promise.resolve(null),
                caso.abogadoInternoDeLaCompania2 ? validateUsuario.validateUsuario(caso.abogadoInternoDeLaCompania2) : Promise.resolve(null),
                caso.siniestro2 ? validateSiniestro.validationSiniestro(caso.siniestro2) : Promise.resolve(null),
                caso.juzgado ? validateJuzgado.validationJuzgado(caso.juzgado) : Promise.resolve(null)
            ]);
    
            const nuevoCaso = new Caso({
                ...caso,
                cliente: clienteDocId,
                directorACargo: directorDocId,
                abogadoACargo: abogadoDocId,
                abogadoInternoDeLaCompania: abogadoInternoDocId,
                juzgadoInt: juzgadoIntDocId,
                siniestro: siniestroDocId,
                juzgado: juzgadoDocId,
                cliente2: cliente2DocInt,
                abogadoInternoDeLaCompania2: abogadoIntern2DocInd,
                siniestro2: siniestro2DocId
            });
    
            const casoGuardado = await nuevoCaso.save();
            res.status(201).json(casoGuardado);
    
        } catch (error) {
            console.error('Error en agregarFijo:', error.message);
            res.status(500).json({ message: error.message });
        }
    },    
    agregarLote: async (req, res) => {

        const token = req.headers['authorization']

        if (token) {
            try {
                const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
                if (acceso) {
                    try {
                        const newcasos = []
                        const casos = req.body.data
                        for (let x = 0; x < casos.length; x++) {

                            console.log(x)

                            const caso = casos[x]
                            
                            const clienteDocId = await validateCliente.validationClient(caso.cliente.nombre)
                            const cliente2Docid = await validateCliente.validationClient(caso.cliente2.nombre)
                            const directorDocId = await validateUsuario.validateUsuario(caso.directorACargo.nombre)

                            const abogadoDocId = await validateUsuario.validateUsuario(caso.abogadoACargo.nombre)
                            const abogadoIntern2DocInd = await validateUsuario.validateUsuario(caso.abogadoInternoDeLaCompania2.nombre)

                            const abogadoInternoDocId = await validateUsuario.validateUsuario(caso.abogadoInternoDeLaCompania.nombre)
                            const sisniestro2DocId = await validateSiniestro.validationSiniestro(caso.siniestro2.numero)
                            const siniestroDocId = await validateSiniestro.validationSiniestro(caso.siniestro.numero)
                            const juzgadoDocId = await validateJuzgado.validationJuzgado(caso.juzgado.nombre)
                            const juzgadoIntDocId = await validateJuzgado.validationJuzgado(caso.juzgadoInt.nombre)

                            const pretensionesEnDinero = limpiarValorMonetario(caso.pretensionesEnDinero)
                            const honorariosAsignados = limpiarValorMonetario(caso.honorariosAsignados)
                            const valorIndemnizadoCliente = limpiarValorMonetario(caso.valorIndemnizadoCliente)
                            const montoDeProvision = limpiarValorMonetario(caso.montoDeProvision)
                            const honorariosAsignados2 = limpiarValorMonetario(caso.honorariosAsignados2)
                            const valorPagado = limpiarValorMonetario(caso.valorPagado)


                            const usuarioCreadorDocId = caso.usuarioCreador.nombre ? await validateUsuario.validateUsuario(caso.usuarioCreador.nombre) : null
                            console.log('entrando')
                            const nuevoCaso = new Caso({
                                ...caso,
                                cliente: clienteDocId,
                                cliente2: cliente2Docid,
                                directorACargo: directorDocId,
                                abogadoACargo: abogadoDocId,
                                abogadoInternoDeLaCompania: abogadoInternoDocId,
                                abogadoInternoDeLaCompania2: abogadoIntern2DocInd,
                                juzgadoInt: juzgadoIntDocId,
                                siniestro: siniestroDocId,
                                siniestro2: sisniestro2DocId,
                                juzgado: juzgadoDocId,
                                usuarioCreador: usuarioCreadorDocId,
                                pretensionesEnDinero,
                                honorariosAsignados,
                                valorIndemnizadoCliente,
                                montoDeProvision,
                                honorariosAsignados2,
                                valorPagado
                            })
                            newcasos.push(nuevoCaso)
                            console.log(newcasos)
                        }
                        const casoGuardado = await Caso.insertMany(newcasos)
                        console.log('casosInsertado', casoGuardado._id)

                        res.status(201).json(casoGuardado)
                    } catch (error) {
                        res.status(500).json({ message: error.message })
                    }
                } else {
                    res.status(500).json({ message: 'Acceso Denegado' })
                }
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }

    },
    agregarArchivo: async (req, res) => {
        try {
            const file = req.file
            const workbook = XLSX.readFile(file.path)
            const sheetName = workbook.SheetNames[0]

            // Valida que el nombre de la hoja sea 'procesos'
            if (sheetName.toLowerCase() !== 'procesos') {
                fs.unlinkSync(file.path); // Elimina el archivo temporal
                return res.status(400).json({ message: 'El archivo debe contener una hoja llamada "procesos"', hoja: false });
            }

            // Procesa la hoja si el nombre es valido
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            // Encabezados del archivo Excel
            const headers = worksheet[0].map(header => header.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            const validHeaders = [
                'n°', 'codigo', 'titulo', 'cliente', 'asunto', 'area', 'fecha de asignacion',
                'centro de trabajo', 'director a cargo', 'abogado a cargo',
                'abogado interno de la compania', 'numero de siniestro', 'fecha del siniestro', 'poliza',
                'ramo', 'amparo', 'numero de aplicativo', 'ciudad', 'juzgado int', 'radicado',
                'parte activa', 'parte pasiva', 'tipo de tramite', 'clase de proceso',
                'tipo de vinculacion cliente', 'pretensiones en dinero',
                'calificacion inicial contingencia', 'calificacion actual contingencia',
                'motivo de la calificacion', 'fecha admision/vinculacion',
                'fecha de notificacion', 'instancia', 'etapa procesal', 'clase de medida cautelar',
                'honorarios asignados', 'autoridad de conocimiento', 'delito', 'placa',
                'evento', 'probabilidad de exito', 'valor indemnizado cliente',
                'entidad afectada', 'fecha de pago cliente', 'tipo contragarantia (pagare/letra)',
                'monto de provision', 'tipo de moneda', 'fecha de terminacion',
                'motivo de terminacion', 'cliente 2', 'fecha de asignacion 2',
                'abogado interno de la compania 2', 'numero de siniestro 2', 'numero de aplicativo 2',
                'fecha de notificacion 2', 'se inicio ejecutivo a continuacion de ordinario',
                'honorarios asignados 2', 'valor pagado', 'persona que realizo el pago',
                'fecha de radicacion de la contestacion', 'fecha de radicacion de la contestacion 2',
                'departamento', 'asegurado', 'jurisdiccion', 'juzgado', 'fecha ultima actuacion',
                'titulo ultima actuacion', 'fecha que realizo el pago', 'codigo interno'
              ];
              
            
    
            // Verifica si hay encabezados no validos
            const invalidHeaders = headers.filter(header => !validHeaders.includes(header.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
            
            if (invalidHeaders.length > 0) {
                fs.unlinkSync(file.path); // Elimina el archivo temporal
                return res.status(400).json({ message: `Los siguientes encabezados no son validos: ${invalidHeaders.join(' | ')}`, hoja: false });
            }
            // Array donde se guardaran los casos
            const casos = []

            const formatDate = (date) => {
                if (!date || isNaN(new Date(date).getTime())) {
                    return null;
                }
            
                const d = new Date(date);
            
                // Obtener el año, mes y día de la fecha en UTC
                const year = d.getUTCFullYear();
                const month = ('0' + (d.getUTCMonth() + 1)).slice(-2); // Meses son de 0 a 11
                const day = ('0' + d.getUTCDate()).slice(-2);
            
                return `${year}-${month}-${day}`;
            };
            

            
            const excelDateToJSDate = (serial) => {
                // Excel utiliza el 1 de enero de 1900 como el primer día.
                const excelEpoch = new Date(1899, 11, 30); // Excel fecha base es el 30 de diciembre de 1899
                const jsDate = new Date(excelEpoch.getTime() + serial * 86400000); // 86400000 ms en un día
                return jsDate;
            };
            // Usa for...of para iterar sobre las filas y procesar de manera asíncrona
            for (const row of worksheet.slice(1)) {

                let caso = {
                    numero: null,
                    codigo: null,
                    titulo: null,
                    cliente: null,
                    asunto: null,
                    area: null,
                    fechaDeAsignacion: null,
                    centroDeTrabajo: null,
                    directorACargo: null,
                    abogadoACargo: null,
                    abogadoInternoDeLaCompania: null,
                    siniestro: null,
                    fechaSiniestro: null,
                    poliza: null,
                    ramo: null,
                    amparo: null,
                    numeroAplicativo: null,
                    ciudad: null,
                    juzgadoInt: null,
                    radicado: null,
                    parteActiva: null,
                    partePasiva: null,
                    tipoDeTramite: null,
                    claseDeProceso: null,
                    tipoDeVinculacionCliente: null,
                    pretensionesEnDinero: null,
                    calificacionInicialContingencia: null,
                    calificacionActualContingencia: null,
                    motivoDeLaCalificacion: null,
                    fechaAdmisionVinculacion: null,
                    fechaDeNotificacion: null,
                    instancia: null,
                    etapaProcesal: null,
                    claseDeMedidaCautelar: null,
                    honorariosAsignados: null,
                    autoridadDeConocimiento: null,
                    delito: null,
                    placa: null,
                    evento: null,
                    probabilidadDeExito: null,
                    valorIndemnizadoCliente: null,
                    entidadAfectada: null,
                    fechaDePagoCliente: null,
                    tipoContragarantia: null,
                    montoDeProvision: null,
                    tipoDeMoneda: null,
                    fechaDeTerminacion: null,
                    motivoDeTerminacion: null,
                    cliente2: null,
                    fechaDeAsignacion2: null,
                    abogadoInternoDeLaCompania2: null,
                    siniestro2: null,
                    numeroDeAplicativo2: null,
                    fechaDeNotificacion2: null,
                    seInicioEjecutivoAContinuacionDeOrdinario: null,
                    honorariosAsignados2: null,
                    valorPagado: null,
                    personaQueRealizoElPago: null,
                    fechaDeRadicacionDeLaContestacion: null,
                    fechaDeRadicacionDeLaContestacion2: null,
                    departamento: null,
                    asegurado: null,
                    jurisdiccion: null,
                    juzgado: null,
                    fechaUltimaActuacion: null,
                    tituloUltimaActuacion: null,
                    fechaQueRealizoElPago: null,
                    codigoInterno: null,
                    comentarios: []
                }


                for (let index = 0; index < headers.length; index++) {
                    const header = headers[index]
                    let value = row[index]
                    if (value === "N/A" || value === '' || value === undefined) {
                        value = null
                    }
                    switch (header) {
                        case 'n°':
                            caso.numero = value +'';
                            break;
                        case 'codigo':
                            caso.codigo = value;
                            break;
                        case 'titulo':
                            caso.titulo = value;
                            break;
                        case 'cliente':
                            caso.cliente = value;
                            break;
                        case 'asunto':
                            caso.asunto = value;
                            break;
                        case 'area':
                            caso.area = value;
                            break;
                        case 'fecha de asignacion':
                            caso.fechaDeAsignacion = value;
                            break;
                        case 'centro de trabajo':
                            caso.centroDeTrabajo = value;
                            break;
                        case 'director a cargo':
                            caso.directorACargo = value;
                            break;
                        case 'abogado a cargo':
                            caso.abogadoACargo = value;
                            break;
                        case 'abogado interno de la compañia':
                            caso.abogadoInternoDeLaCompania = value;
                            break;
                        case 'numero de siniestro':
                            caso.siniestro = value;
                            break;
                        case 'fecha del siniestro':
                            caso.fechaSiniestro = value;
                            break;
                        case 'poliza':
                            caso.poliza = value;
                            break;
                        case 'ramo':
                            caso.ramo = value;
                            break;
                        case 'amparo':
                            caso.amparo = value;
                            break;
                        case 'numero de aplicativo':
                            caso.numeroAplicativo = value;
                            break;
                        case 'ciudad':
                            caso.ciudad = value;
                            break;
                        case 'juzgado int':
                            caso.juzgadoInt = value;
                            break;
                        case 'radicado':
                            caso.radicado = value;
                            break;
                        case 'parte activa':
                            caso.parteActiva = value;
                            break;
                        case 'parte pasiva':
                            caso.partePasiva = value;
                            break;
                        case 'tipo de tramite':
                            caso.tipoDeTramite = value;
                            break;
                        case 'clase de proceso':
                            caso.claseDeProceso = value;
                            break;
                        case 'tipo de vinculacion cliente':
                            caso.tipoDeVinculacionCliente = value;
                            break;
                        case 'pretensiones en dinero':
                            caso.pretensionesEnDinero = value;
                            break;
                        case 'calificacion inicial contingencia':
                            caso.calificacionInicialContingencia = value;
                            break;
                        case 'calificacion actual contingencia':
                            caso.calificacionActualContingencia = value;
                            break;
                        case 'motivo de la calificacion':
                            caso.motivoDeLaCalificacion = value;
                            break;
                        case 'fecha admision/vinculacion':
                            caso.fechaAdmisionVinculacion = value;
                            break;
                        case 'fecha de notificacion':
                            caso.fechaDeNotificacion = value;
                            break;
                        case 'instancia':
                            caso.instancia = value;
                            break;
                        case 'etapa procesal':
                            caso.etapaProcesal = value;
                            break;
                        case 'clase de medida cautelar':
                            caso.claseDeMedidaCautelar = value;
                            break;
                        case 'honorarios asignados':
                            caso.honorariosAsignados = value;
                            break;
                        case 'autoridad de conocimiento':
                            caso.autoridadDeConocimiento = value;
                            break;
                        case 'delito':
                            caso.delito = value;
                            break;
                        case 'placa':
                            caso.placa = value;
                            break;
                        case 'evento':
                            caso.evento = value;
                            break;
                        case 'probabilidad de exito':
                            caso.probabilidadDeExito = value;
                            break;
                        case 'valor indemnizado cliente':
                            caso.valorIndemnizadoCliente = value;
                            break;
                        case 'entidad afectada':
                            caso.entidadAfectada = value;
                            break;
                        case 'fecha de pago cliente':
                            caso.fechaDePagoCliente = value;
                            break;
                        case 'tipo contragarantia (pagare/letra)':
                            caso.tipoContragarantia = value;
                            break;
                        case 'monto de provision':
                            caso.montoDeProvision = value;
                            break;
                        case 'tipo de moneda':
                            caso.tipoDeMoneda = value;
                            break;
                        case 'fecha de terminacion':
                            caso.fechaDeTerminacion = value;
                            break;
                        case 'motivo de terminacion':
                            caso.motivoDeTerminacion = value;
                            break;
                        case 'cliente 2':
                            caso.cliente2 = value;
                            break;
                        case 'fecha de asignacion 2':
                            caso.fechaDeAsignacion2 = value;
                            break;
                        case 'abogado interno de la compañia 2':
                            caso.abogadoInternoDeLaCompania2 = value;
                            break;
                        case 'numero de siniestro 2':
                            caso.siniestro2 = value;
                            break;
                        case 'numero de aplicativo 2':
                            caso.numeroDeAplicativo2 = value;
                            break;
                        case 'fecha de notificacion 2':
                            caso.fechaDeNotificacion2 = value;
                            break;
                        case 'se inicio ejecutivo a continuacion de ordinario':
                            caso.seInicioEjecutivoAContinuacionDeOrdinario = value;
                            break;
                        case 'honorarios asignados 2':
                            caso.honorariosAsignados2 = value;
                            break;
                        case 'valor pagado':
                            caso.valorPagado = value;
                            break;
                        case 'persona que realizo el pago':
                            caso.personaQueRealizoElPago = value;
                            break;
                        case 'fecha de radicacion de la contestacion':
                            caso.fechaDeRadicacionDeLaContestacion = value;
                            break;
                        case 'fecha de radicacion de la contestacion 2':
                            caso.fechaDeRadicacionDeLaContestacion2 = value;
                            break;
                        case 'departamento':
                            caso.departamento = value;
                            break;
                        case 'asegurado':
                            caso.asegurado = value;
                            break;
                        case 'jurisdiccion':
                            caso.jurisdiccion = value;
                            break;
                        case 'juzgado':
                            caso.juzgado = value;
                            break;
                        case 'fecha ultima actuacion':
                            if (typeof value === 'number') {
                                value = excelDateToJSDate(value);
                            }
                            caso.fechaUltimaActuacion = value ? formatDate(value) : null;
                            break;
                        case 'titulo ultima actuacion':
                            caso.tituloUltimaActuacion = value;
                            break;
                        case 'fecha que realizo el pago':
                            caso.fechaQueRealizoElPago = value;
                            break;
                        case 'codigo interno':
                            caso.codigoInterno = value;
                            break;
                    }
                    
                }
                caso.comentarios = []
                // Agrega el caso al array de casos
                casos.push(caso)
            }

            // Guarda los casos en la base de datos
            //await Caso.insertMany(casos)

            // Elimina el archivo temporal despues de procesarlo
            fs.unlinkSync(file.path)
            //console.log(casos)


            //auqiva a vernir la logca para agregar los casos 

            res.status(200).json({ message: 'Precaución Por favor, valida los casos obtenidos ', casos, hoja: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error al cargar los casos' })
        }
    },


    eliminar: async (req, res) => {
        const token = req.headers['authorization']
        console.log('encontrado')
        if (token) {
            try {
                const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
                if (acceso) {
                    try {
                        const { id } = req.params
                        const casoEliminado = await Caso.findByIdAndDelete(id)
                        if (!casoEliminado) return res.status(404).json({ message: 'Caso no encontrado' })
                        res.json({ message: 'Caso eliminado exitosamente' })
                    } catch (error) {
                        res.status(500).json({ message: error.message })
                    }
                } else {
                    res.status(500).json({ message: 'Acceso Denegado' })
                }
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }

    },
    eliminarTodos: async (req, res) => {
        console.log('encontrado')

        try {
            await Caso.deleteMany({})
            await Cliente.deleteMany({})
            await Usuario.deleteMany({})
            await Juzgado.deleteMany({})
            await Siniestro.deleteMany({})

            res.json({ message: 'Todos los casos han sido eliminados exitosamente' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    actualizar: async (req, res) => {
        const casoData = req.body.data // Datos del caso a actualizar
        const { id } = req.params // ID del caso que se va a actualizar
        const token = req.headers['authorization']

        if (token) {
            try {
                const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
                if (acceso) {
                    try {
                        // Encuentra el caso existente
                        const casoExistente = await Caso.findById(id)

                        if (!casoExistente) {
                            return res.status(404).json({ message: 'Caso no encontrado' })
                        }

                        // Si se incluyen nuevos comentarios en la actualización, combínalos con los existentes
                        if (casoData.comentarios) {
                            // Combinamos los comentarios antiguos con los nuevos
                            const comentariosExistentes = casoExistente.comentarios || []
                            const nuevosComentarios = casoData.comentarios || []

                            // Puedes evitar duplicados si es necesario, por ejemplo, usando un identificador único
                            // Aquí simplemente concatenamos los comentarios nuevos a los existentes
                            casoData.comentarios = [...comentariosExistentes, ...nuevosComentarios]
                        }


                        // Actualiza el caso con los nuevos datos
                        const casoActualizado = await Caso.findByIdAndUpdate(id, casoData, { new: true })

                        if (!casoActualizado) {
                            return res.status(404).json({ message: 'Caso no encontrado' })
                        }


                        res.status(201).json({ caso: casoActualizado })
                    } catch (error) {
                        res.status(500).json({ message: error.message })
                    }
                } else {
                    res.status(500).json({ message: 'Acceso Denegado' })
                }
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }

    },
    eliminarc: async (req, res) => {
        const casoData = req.body.data // Datos del caso a actualizar
        const { casoId, comentarioId } = req.params
        const token = req.headers['authorization']
        console.log(req.params)
        if (token) {
            try {
                const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
                if (acceso) {


                    try {
                        const caso = await Caso.findById(casoId)

                        if (!caso) {
                            return res.status(404).json({ message: 'Caso no encontrado' })
                        }

                        // Filtra los comentarios para eliminar el que tenga el _id igual al comentarioId
                        caso.comentarios = caso.comentarios.filter(comentario => comentario._id.toString() !== comentarioId)

                        await caso.save()

                        res.status(200).json({ message: 'Comentario eliminado con exito', caso })
                    } catch (error) {
                        res.status(500).json({ message: error.message })
                    }
                } else {
                    res.status(500).json({ message: 'Acceso Denegado' })
                }
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }

    },
}
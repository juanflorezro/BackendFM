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

module.exports = {
    listar: async (req, res) => {
        const token = req.headers['authorization']

        if (token) {
            try {
                const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
                if (acceso) {
                    try {
                        const casos = await Caso.find()
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
                        console.log(casos)
                        res.json(casos)
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
    listar2: async (req, res) => {
        const data = req.body.data
        const token = req.headers['authorization']
        console.log(data)

        const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
        if (acceso) {

            try {
                const casos = await Caso.find(data)
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

                res.json(casos)

            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }
    },
    listar3: async (req, res) => {
        const data = req.body.data
        const token = req.headers['authorization']
        console.log(data)

        const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
        if (acceso) {

            try {
                const regex = new RegExp(data, 'i');
            
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
                }).select('_i')
                const casosSimplesIds = resultadosSimples.map(caso => caso._id)

                
            
                // Búsqueda en colecciones referenciadas
                const clientes = await Cliente.find({ nombre: regex });
                const clienteIds = clientes.map(cliente => cliente._id);
            
                const usuarios = await Usuario.find({ nombre: regex });
                const usuarioIds = usuarios.map(usuario => usuario._id);
            
                const siniestros = await Siniestro.find({ numero: regex });
                const siniestroIds = siniestros.map(siniestro => siniestro._id);
            
                const juzgados = await Juzgado.find({ nombre: regex });
                const juzgadoIds = juzgados.map(juzgado => juzgado._id);
            
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
                }).select('_id')

                const casosReferenciadosIds = resultadosCombinados.map(caso => caso._id)
                const todosLosIds = new Set([...casosSimplesIds, ...casosReferenciadosIds])
                const casosFinales = await Caso.find({ _id: { $in: Array.from(todosLosIds) } })
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

                
            
                res.json(casosFinales)
              } catch (error) {
                res.status(500).json({ message: 'Error en la búsqueda de casos', error });
              }
        } else {
            res.status(500).json({ message: 'Acceso Denegado' })
        }
    },
    agregarfijo: async (req, res) => {
        const token = req.headers['authorization']
        const caso = req.body.data
        if (token) {
            try {
                const acceso = await validationJWT(JSON.parse(token)).catch((err) => (console.log(err)))
                if (acceso) {
                    try {
                        const caso = req.body.data
                        console.log(caso)

                        const clienteDocId = caso.cliente?.nombre ? await validateCliente.validationClient(caso.cliente.nombre) : null;
                        const directorDocId = caso.directorACargo?.nombre ? await validateUsuario.validateUsuario(caso.directorACargo.nombre) : null;
                        const abogadoDocId = caso.abogadoACargo?.nombre ? await validateUsuario.validateUsuario(caso.abogadoACargo.nombre) : null;
                        const abogadoInternoDocId = caso.abogadoInternoDeLaCompania?.nombre ? await validateUsuario.validateUsuario(caso.abogadoInternoDeLaCompania.nombre) : null;
                        const siniestroDocId = caso.siniestro?.numero ? await validateSiniestro.validationSiniestro(caso.siniestro.numero) : null;
                        const juzgadoIntDocId = caso.juzgadoInt?.nombre ? await validateJuzgado.validationJuzgado(caso.juzgadoInt.nombre) : null;
                        const cliente2DocInt = caso.cliente2?.nombre ? await validateUsuario.validateUsuario(caso.cliente2.nombre) : null;
                        const abogadoIntern2DocInd = caso.abogadoInternoDeLaCompania2?.nombre ? await validateUsuario.validateUsuario(caso.abogadoInternoDeLaCompania2.nombre) : null;
                        const siniestro2DocId = caso.siniestro2?.numero ? await validateSiniestro.validationSiniestro(caso.siniestro2.numero) : null;
                        const juzgadoDocId = caso.juzgado?.nombre ? await validateJuzgado.validationJuzgado(caso.juzgado.nombre) : null;

                        // Limpiar valores monetarios y otros valores opcionales
                        const honorariosAsignados = limpiarValorMonetario(caso.honorariosAsignados) || null;
                       
                       // const honorariosAsignados2 = limpiarValorMonetario(caso.honorariosAsignados2) || null;
                        //const valorPagado = limpiarValorMonetario(caso.valorPagado) || null;



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
                            siniestro2: siniestro2DocId,
                            honorariosAsignados,
                        })

                        const casoGuardado = await nuevoCaso.save()
                        console.log('casoInsertado', casoGuardado._id)

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
    eliminar: async (req, res) => {
        try {
            const { id } = req.params
            const casoEliminado = await Caso.findByIdAndDelete(id)
            if (!casoEliminado) return res.status(404).json({ message: 'Caso no encontrado' })
            res.json({ message: 'Caso eliminado exitosamente' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    eliminarTodos: async (req, res) => {
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
        const caso = {
            numero: '1234567890',
            codigo: '567890123456789012345',
            titulo: 'DEF456 - MARIA GARCIA',
            cliente: { nombre: 'Bancolombia' }, // ObjectId de Cliente
            asunto: 'Demanda por Incumplimiento de Contrato',
            creacion: new Date('2023-06-20T10:15:00Z'),
            ubicacionDelExpediente: 'CT 1905',
            codigoInterno: 'CIVIL',
            area: 'CIVIL',
            fechaDeAsignacion: new Date('2023-08-10'),
            centroDeTrabajo: 'MEDELLÍN',
            directorACargo: { nombre: 'NORIS COLÓN' }, // ObjectId de Usuario
            abogadoACargo: { nombre: 'MELODY JOHNNYS' }, // ObjectId de Usuario
            abogadoInternoDeLaCompania: { nombre: 'ANDREA OTALORA' }, // ObjectId de Usuario
            siniestro: { numero: '15630077495' }, // ObjectId de Siniestro
            fechaSiniestro: new Date('2021-12-06'),
            poliza: '1563236627001',
            ramo: 'AUTOMOVILES',
            amparo: 'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL',
            numeroAplicativo: '123',
            ciudad: 'MARIA LA BAJA',
            juzgadoInt: { nombre: 'FISCALIA 61 LOCLA DE MARIA LA BAJA' }, // ObjectId de Juzgado
            radicado: 'RAD1234567890',
            parteActiva: 'MARIA GARCIA',
            partePasiva: 'PEDRO LOPEZ Y OTROS',
            tipoDeTramite: 'DEMANDA',
            claseDeProceso: 'PROCESO ORDINARIO',
            tipoDeVinculacionCliente: 'DIRECTO',
            pretensionesEnDinero: 1000000000,
            calificacionInicialContingencia: 'POSIBLE',
            calificacionActualContingencia: 'PROBABLE',
            motivoDeLaCalificacion: 'Evidencia clara de incumplimiento contractual.',
            fechaAdmisionVinculacion: new Date('2023-06-20'),
            fechaDeNotificacion: new Date('2023-06-25'),
            instancia: 'PRIMERA INSTANCIA',
            etapaProcesal: 'AUDIENCIA DE CONCILIACIÓN',
            claseDeMedidaCautelar: 'EMBARGO PREVENTIVO',
            honorariosAsignados: 50000000,
            autoridadDeConocimiento: 'JUZGADO 10 CIVIL DEL CIRCUITO',
            delito: 'INCUMPLIMIENTO DE CONTRATO',
            placa: 'DEF456',
            evento: 'L1',
            probabilidadDeExito: 'ALTA',
            valorIndemnizadoCliente: 500000000,
            entidadAfectada: 'N/A',
            fechaDePagoCliente: new Date('2023-06-30'),
            tipoContragarantia: 'FIDEICOMISO',
            montoDeProvision: 100000000,
            tipoDeMoneda: 'Peso',
            fechaDeTerminacion: new Date('2024-01-01'),
            motivoDeTerminacion: 'ACUERDO JUDICIAL',
            cliente2: '64d2b8f2f0e7e13dca0a1e8f', // ObjectId de Cliente
            fechaDeAsignacion2: new Date('2023-06-20'),
            abogadoInternoDeLaCompania2: '64d2b8f2f0e7e13dca0a1e92', // ObjectId de Usuario
            siniestro2: '64d2b8f2f0e7e13dca0a1e93', // ObjectId de Siniestro
            numeroDeAplicativo2: 'N/A',
            fechaDeNotificacion2: new Date('2023-06-20'),
            seInicioEjecutivoAContinuacionDeOrdinario: false,
            honorariosAsignados2: 50000000,
            valorPagado: 500000000,
            personaQueRealizoElPago: 'MARIA GARCIA',
            fechaDeRadicacionDeLaContestacion: new Date('2023-07-01'),
            fechaDeRadicacionDeLaContestacion2: new Date('2023-07-01'),
            departamento: 'ANTIOQUIA',
            asegurado: 'MARIA GARCIA',
            jurisdiccion: 'Civil',
            materia: 'PASIVO',
            detalleDeMateria: 'JUZGADO CIVIL',
            estado: 'En proceso',
            estadoInterno: 'Activo',
            juzgado: { nombre: '64d2b8f2f0e7e13dca0a1e94' }, // ObjectId de Juzgado
            moneda: 'Peso',
            cuantia: 1000000000,
            contingenciaReal: 800000000,
            provision: 100000000,
            condenaArreglo: 200000000,
            totalComisiones: 50000000,
            totalRecaudacion: 25000000,
            totalGastos: 75000000,
            fechaInicio: new Date('2023-06-20'),
            fechaTermino: new Date('2024-01-01'),
            flujoDeTrabajo: 'NORMAL',
            etapaDeFlujo: 'CONCILIACIÓN',
            primeraParteActiva: 'N/A',
            primeraPartePasiva: 'N/A',
            usuariosInvolucrados: '64d2b8f2f0e7e13dca0a1e91,64d2b8f2f0e7e13dca0a1e90,64d2b8f2f0e7e13dca0a1e92,64d2b8f2f0e7e13dca0a1e8f', // ObjectId de Usuario
            ultimaTareaFinalizada: 'ANÁLISIS DE CONTRATO (Aprobado por JULIA FERNANDEZ)',
            fechaUltimaActuacion: new Date('2024-06-20'),
            tituloUltimaActuacion: 'INSTRUCCIÓN PARA ACUERDO - DOCTOR MARCOS DIAZ',
            fechaUltimoCambioDeEstado: new Date('2024-01-20T03:00:00Z'),
            usuarioCreador: '64d2b8f2f0e7e13dca0a1e90', // ObjectId de Usuario
            notificado: 'true',
            cartera: 'Activa',
            numeroCredencial: '987654321',
            usuarioCredencial: 'MARIA GARCIA',
            rutCredencial: '123456789-0'
        }
        try {
            const { id } = req.params
            const casoActualizado = await Caso.findByIdAndUpdate(id, caso/*req.body*/, { new: true })
            if (!casoActualizado) return res.status(404).json({ message: 'Caso no encontrado' })
            res.json(casoActualizado)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}
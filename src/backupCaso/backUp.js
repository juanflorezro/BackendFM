//recuersos para el backup
const { google } = require('googleapis');
const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');
const express = require('express');
const Caso = require('../models/caso');
const { CLAVEAPIDRIVE } = require('../const/globalConst');
const notificarBackup = require('../notifications/notification');


//autenticacion a api drive 
// Cargar las credenciales de la cuenta de servicio desde el archivo JSON
const credentials = JSON.parse(CLAVEAPIDRIVE) // Ruta a tu archivo JSON

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

// Crear el cliente de Drive
const drive = google.drive({ version: 'v3', auth });

async function CreateBackUp(res) {
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




        // Generar el archivo Excel usando ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Procesos');
        const headers = [
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
        ]
        const keys = [
            "numero",
            "codigo",
            "titulo",
            "cliente",
            "asunto",
            "area",
            "fechaDeAsignacion",
            "centroDeTrabajo",
            "directorACargo",
            "abogadoACargo",
            "abogadoInternoDeLaCompania",
            "siniestro",
            "fechaSiniestro",
            "poliza",
            "ramo",
            "amparo",
            "numeroAplicativo",
            "ciudad",
            "juzgadoInt",
            "radicado",
            "parteActiva",
            "partePasiva",
            "tipoDeTramite",
            "claseDeProceso",
            "tipoDeVinculacionCliente",
            "pretensionesEnDinero",
            "calificacionInicialContingencia",
            "calificacionActualContingencia",
            "motivoDeLaCalificacion",
            "fechaAdmisionVinculacion",
            "fechaDeNotificacion",
            "instancia",
            "etapaProcesal",
            "claseDeMedidaCautelar",
            "honorariosAsignados",
            "autoridadDeConocimiento",
            "delito",
            "placa",
            "evento",
            "probabilidadDeExito",
            "valorIndemnizadoCliente",
            "entidadAfectada",
            "fechaDePagoCliente",
            "tipoContragarantia",
            "montoDeProvision",
            "tipoDeMoneda",
            "fechaDeTerminacion",
            "motivoDeTerminacion",
            "cliente2",
            "fechaDeAsignacion2",
            "abogadoInternoDeLaCompania2",
            "siniestro2",
            "numeroDeAplicativo2",
            "fechaDeNotificacion2",
            "seInicioEjecutivoAContinuacionDeOrdinario",
            "honorariosAsignados2",
            "valorPagado",
            "personaQueRealizoElPago",
            "fechaDeRadicacionDeLaContestacion",
            "fechaDeRadicacionDeLaContestacion2",
            "departamento",
            "asegurado",
            "jurisdiccion",
            "juzgado",
            "fechaUltimaActuacion",
            "tituloUltimaActuacion",
            "fechaQueRealizoElPago",
            "codigoInterno"
          ];
          
        const headerRow = worksheet.addRow(headers)  // Añadir fila de encabezados al Excel
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF007BFF' } 
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }, // Color blanco
                size: 12,
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.value = cell.value.toString().toUpperCase(); // Convertir a mayúsculas
        });
        casos.forEach((row) => {
            // Crear un objeto que solo contiene los campos seleccionados sin el _id
            const rowData = keys.map(key => {
                // Verificar si el valor es un objeto y extraer el nombre si aplica
                const value = row[key];
                if (typeof value === 'object' && value !== null) {
                    if (key === 'cliente' || key === 'cliente2' || key === 'directorACargo' || key === 'abogadoACargo' || key === 'abogadoInternoDeLaCompania' || key === 'abogadoInternoDeLaCompania2' || key === 'juzgado' || key === 'juzgadoInt') {
                        return value.nombre || '';
                    }
                    if (key === 'siniestro' || key === 'siniestro2') {
                        return value.numero || '';
                    }
                }
                return value !== undefined ? value : '';
            });
            worksheet.addRow(rowData);
        })
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellValueLength = cell.value ? cell.value.toString().length + 4 : 0;
                maxLength = Math.max(maxLength, cellValueLength);
            });
            column.width = maxLength + 2; // Añadir un margen de espacio
        });

        // Guardar el archivo Excel en el disco temporalmente
        const tempFilePath = path.join(__dirname, 'backup.xlsx');
        await workbook.xlsx.writeFile(tempFilePath);

        // Subir el archivo Excel a Google Drive
        const fileMetadata = {
            name: 'backup.xlsx',
            parents: ['1DtQfCL6DBB9lyYaLweyPuYi-xrahdWzd'],  // Coloca el ID de la carpeta de destino en Google Drive
        };
        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: fs.createReadStream(tempFilePath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Eliminar el archivo temporal
        fs.unlinkSync(tempFilePath);
        notificarBackup('juridicaribesoftware@gmail.com')
        if(res){
            res.send(`Backup creado y subido a Google Drive con el ID: ${response.data.id}`);
        }
        
    } catch (error) {
        console.error('Error al crear el backup:', error);
        res.status(500).send('Error al crear el backup');
    }
}

module.exports = CreateBackUp
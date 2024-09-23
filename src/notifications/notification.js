const { GMAIL_ACCOUNT } = require('../const/globalConst')
const transporter = require('./transporte')

function obtenerFechaColombia() {
    const fecha = new Date();
    const opciones = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/Bogota', // Zona horaria de Colombia
      timeZoneName: 'short', // Muestra la zona horaria (opcional)
    };
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
}

async function notificar(to, html, subject) {
    const retorno = await transporter.sendMail({
        from: GMAIL_ACCOUNT,
        to: to,
        subject: subject,
        html: html
    })
    console.log(retorno)
}
async function notificarBackup(to, fecha = obtenerFechaColombia()) {
    
    const htmlTarea = `
    <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación de Respaldo - Judisoftware</title>
            <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                background-color: #f0f2f5;
                margin: 0;
                padding: 0;
            }
            .email-container {
                background-color: #ffffff;
                margin: 40px auto;
                padding: 0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                color: #333;
            }
            .header {
                background-color: #282c34;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
                color: #61dafb;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            .content {
                padding: 40px 20px;
                text-align: center;
            }
            .content h2 {
                font-size: 22px;
                margin-bottom: 20px;
                color: #333;
            }
            .content p {
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 20px;
                color: #555;
            }
            .button {
                display: inline-block;
                text-decoration: none;
                padding: 12px 25px;
                background-color: #61dafb;
                color: #ffffff;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
            .button:hover {
                background-color: #21a1f1;
            }
            .divider {
                border-top: 1px solid #eeeeee;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 0 0 8px 8px;
                font-size: 12px;
                color: #777;
            }
            .footer p {
                margin: 5px 0;
            }
            @media screen and (max-width: 600px) {
                .email-container {
                width: 90%;
                }
                .content {
                padding: 20px;
                }
            }
            </style>
        </head>
        <body>
            <div class="email-container">
            <div class="header">
                <h1>Judisoftware</h1>
            </div>
            <div class="content">
                <h2>¡Respaldo completado con éxito!</h2>
                <p>Estimado usuario,</p>
                <p>Te informamos que se ha realizado un respaldo exitoso de tus datos en el sistema Judisoftware.</p>
                <p><strong>Fecha del respaldo:</strong> ${fecha}</p>
                <p>Es importante mantener tus datos seguros, y este respaldo automático es parte de nuestro compromiso para proteger tu información.</p>
                <a href="https://drive.google.com/drive/folders/1DtQfCL6DBB9lyYaLweyPuYi-xrahdWzd" class="button">Ver Detalles del Respaldo</a>
                <div class="divider"></div>
                <p>Para más información, accede a tu cuenta de Judisoftware y revisa la sección de respaldos.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Judisoftware, Inc. Todos los derechos reservados.</p>
                <p><a href="#" style="color: #3b5998; text-decoration: none;">Más Información</a> | <a href="#" style="color: #3b5998; text-decoration: none;">Políticas de Privacidad</a></p>
            </div>  
            </div>
        </body>
        </html>
            `;
    notificar(to, htmlTarea, 'BACKUP JUDISOFTWARE');
  }
  


module.exports = notificarBackup

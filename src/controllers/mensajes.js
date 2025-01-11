
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      
      user: "contacto@raftingmaipoexpediciones.cl",
      pass: process.env.TOKEN_MAIL,
    },
  });

var controller = {

    async sendMessage(req, res) {
        console.log(req.body)
        console.log(req.body.email)
       
        try {

            await transporter.sendMail({
                from: 'contacto@raftingmaipoexpediciones.cl',
                to: "contacto@raftingmaipoexpediciones.cl",
                subject: `Mensaje recibido a través del sitio web`,
                html: `
                    <h1>Has recibido un nuevo mensaje</h1>
                    <p><strong>Nombre:</strong> ${req.body.name}</p>
                    <p><strong>Email:</strong> ${req.body.email}</p>
                    <p><strong>Asunto:</strong> ${req.body.subject}</p>
                    <p><strong>Mensaje:</strong> ${req.body.message}</p>
                `,
            });


            res.status(200).send('Mensaje recibido');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al enviar el mensaje');
        }
    },

    
    async sendMessageVenta(datoscliente) {
        const { nombre, direccion, diaVisita, contacto, entradas, horaVisita, mail, tipoReserva } = datoscliente;
        
        let reservaTipo = tipoReserva;  // Se debe usar let aquí también
        let precioEntrada = 32000; // Establecemos un valor inicial para el precio
    
        if (reservaTipo === "1") {
            precioEntrada = 30000; // Precio para data-type 1
        } else if (reservaTipo === "2") {
            precioEntrada = 35000; // Precio para data-type 2
        } else if (reservaTipo === "3") {
            precioEntrada = 45000; // Precio para data-type 3
        }
    
        let total = precioEntrada * entradas;
        // Aquí puedes seguir con el resto de la lógica que necesites (por ejemplo, enviar el correo)
    
    
        //let descuento = 0;
    
        // Aplicar descuento del 10% si hay 4 o más entradas
       //  if (entradas >= 4) {
        //     descuento = total * 0.10;
        //     total -= descuento;
      //   }
    
        try {
            await transporter.sendMail({
                from: 'contacto@raftingmaipoexpediciones.cl',
                to: mail,
                subject: "Confirmación de Reserva - Detalles de su compra",
                html: `
                    <h2>Detalles de la Reserva</h2>
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Día de la Visita:</strong> ${diaVisita}</p>
                    <p><strong>Hora de la Visita:</strong> ${horaVisita}</p>
                    <p><strong>Contacto:</strong> ${contacto}</p>
                    <p><strong>Cantidad de Entradas:</strong> ${entradas}</p>
                    <p><strong>Precio por Entrada:</strong> $32.000</p>
                  
                    <p><strong>Total a Pagar:</strong> $${total.toLocaleString()}</p>
                    <br/>
                    <p>Gracias por su compra, nos vemos el día de su visita!</p>
                `
            });
            await transporter.sendMail({
                from: 'contacto@raftingmaipoexpediciones.cl',
                to: 'contacto@raftingmaipoexpediciones.cl',
                subject: "Confirmación de Reserva - Detalles de reserva",
                html: `
                    <h2>Detalles de la Reserva</h2>
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Dirección:</strong> ${direccion}</p>
                    <p><strong>Día de la Visita:</strong> ${diaVisita}</p>
                    <p><strong>Hora de la Visita:</strong> ${horaVisita}</p>
                    <p><strong>Contacto:</strong> ${contacto}</p>
                    <p><strong>Cantidad de Entradas:</strong> ${entradas}</p>
                    <p><strong>Precio por Entrada:</strong> $32.000</p>
                    
                    <p><strong>Total a Pagar:</strong> $${total.toLocaleString()}</p>
                    <br/>
                `
            });
        } catch (error) {
            console.error(error);
            return 'Error al enviar el mensaje';
        }
    }
};

module.exports = controller;


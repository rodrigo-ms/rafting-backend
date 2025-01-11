require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const axios = require('axios');
const reservaController = require('../controllers/reservas')
const mensajesController = require('../controllers/mensajes')
const agendaController = require('../controllers/agendas')

let datosCliente  
var controller = {
    async createOrder(req, res) {
        try {
            const client = new MercadoPagoConfig({
                accessToken: process.env.TOKEN_VENDEDOR,
                option: { timeout: 5000 }
            });
    
            const preference = new Preference(client);
    
            const { entradas,tipoReserva } = req.body; // Recibir la cantidad de entradas desde el body de la solicitud
            datosCliente = req.body;
            let unit_price, quantity,reservaTipo;
            quantity = parseInt(entradas, 10);
            reservaTipo=tipoReserva
            unit_price=32000
            if (reservaTipo === "1") {
                unit_price= 30000; // Precio para data-type 1
            } else if (reservaTipo=== "2") {
                unit_price = 35000; // Precio para data-type 2
            } else if (reservaTipo === "3") {
                unit_price = 45000; // Precio para data-type 3
            } else {
                precioPorEntrada = 50000; // Valor por defecto si no coincide con ningún data-type
            }
          
            const result = await preference.create({
                body: {
                    
                    items: [
                        {
                            id: "1",
                            title: "Entradas Rafting",
                            quantity: quantity,
                            unit_price: unit_price,
                        }
                    ],
                    back_urls: {
                        success: "https://www.raftingmaipoexpediciones.cl/success",
                        failure: "https://www.raftingmaipoexpediciones.cl/failure",
                        pending: "https://www.raftingmaipoexpediciones.cl"
                    },
                    notification_url: "https://us-central1-rafting-maipo-8cce1.cloudfunctions.net/api/webhook",
                    auto_return: "approved",
                }
            });
    
            
            res.json({ init_point: result.init_point });
        } catch (error) {
            console.error("Error al crear la orden:", error);
            res.status(500).send("Error al crear la orden");
        }
    },
    
  
async receiveWebhook(req, res) {
    console.log("webhook activado");

    const { data } = req.body;
    if (data && data.id) {
        try {
            // Consultar el estado del pago usando el ID
            const paymentResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN_VENDEDOR}`
                }
            });

            const paymentData = paymentResponse.data;

            // Verificar si el pago está aprobado
            if (paymentData.status === "approved") {
                console.log("Pago aprobado, guardando reserva...");

                // Llamar a la función reservar y manejar la respuesta
                const reservaResultado = await reservaController.reservar(datosCliente);
                await mensajesController.sendMessageVenta(datosCliente);
                await agendaController.addAgenda(datosCliente);
                if (reservaResultado.success) {
                    return res.status(200).send(reservaResultado.message);
                } else {
                    return res.status(400).send(reservaResultado.message);
                }
            } else {
                console.log("Pago no aprobado, estado:", paymentData.status);
                return res.status(400).json({ message: 'Pago no aprobado' });
            }
        } catch (error) {
            console.error("Error al verificar el pago:", error);
            return res.status(500).json({ message: 'Error al verificar el pago' });
        }
    }

    return res.status(400).json({ message: 'Datos inválidos en el webhook' });
},

};

module.exports = controller;

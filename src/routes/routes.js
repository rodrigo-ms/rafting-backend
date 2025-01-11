const express = require('express');
require('dotenv').config();
const router = express.Router();

const mensajeController = require('../controllers/mensajes')
const reservaController = require('../controllers/reservas')
const pagoController = require('../controllers/pago')
const agendaController = require('../controllers/agendas')



//test
router.get('/hola',(req,res)=>res.send('hola'));

//servicio de Mensaje 
router.post('/mensaje',mensajeController.sendMessage);

//servicio de reserva 
router.get('/getHoras',reservaController.getHoras);


//servicio de pago

router.post('/create-order',pagoController.createOrder);
router.post('/success',(req,res)=>res.send('creando orden'));
router.post('/webhook',pagoController.receiveWebhook);

//servicio de administracion de agendas
router.get('/getAgendas',agendaController.getAgendas);
//router.post('/postAgenda',agendaController.addAgenda);



module.exports = router;
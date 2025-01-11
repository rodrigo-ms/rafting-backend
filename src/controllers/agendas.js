const { db } = require('../firebase');


var controller = {
   
    async getAgendas(req, res) {
        try {
            // Consultar todas las agendas en la colección "agendas"
            const agendasSnapshot = await db.collection('agendas').get();
            
            // Extraer los datos de los documentos y almacenarlos en un arreglo
            const todasLasAgendas = agendasSnapshot.docs.map(doc => doc.data());
    
            // Hacer un console.log de las agendas encontradas
            console.log('Agendas encontradas:', todasLasAgendas);
    
            // Retornar el arreglo de agendas encontradas como respuesta
            res.status(200).json(todasLasAgendas);
        } catch (error) {
            console.error('Error al obtener las agendas:', error);
            res.status(500).send('Error al obtener las agendas');
        }
    },
    async addAgenda(datosCliente) {
        try {
            // Extraer los datos del cliente desde el cuerpo de la solicitud
            const { nombre, direccion, diaVisita, contacto, entradas, horaVisita, mail,tipoReserva  } = datosCliente;
    
            // Validar que todos los datos requeridos están presentes
            if (!nombre || !direccion || !diaVisita || !contacto || !entradas || !horaVisita || !mail) {
                return res.status(400).send('Todos los campos son obligatorios');
            }
    
            // Crear el nuevo registro en el formato requerido
            const nuevoRegistro = {
                "N entradas": entradas, // Número de entradas
                contacto: parseInt(contacto), // Número de contacto
                direccion, // Dirección
                dia: diaVisita, // Día de la visita
                hora: horaVisita, // Hora de la visita
                mail, // Email del cliente
                nombre, // Nombre del cliente
                servicio: "rafting", // Servicio
                "Tipo de reserva":tipoReserva 
            };
    
            // Agregar el registro a la colección "agendas"
            const agendaRef = await db.collection('agendas').add(nuevoRegistro);
    
            // Responder con el ID del nuevo documento
            res.status(201).json({
                message: 'Agenda creada exitosamente',
                id: agendaRef.id,
            });
        } catch (error) {
            console.error('Error al agregar una nueva agenda:', error);
            res.status(500).send('Error al agregar la agenda');
        }
    }
    
    
    




   



};

module.exports = controller;

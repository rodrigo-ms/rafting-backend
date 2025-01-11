const { db } = require('../firebase');


var controller = {
    async reservar(datosCliente, res) {
        try {
            const {  diaVisita, entradas, horaVisita} = datosCliente;
    
            // Consultar todas las horas disponibles
            const horasSnapshot = await db.collection('horas').get();
            const registroHoras = horasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Incluye el ID del documento
    
            // Verificar si ya existe un registro para el día de visita
            const registroDia = registroHoras.find(registro => registro[diaVisita]);
    
            if (registroDia) {
                // Si existe el registro para el día, verificar la hora
                const horasDisponibles = registroDia[diaVisita];
                if (horasDisponibles[horaVisita] >= entradas) {
                    // Restar las entradas
                    horasDisponibles[horaVisita] -= entradas;
    
                    // Actualizar el registro en la base de datos usando el ID del documento
                    await db.collection('horas').doc(registroDia.id).update({ [diaVisita]: horasDisponibles });
    
                    return { success: true, message: 'Reserva recibida correctamente' };
                } else {
                    return { success: false, message: 'No hay suficientes entradas disponibles para la hora seleccionada' };
                }
            } else {
                // Si no existe el registro, crear uno nuevo
                const nuevoRegistro = {
                    [diaVisita]: {
                        '12:00 PM': 23,
                        '10:00 AM': 23,
                        '15:00 PM': 23,
                        // Agrega otras horas según sea necesario
                    }
                };
                // Restar las entradas de la hora seleccionada
                nuevoRegistro[diaVisita][horaVisita] -= entradas;
    
                // Agregar el nuevo registro a la base de datos
                await db.collection('horas').add(nuevoRegistro);
    
                return { success: true, message: 'Reserva recibida correctamente, se creó un nuevo registro' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al realizar la reserva' };
        }
    },
    



    
    async getHoras(req, res) {
        try {
            // Obtener el parámetro de la fecha desde la query string
            const { fecha } = req.query;
            // Consultar todas las horas disponibles
            const horasSnapshot = await db.collection('horas').get();
            // Extraer los datos de los documentos
            const registroHoras = horasSnapshot.docs.map(doc => doc.data());
    
            // Hacer un console.log de la fecha recibida
            console.log('Fecha recibida para verificar horas:', fecha);
    
            // Buscar el registro correspondiente a la fecha
            const registroHoraEncontrada = registroHoras.find(registro => {
                const fechaRegistro = Object.keys(registro)[0]; // Obtener la fecha del objeto
                return fechaRegistro === fecha; // Comparar con la fecha recibida
            });
    
            if (registroHoraEncontrada) {
                // Si se encuentra un registro con la fecha, devolverlo
                res.status(200).json(registroHoraEncontrada);
            } else {
                // Si no se encuentra, devolver un objeto con la fecha y las horas predeterminadas
                const horasDefault = { '12:00 PM': 23, '15:00 PM': 23, '10:00 AM': 23 };
                res.status(200).json({ [fecha]: horasDefault });
            }
    
        } catch (error) {
            console.error('Error al obtener las horas:', error);
            res.status(500).send('Error al obtener las horas');
        }
    }
    
    




   



};

module.exports = controller;

const express = require('express');
var bodyParser = require('body-parser');
//ejecutar express (http)
const app = express();

// cargar ficheros rutas
var routes=require('./routes/routes');

//middLewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//cors
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            
            "script-src": ["'self'", "'unsafe-inline'", "https://www.mercadopago.cl", "*.mlstatic.com"]
        }
    }
}));
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//añadir prefijos a rutas

app.use(routes);

module.exports = app;

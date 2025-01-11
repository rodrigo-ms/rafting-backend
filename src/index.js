const app = require('./app');
const functions = require("firebase-functions");
var port = 3000;

//crear el servidor para escuchar peticiones http
app.listen(port,()=>{
    console.log('servidor corriendo en http://localhost:'+port);
})
exports.api=functions.https.onRequest(app)

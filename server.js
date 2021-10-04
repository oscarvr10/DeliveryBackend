const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const logger = require('morgan');
const cors = require('cors');

const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');


/*
**  INICIALIZAR FIREBASE ADMIN
*/

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

/*
** RUTAS
*/
const users = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.disable('x-powered-by');


app.set('port', port);

/*
* LLAMANDO RUTAS
*/
users(app, upload);

server.listen(3000, '192.168.100.17' || 'localhost', function(){
    console.log('Node JS application in ' + port + ' port initialized....')
});


//Error Handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

//EXPONER VARIABLES A OTROS ARCHIVOS
module.exports = {
    app: app,
    server : server
};
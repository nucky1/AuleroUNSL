const express = require('express');
const app = express(); //  app es el servidor en si.
const path = require('path'); //  Modulo de node, sirve para direcciones independiente del SO.

//  CONFIGURACION
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile); //  esta es para que los archivos html sean renderizados por ejs.
app.set('views', path.join(__dirname,'views')); // __dirname da la direccion absoluta de este archivo // le digo donde esta la carpeta views
app.set('static', path.join(__dirname,'public'));
app.set('view engine', 'ejs'); // Uso motor de la vista ejs. (mete js en html con sintaxis <%= %>)

// Importa el archivo router
app.use(require("./routes/router.js")); 
app.use(require("./routes/aulas.js")); 

// abre server.
app.listen(app.get('port'), () => {
    console.log("Server on port:",app.get('port'));
});

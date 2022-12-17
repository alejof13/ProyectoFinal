'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 1024;

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://0.0.0.0:27017/ProyectoFinal',
	(err, res) => {
		if (err) {
			throw err;
		} else {
			console.log("La conexión a la base de datos está funcionando correctamente...");
			app.listen(port, function () {
				console.log("Servidor del API Rest de música escuchando en http://localhost:" + port);
			});
		}
	});
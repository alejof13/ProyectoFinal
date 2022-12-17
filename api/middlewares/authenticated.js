'use-strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function (req, res, next) {
	if(!req.headers.authorization) {
		return res.status(403).send({messaje: 'La petición no tienen la cabecera de autorización'});
	}

	// Eliminar comillas dentro del token
	var token = req.headers.authorization.replace(/['"]+/g, '');

	try {
		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment().unix()) {
			return res.status(401).send({messaje: 'El token ha expirado'});
		}
	} catch(ex) {
		return res.status(404).send({messaje: 'Token no válido'});
	}

	req.user = payload;
	next();
};
'use-strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');

function getSong(req, res) {
	var songId = req.params.id;

	Song.findById(songId).populate({
		path: 'album',
		model: 'Album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, song) => {
		if(err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if(!song) {
				res.status(404).send({message: 'La canción no existe'});
			} else {
				res.status(200).send({message: 'Canción obtenida correctamente', song});
			}
		}
	});
	/*Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if(!song) {
				res.status(404).send({message: 'La canción no existe'});
			} else {
				res.status(200).send({message: 'Canción obtenida correctamente', song});
			}
		}
	});*/
}

function getSongs(req, res) {
	var albumId = req.params.album;
	var find = null;

	if(!albumId) {
		find = Song.find({}).sort('number');
	} else {
		find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, songs) => {
		if(err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if(songs.length > 0) {
				res.status(200).send({message: 'Canciones obtenidas correctamente', songs});
			} else {
				res.status(200).send({message: 'No hay canciones'});
			}
		}
	})
}

function getAllSongs(req, res) {
	var page = (req.params.page != null ? req.params.page : 1);
	var itemsPerPage = 12;
	
	Song.find().sort('name').populate({path: 'album'}).paginate(page, itemsPerPage, (err, songs, total) => {
		if(err) {
			res.status(500).send({message: 'Error en la paginación'});
		} else {
			if(!songs) {
				res.status(404).send({message: 'No hay canciones'});
			} else {
				res.status(200).send({
					message: 'Canciones obtenidas correctamente',
					itemsPerPage,
					total_items: total,
					songs: songs
				});
			}
		}
	});
}

function saveSong(req, res) {
	var song = new Song();
	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err) {
			res.status(500).send({message: 'Error en el servidor'});
		} else {
			if(!songStored) {
				res.status(404).send({message: 'No se ha guardado la canción'});
			} else {
				res.status(200).send({message: 'Canción guardada correctamente', song: songStored});
			}
		}
	});
}

function updateSong(req, res) {
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err) {
			res.status(500).send({message: 'Error en el servidor'});
		} else {
			if(!songUpdated) {
				res.status(404).send({message: 'No se ha actualizado la canción'});
			} else {
				res.status(200).send({message: 'Canción actualizada correctamente', song: songUpdated});
			}
		}
	});
}

function deleteSong(req, res) {
	var songId = req.params.id;
	
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err) {
			res.status(500).send({message: 'Error en el servidor'});
		} else {
			if(!songRemoved) {
				res.status(404).send({message: 'No se ha borrado la canción'});
			} else {
				res.status(200).send({message: 'Canción borrada correctamente', song: songRemoved});
			}
		}
	});
}

function uploadFile(req, res) {
	var songId = req.params.id;
	var file_name = 'Archivo no cargado...';

	if(req.files) {
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];
		
		if(file_ext == 'mp3' || file_ext == 'm4a') {
			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
				if(err) {
					res.status(500).send({message:'Error al actualizar la canción'});
				} else {
					if(!songUpdated) {
						res.status(404).send({message:'No se ha podido actualizar el archivo de la canción'});
					} else {
						res.status(200).send({message:'Canción actualizada', song: songUpdated});
					}
				}
			});
		} else {
			res.status(200).send({message:'Extensión de archivo no válida'});
		}
	} else {
		res.status(200).send({message:'No has subido ningún archivo...'});
	}
}

function getSongFile(req, res) {
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;
	
	fs.open(path_file, 'r', (err, fd) => {
		if(err) {
			if (err.code === 'ENOENT') {
				res.status(200).send({message:'No existe el archivo'});
			}
		} else {
			res.sendFile(path.resolve(path_file));
		}
	});
}

module.exports = {
	getSong,
	getAllSongs,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
};
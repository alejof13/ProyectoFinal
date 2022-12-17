'use-strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');

function getAlbum(req, res) {
	var albumId = req.params.id;

	// Conseguir todos los datos del artista que creó el album
	Album.findById(albumId).populate({
		path: 'artist',
		model: 'Artist'
	}).exec((err, album) => {
		if(err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if(!album) {
				res.status(404).send({message: 'El album no existe'});
			} else {
				res.status(200).send({message: 'Album obtenido exitosamente', album});
			}
		}
	});
}

function getAlbums(req, res) {
	var artistId = req.params.artist;
	var find = null;

	if(!artistId) {
		// Sacar todos los albumes de la base de datos
		find = Album.find({}).sort('title');
	} else {
		// Sacar los albumes de un artista concreto de la base de datos
		find = Album.find({artist: artistId}).sort('year');
	}

	// Obtener los datos del artista vinculado al album
	find.populate({path: 'artist'}).exec((err, albums) => {
		if(err) {
			res.status(500).send({message: 'Error al obtener los albumes'});
		} else {
			if(!albums) {
				res.status(404).send({message: 'No hay albums'});
			} else {
				if(albums.length > 0) {
					res.status(200).send({message: 'Albumes obtenidos correctamente', albums});
				} else {
					res.status(200).send({message: 'No hay albums'});
				}
			}
		}
	});
}

function getAllAlbums(req, res) {
	var page = (req.params.page != null ? req.params.page : 1);
	var itemsPerPage = 12;
	
	Album.find().sort('title').populate({path: 'artist'}).paginate(page, itemsPerPage, (err, albums, total) => {
		if(err) {
			res.status(500).send({message: 'Error en la paginación'});
		} else {
			if(!albums) {
				res.status(404).send({message: 'No hay álbums'});
			} else {
				res.status(200).send({
					message: 'Álbumes obtenidos correctamente',
					itemsPerPage,
					total_items: total,
					albums: albums
				});
			}
		}
	});
}

function saveAlbum(req, res) {
	var album = new Album();

	var params  = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = "5HifqDvtIu6Z6GXmzoMxq-X0.jpg";
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err) {
			res.status(500).send({message: 'Error al guardar el album'});
		} else {
			if(!albumStored) {
				res.status(404).send({message: 'No se ha guardado el album'});
			} else {
				res.status(200).send({message: 'Album guardado exitosamente', album: albumStored});
			}
		}
	});
}

function updateAlbum(req, res) {
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err) {
			res.status(500).send({message: 'Error al actulizar el album'});
		} else {
			if(!albumUpdated) {
				res.status(404).send({message: 'El album no existe'});
			} else {
				res.status(200).send({message: 'Album actualizado correctamente', album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res) {
	var albumId = req.params.id;

	// Eliminar los álbumes del artista
	Album.findByIdAndDelete(albumId, (err, albumRemoved) => {
		if(err) {
			res.status(500).send({message: 'Error, no se ha borrado el album'});
		} else {
			if(!albumRemoved) {
				res.status(404).send({message: 'Error, el album no existe'});
			} else {
				// Eliminar canciones relacionadas a los álbumes
				Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
					if(err) {
						res.status(500).send({message: 'Error, canción no eliminada'});
					} else {
						if(!songRemoved) {
							res.status(404).send({message: 'Error, la canción no existe'});
						} else {
							res.status(200).send({message: 'Album eliminado correctamente', album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var albumId = req.params.id;
	var file_name = 'Imagen no cargada...';

	if(req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];
		
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
				if(err) {
					res.status(500).send({message:'Error al actualizar el album'});
				} else {
					if(!albumUpdated) {
						res.status(404).send({message:'No se ha podido actualizar la imagen del album'});
					} else {
						res.status(200).send({message:'Album actualizado', album: albumUpdated});
					}
				}
			});
		} else {
			res.status(200).send({message:'Extensión de archivo no válida'});
		}
	} else {
		res.status(200).send({message:'No has subido ninguna imagen...'});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile;
	
	fs.open(path_file, 'r', (err, fd) => {
		if(err) {
			if (err.code === 'ENOENT') {
				res.status(200).send({message:'No existe la imagen'});
			}
		} else {
			res.sendFile(path.resolve(path_file));
		}
	});
}

module.exports = {
	getAlbum,
	getAlbums,
	getAllAlbums,
	saveAlbum,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
};
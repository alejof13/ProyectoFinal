'use-strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if(err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if(!artist) {
				res.status(404).send({message: 'El artista no existe'});
			} else {
				res.status(200).send({message: 'Artista obtenido exitosamente', artist});
			}
		}
	});
}

function saveArtist(req, res) {
	var artist = new Artist();

	var params  =req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = "ZXS4rpYwyxmhNn4CqD3bJxXD.jpg";

	artist.save((err, artistStore) => {
		if(err) {
			res.status(500).send({message: 'Error al guardar el mensaje'});
		} else {
			if(!artistStore) {
				res.status(404).send({message: 'El artista no ha sido guardado'});
			} else {
				res.status(200).send({message: 'Artista guardado exitosamente', artist: artistStore});
			}
		}
	});
}

function getArtists(req, res) {
	var page = (req.params.page != null ? req.params.page : 1);
	var itemsPerPage = 12;
	
	Artist.find().sort('name').paginate(page, itemsPerPage, (err, artist, total) => {
		if(err) {
			res.status(500).send({message: 'Error en la paginación'});
		} else {
			if(!artist) {
				res.status(404).send({message: 'No hay artistas'});
			} else {
				res.status(200).send({
					message: 'Artistas obtenidos correctamente',
					itemsPerPage,
					total_items: total,
					artists: artist
				});
			}
		}
	});
}

function updateArtist(req, res) {
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err) {
			res.status(500).send({message: 'Error al guardar los cambios del artista'});
		} else {
			if(!artistUpdated) {
				res.status(404).send({message: 'El artista no existe'});
			} else {
				res.status(200).send({message: 'Artista actualizado correctamente', artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res) {
	// Eliminar el artista
	var artistId = req.params.id;
	
	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err) {
			res.status(500).send({message: 'Error, no se ha borrado el artista'});
		} else {
			if(!artistRemoved) {
				res.status(404).send({message: 'Error, el artista no existe'});
			} else {
				// Eliminar los álbumes del artista
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
										res.status(200).send({message: 'Artista eliminado correctamente', artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var artistId = req.params.id;
	var file_name = 'Imagen no cargada...';

	if(req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];
		
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if(err) {
					res.status(500).send({message:'Error al actualizar el artista'});
				} else {
					if(!artistUpdated) {
						res.status(404).send({message:'No se ha podido actualizar la imagen del artista'});
					} else {
						res.status(200).send({message:'Artista actualizado', artist: artistUpdated});
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
	var path_file = './uploads/artists/'+imageFile;
	
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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};
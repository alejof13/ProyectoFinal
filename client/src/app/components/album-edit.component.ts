import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AuthenticationService } from '../services/authentication.service';
import { Artist } from './../models/artist';
import { Album } from './../models/album';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';

@Component({
	selector: 'album-edit',
	templateUrl: './../views/album-add.html',
	providers: [
		AuthenticationService,
		UploadService,
		UserService,
		ArtistService,
		AlbumService
	]
})

export class AlbumEditComponent implements OnInit {
	public title: string;
	public url: string;
	public artist: Artist;
	public album: Album;
	public identity: any;
	public token: string;
	public filesToUpload: Array<File>;
	public listDescription: Array<String>;
	// Variables para mensages
	public alertMessage: string;
	public typeMessage: string = "alert-danger";
	// Variables para edición
	public isEdit: boolean;
	public legendButton: string;

	public constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _authenticationService: AuthenticationService,
		private _uploadService: UploadService,
		private _userService: UserService,
		private _albumService: AlbumService
	) {
		this.title = "Editar álbum";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', '', '', '', null);
		this.isEdit = true;
		this.legendButton = "Actualizar";
		
		if(!this._authenticationService.isAdmin(this.identity)) {
			this._router.navigate(['/home']);
		}
	}

	ngOnInit(): void {
		console.log("album-edit.component cargado...");

		// Obtener el album
		this.getAlbum();
	}

	public getAlbum() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
				(res : any) => {
					if(!res.album) {
						this.alertMessage = res.message;
						this.typeMessage = "alert-danger";
						this._router.navigate(['/']);
					} else {
						this.album = res.album;
						this.artist = res.album.artist;
						this.listDescription = this.getListDescription();
					}
				},
				(err : any) => {
					var errorResult = <any>err;
					
					if(errorResult != null) {
						this.alertMessage = err.error.message;
						this.typeMessage = "alert-danger";
					}
				}
			);
		});
	}

	public getListDescription() {
		return this.artist.description.replace(" ", "").split(",");
	}

	public fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	public onSubmit() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			
			// Llamar al método de servicio
			this._albumService.editAlbum(this.token, id, this.album).subscribe(
				(res : any) => {
					if(!res.album) {
						this.alertMessage = res.message;
						this.typeMessage = "alert-danger";
					} else {
						if(!this.filesToUpload) {
							this._router.navigate(['/artist/', res.album.artist]);
						} else {
							this.alertMessage = res.message;
							this.typeMessage = "alert-info";
							this.album = res.album;
							
							// Subir la imagen del album
							this._uploadService.makeFileRequest(this.url+'/upload-image-album/'+id, [], this.filesToUpload, this.token, 'image')
							.then(
								(res : any) => {
									this._router.navigate(['/artist/', res.album.artist]);
								},
								(err : any) => {
									this.alertMessage = err;
									this.typeMessage = "alert-danger";
								}
							);
						}
					}
				},
				(err : any) => {
					var errorResult = <any>err;
					
					if(errorResult != null) {
						this.alertMessage = err.error.message;
						this.typeMessage = "alert-danger";
					}
				}
			);
		});
	}
}
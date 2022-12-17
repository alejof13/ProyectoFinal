import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { Artist } from './../models/artist';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'artist-edit',
	templateUrl: './../views/artist-add.html',
	providers: [
		AuthenticationService,
		UploadService,
		UserService,
		ArtistService
	]
})

export class ArtistEditComponent implements OnInit {
	public title: string;
	public url: string;
	public artist: Artist;
	public identity: any;
	public token: string;
	public filesToUpload: Array<File>;
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
		private _artistService: ArtistService
	) {
		this.title = "Editar artista";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.isEdit = true;
		this.legendButton = "Actualizar";
		this.artist = new Artist('', '', '', '');

		if(!this._authenticationService.isAdmin(this.identity)) {
			this._router.navigate(['/home']);
		}
	}

	ngOnInit(): void {
		console.log("artist-edit.component cargado...");
		// Llamar al método del API para sacar un artista con base en su ID getArtist
		this.getArtist();
	}

	public getArtist() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			
			this._artistService.getArtist(this.token, id).subscribe(
				(res : any ) => {
					if(!res.artist) {
						this.alertMessage = res.message;
						this.typeMessage = "alert-danger";
						this._router.navigate(['/']);
					} else {
						this.artist = res.artist;
					}
				},
				(err : any ) => {
					var errorAddArtist = <any>err;
					
					if(errorAddArtist != null) {
						this.alertMessage = err.error.message;
						this.typeMessage = "alert-danger";
					}
				}
			);
		});
	}

	public onSubmit() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			
			this._artistService.editArtist(this.token, id, this.artist).subscribe(
				(res : any) => {
					if(!res.artist) {
						this.alertMessage = res.message;
						this.typeMessage = "alert-danger";
					} else {
						if(!this.filesToUpload) {
							this._router.navigate(['/artist', res.artist._id]);
						} else {
							this.alertMessage = res.message;
							this.typeMessage = "alert-info";
							
							// Subir la imagen del artista
							this._uploadService.makeFileRequest(this.url+'/upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
							.then(
								(res : any) => {
									this._router.navigate(['/artists/', 1]);
								},
								(err : any) => {
									this.alertMessage = err.error.message;
									this.typeMessage = "alert-danger";
								}
							);
						}
					}
				},
				(err : any) => {
					var errorAddArtist = <any>err;
					
					if(errorAddArtist != null) {
						this.alertMessage = err.error.message;
						this.typeMessage = "alert-danger";
					}
				}
			);
		});
	}

	public fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}
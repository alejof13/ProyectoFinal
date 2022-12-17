import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from './../services/global';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from './../services/user.service';
import { Song } from './../models/song';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
	selector: 'song-edit',
	templateUrl: './../views/song-add.html',
	providers: [
		AuthenticationService,
		UploadService,
		UserService,
		SongService,
		AlbumService
	]
})

export class SongEditComponent implements OnInit {
	public title: string;
	public url: string;
	public identity: any;
	public song: Song;
	public album: Album;
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
		private _songService: SongService,
		private _albumService: AlbumService
	) {
		this.title = "Editar canción";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.song = new Song('', '', '', '', '', null);
		this.url = GLOBAL.url;
		this.isEdit = true;
		this.legendButton = "Actualizar";

		if(!this._authenticationService.isAdmin(this.identity)) {
			this._router.navigate(['/home']);
		}
	}

	ngOnInit(): void {
		console.log("song-edit.component cargado...");

		// Obtener canción a editar
		this.getSong();
	}

	public getSong() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._songService.getSong(this.token, id).subscribe(
				(res : any) => {
					if(!res.song) {
						this.alertMessage = res.message;
						this.typeMessage = "alert-danger";
						this._router.navigate(['/']);
					} else {
						this.song = res.song;
						
						// Setear album de la canción
						this.album = res.song.album;
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

	public onSubmit() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			// Actualizar los datos de la canción
			this._songService.editSong(this.token, id, this.song).subscribe(
				(res : any) => {
					if(!res.song) {
						this.alertMessage = res.message;
						this.typeMessage = "alert-danger";
					} else {
						this.alertMessage = res.message;
						this.typeMessage = "alert-success";
						
						if(!this.filesToUpload) {
							this._router.navigate(['/album/', res.song.album]);
						} else {
							// Subir el archivo de audio
							this._uploadService.makeFileRequest(this.url+'/upload-file-song/'+id, [], this.filesToUpload, this.token, 'file')
							.then(
								(res : any) => {
									this._router.navigate(['/album/', res.song.album]);
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
	
	public fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}
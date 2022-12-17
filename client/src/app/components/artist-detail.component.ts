import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { Artist } from './../models/artist';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { AuthenticationService } from '../services/authentication.service';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';

@Component({
	selector: 'artist-detail',
	templateUrl: './../views/artist-detail.html',
	providers: [
		AuthenticationService,
		UploadService,
		UserService,
		ArtistService,
		AlbumService
	]
})

export class ArtistDetailComponent implements OnInit {
	public title: string;
	public url: string;
	public artist: Artist;
	public albums: Album[];
	public identity: any;
	public token: string;
	public filesToUpload: Array<File>;
	public bannerArtist: any;
	public listDescription: Array<String>;
	// Variables para mensages
	public alertMessage: string;
	public typeMessage: string = "alert-danger";

	public constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _authenticationService: AuthenticationService,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService
	) {
		this.title = "Artista";
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.artist = new Artist('', '', '', '');

		if(!this._authenticationService.isLogged(this.identity)) {
			this._router.navigate(['/home']);
		}
	}

	ngOnInit(): void {
		console.log("artist-detail.component cargado...");
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
						this._router.navigate(['/']);
					} else {
						this.artist = res.artist;
						this.title = this.artist.name;

						// Añadir imagen al artist
						this.bannerArtist = document.getElementById("bannerArtist");
						this.bannerArtist.style.backgroundImage = "url(\""+this.url+"get-image-artist/"+this.artist.image+"\")";
						this.listDescription = this.getListDescription();
						
						// Obtener los albumes del artista
						this._albumService.getAlbums(this.token, res.artist._id).subscribe(
							(res : any) => {
								if(!res.albums) {
									// Artista sin albumes
									this.alertMessage = res.message;
									this.typeMessage = "alert-info";
								} else {
									// Setear albumes
									this.albums = res.albums;
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
					}
				},
				(err : any ) => {
					var errorResult = <any>err;
					
					if(errorResult != null) {
						this.alertMessage = err.error.message;
						this.typeMessage = "alert-danger";
					}
				}
			);
		});
	}

	public deleteAlbumConfirm(id: any) {
		this._albumService.deleteAlbum(this.token, id).subscribe(
			(res : any) => {
				if(!res.album) {
					this.alertMessage = res.message;
					this.typeMessage = "alert-danger";
				} else {
					this._router.navigate(['/artist']);
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
	}

	public deleteAlbumCancel() {
		console.log("Album no eliminado");
	}

	public getListDescription() {
		return this.artist.description.replace(" ", "").split(",");
	}
}
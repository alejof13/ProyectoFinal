import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { Artist } from './../models/artist';
import { ArtistService } from '../services/artist.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'artist-add',
	templateUrl: './../views/artist-add.html',
	providers: [
		AuthenticationService,
		UserService,
		ArtistService
	]
})

export class ArtistAddComponent implements OnInit {
	public title: string;
	public url: string;
	public artist: Artist;
	public identity: any;
	public token: string;
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
		private _userService: UserService,
		private _artistService: ArtistService
	) {
		this.title = "Agregar artista";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '', '');
		this.isEdit = false;
		this.legendButton = "Agregar";
		
		if(!this._authenticationService.isAdmin(this.identity)) {
			this._router.navigate(['/home']);
		}
	}

	ngOnInit(): void {
		console.log("artist-add.component cargado...");
	}

	public onSubmit() {
		this._artistService.addArtist(this.token, this.artist).subscribe(
			(res : any) => {
				if(!res.artist) {
					this.alertMessage = res.message;
					this.typeMessage = "alert-danger";
				} else {
					this.alertMessage = res.message;
					this.typeMessage = "alert-info";
					this.artist = res.artist;

					// Redireccionar a edición del artista para terminar con la imagen
					this._router.navigate(['/edit-artist', res.artist._id]);
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
	}
}
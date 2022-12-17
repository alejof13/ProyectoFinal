import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { Artist } from './../models/artist';
import { ArtistService } from '../services/artist.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'artist-list',
	templateUrl: './../views/artist-list.html',
	providers: [
		AuthenticationService,
		UserService,
		ArtistService
	]
})

export class ArtistListComponent implements OnInit {
	public title: string;
	public url: string;
	public artists: Artist[];
	public identity: any;
	public token: string;
	// Variables para mensages
	public alertMessage: string;
	public typeMessage: string = "alert-danger";
	// Paginación
	public prev_page: number;
	public next_page: number;

	public constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _authenticationService: AuthenticationService,
		private _userService: UserService,
		private _artistService: ArtistService
	) {
		this.title = "Artistas";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(): void {
		console.log("artist-list.component cargado...");

		// Obtener listado de artistas
		this.getArtists();
	}

	public getArtists() {
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page) {
				page = 1;
			} else {
				this.prev_page = ((page-1 >= 1) ? (page-1) : 1);
				this.next_page = page+1;
				
				this._artistService.getArtists(this.token, page).subscribe(
					(res : any) => {
						if(!res.artists && this._authenticationService.isUser(this.identity)) {
							this._router.navigate(['/']);
						} else {
							if(!res.artists) {
								this.alertMessage = res.message;
							} else {
								if(res.artists.length == 0) {
									this._router.navigate(['/artists/', page-1]);
								} else {
									this.artists = res.artists;
								}
							}
						}
					},
					(err : any) => {
						var errorAddArtist = <any>err;
						
						if(errorAddArtist != null) {
							this.alertMessage = err.error.message;
						}
					}
				);
			}
		});
	}
	
	public deleteArtistConfirm(id: any) {
		this._artistService.deleteArtist(this.token, id).subscribe(
			(res : any) => {
				if(!res.artist) {
					this.alertMessage = res.message;
				} else {
					this.getArtists();
				}
			},
			(err : any) => {
				var errorAddArtist = <any>err;
				
				if(errorAddArtist != null) {
					this.alertMessage = err.error.message;
				}
			}
		);
	}

	public deleteArtistCancel() {
		console.log("Artista no eliminado");
	}
}
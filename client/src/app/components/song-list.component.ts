import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { Song } from './../models/song';
import { AuthenticationService } from '../services/authentication.service';
import { SongService } from '../services/song.service';

@Component({
	selector: 'song-list',
	templateUrl: './../views/song-list.html',
	providers: [
		AuthenticationService,
		UserService,
		SongService
	]
})

export class SongListComponent implements OnInit {
	public title: string;
	public url: string;
	public songs: Song[];
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
		private _songService: SongService
	) {
		this.title = "Canciones";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}


	ngOnInit(): void {
		console.log("song-list.component cargado...");

		// Obtener listado de canciones
		this.getSongs();
	}

	public getSongs() {
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page) {
				page = 1;
			} else {
				this.prev_page = ((page-1 >= 1) ? (page-1) : 1);
				this.next_page = page+1;
				
				this._songService.getAllSongs(this.token, page).subscribe(
					(res : any) => {
						if(!res.songs && this._authenticationService.isUser(this.identity)) {
							this._router.navigate(['/']);
						} else {
							if(!res.songs) {
								this.alertMessage = res.message;
								this.typeMessage = "alert-danger";
							} else {
								if(res.songs.length == 0) {
									this._router.navigate(['/songs/', page-1]);
								} else {
									this.songs = res.songs;
								}
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
			}
		});
	}
}
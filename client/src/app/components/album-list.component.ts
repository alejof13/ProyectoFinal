import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './../services/global';
import { UserService } from './../services/user.service';
import { Album } from './../models/album';
import { AuthenticationService } from '../services/authentication.service';
import { AlbumService } from '../services/album.service';

@Component({
	selector: 'album-list',
	templateUrl: './../views/album-list.html',
	providers: [
		AuthenticationService,
		UserService,
		AlbumService
	]
})

export class AlbumListComponent implements OnInit {
	public title: string;
	public url: string;
	public albums: Album[];
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
		private _albumService: AlbumService
	) {
		this.title = "Álbumes";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(): void {
		console.log("album-list.component cargado...");

		// Obtener listado de álbumes
		this.getAlbums();
	}

	public getAlbums() {
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page) {
				page = 1;
			} else {
				this.prev_page = ((page-1 >= 1) ? (page-1) : 1);
				this.next_page = page+1;
				
				this._albumService.getAllAlbums(this.token, page).subscribe(
					(res : any) => {
						if(!res.albums && this._authenticationService.isUser(this.identity)) {
							this._router.navigate(['/']);
						} else {
							if(!res.albums) {
								this.alertMessage = res.message;
								this.typeMessage = "alert-danger";
							} else {
								if(res.albums.length == 0) {
									this._router.navigate(['/all-albums/', page-1]);
								} else {
									this.albums = res.albums;
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
	
	public deleteAlbumConfirm(id: any) {
		this._albumService.deleteAlbum(this.token, id).subscribe(
			(res : any) => {
				if(!res.artist) {
					this.alertMessage = res.message;
					this.typeMessage = "alert-danger";
				} else {
					this.getAlbums();
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
}
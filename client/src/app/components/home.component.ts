import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'home',
	templateUrl: './../views/home.html',
	providers: [
		UserService,
		AuthenticationService,
		ArtistService,
		AlbumService,
		SongService
	]
})

export class HomeComponent implements OnInit {
	public title: string;
	public artists: Artist[];
	public albums: Album[];
	public songs: Song[];
	public identity: any;
	public token: any;
	public url: any;
	// Variables para mensages
	public alertMessage: string;
	public typeMessage: string = "alert-danger";
	// Límite de elementos a mostrar, máx 12
	public page: number;
	public limitShow: number;

	public constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _authenticationService: AuthenticationService,
		private _artistService: ArtistService,
		private _albumService: AlbumService,
		private _songService: SongService
	) {
		this.title  = "Inicio";
		this.page = 1;
		this.limitShow = 8;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;

		// Verificar sesión
		if(!this._authenticationService.isLogged(this.identity)) {
			this._router.navigate(['/home']);
		}
	}

	ngOnInit() {
		console.log("home.component cargado...");
		// Cargar artistas
		this.getArtists();
	}

	public getArtists() {
		this._artistService.getArtistsHome(this.page).subscribe(
			(res : any) => {
				if(!res.artists) {
					this.alertMessage = res.message;
					this.typeMessage = "alert-danger";
				} else {
					if(res.artists.length > this.limitShow) {
						this.artists = res.artists.slice(0, this.limitShow);
					} else {
						this.artists = res.artists;
					}

					// Cargar álbumes
					this.getAlbums();
				}
			},
			(err : any) => {
				var errorResult = <any>err;
				
				if(errorResult != null) {
					this.alertMessage = err.message;
					this.typeMessage = "alert-danger";
				}
			}
		);
	}

	public getAlbums() {
		this._albumService.getAlbumsHome(this.page).subscribe(
			(res : any) => {
				if(!res.albums) {
					this.alertMessage = res.message;
					this.typeMessage = "alert-danger";
				} else {
					if(res.albums.length > this.limitShow) {
						this.albums = res.albums.slice(0, this.limitShow);
					} else {
						this.albums = res.albums;
					}

					// Cargar canciones
					this.getSongs();
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

	public getSongs() {
		this._songService.getSongsHome(this.page).subscribe(
			(res : any) => {
				if(!res.songs) {
					this.alertMessage = res.message;
					this.typeMessage = "alert-danger";
				} else {
					if(res.songs.length > this.limitShow) {
						this.songs = res.songs.slice(0, this.limitShow);
					} else {
						this.songs = res.songs;
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
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
	public url: string;

	public constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	public getAlbums(token: string, artistId: string = null) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		if(artistId == null) {
			// Obtener todos los albumes
			return this._http.get(this.url+'albums', {headers: headers})
			.pipe(map(res => res));
		} else {
			// Obtener los albumes de un artista en concreto
			return this._http.get(this.url+'albums/'+artistId, {headers: headers})
			.pipe(map(res => res));
		}
	}

	public getAllAlbums(token: string, page: number) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'/all-albums/'+page, { headers: headers })
		.pipe(map(res => res));
	}

	public addAlbum(token: string, album: Album) {
		let params = JSON.stringify(album);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.post(this.url+'album', params, {headers: headers})
		.pipe(map(res => res));
	}

	public getAlbum(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'album/'+id, {headers: headers})
		.pipe(map(res => res));
	}

	public editAlbum(token: string, id: string, album: Album) {
		let params = JSON.stringify(album);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.put(this.url+'album/'+id, params, { headers: headers })
		.pipe(map(res => res));
	}

	public deleteAlbum(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.delete(this.url+'album/'+id, {headers: headers})
		.pipe(map(res => res));
	}

	// Funciones de utilidades generales
	public getAlbumsHome(page: number) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json'
		});

		return this._http.get(this.url+'/albums-home/'+page, { headers: headers })
		.pipe(map(res => res));
	}
}
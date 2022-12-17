import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { Song } from '../models/song';

@Injectable()
export class SongService {
	public url: string;

	public constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	public addSong(token: string, song: Song) {
		let params = JSON.stringify(song);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.post(this.url+'song', params, {headers: headers})
		.pipe(map(res => res));
	}

	public getSong(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'song/'+id, {headers: headers})
		.pipe(map(res => res));
	}

	public getSongs(token: string, albumId: string = null) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		if(albumId == null) {
			// Obtener todos las canciones
			return this._http.get(this.url+'songs', {headers: headers})
			.pipe(map(res => res));
		} else {
			// Obtener los canciones de un album en concreto
			return this._http.get(this.url+'songs/'+albumId, {headers: headers})
			.pipe(map(res => res));
		}
	}

	public getAllSongs(token: string, page: number) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'/all-songs/'+page, { headers: headers })
		.pipe(map(res => res));
	}

	public deleteSong(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.delete(this.url+'song/'+id, {headers: headers})
		.pipe(map(res => res));
	}

	public editSong(token: string, id: string, song: Song) {
		let params = JSON.stringify(song);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.put(this.url+'song/'+id, params, { headers: headers })
		.pipe(map(res => res));
	}
	
	// Funciones de utilidades generales
	public getSongsHome(page: number) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json'
		});

		return this._http.get(this.url+'/songs-home/'+page, { headers: headers })
		.pipe(map(res => res));
	}
}
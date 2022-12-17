import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService {
	public url: string;

	public constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	public addArtist(token: string, artist: Artist) {
		let params = JSON.stringify(artist);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.post(this.url+'artist', params, { headers: headers })
		.pipe(map(res => res));
	}
	
	public editArtist(token: string, id: string, artist: Artist) {
		let params = JSON.stringify(artist);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.put(this.url+'artist/'+id, params, { headers: headers })
		.pipe(map(res => res));
	}

	public getArtists(token: string, page: number) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'/artists/'+page, { headers: headers })
		.pipe(map(res => res));
	}
	
	public getArtist(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.get(this.url+'/artist/'+id, { headers: headers })
		.pipe(map(res => res));
	}

	public deleteArtist(token: string, id: string) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': token
		});

		return this._http.delete(this.url+'/artist/'+id, { headers: headers })
		.pipe(map(res => res));
	}

	// Funciones de utilidades generales
	public getArtistsHome(page: number) {
		let headers = new HttpHeaders({
			'Content-Type':'application/json'
		});

		return this._http.get(this.url+'/artists-home/'+page, { headers: headers })
		.pipe(map(res => res));
	}
}	
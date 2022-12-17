import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable()
export class UserService {
	public url: string;
	public identity: any;
	public token: string;

	constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	public signup(user_to_login, gethash) {
		if(gethash != null) {
			user_to_login.gethash = gethash;
		}
		let json = JSON.stringify(user_to_login);
		let params = json;

		let headers = new HttpHeaders({'Content-Type':'application/json'});

		return this._http.post(this.url+'login', params, { headers: headers })
		.pipe(map(res => res));
	}

	public register(user_to_register) {
		let params = JSON.stringify(user_to_register);

		let headers = new HttpHeaders({'Content-Type':'application/json'});
		return this._http.post(this.url+'register', params, { headers: headers })
		.pipe(map(res => res));
	}

	public updateUser(user_to_update: User) {
		let params = JSON.stringify(user_to_update);

		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authorization': this.getToken()
		});
		return this._http.put(this.url+'update-user/'+user_to_update._id, params, { headers: headers })
		.pipe(map(res => res));
	}

	public logout() {
		sessionStorage.removeItem('identity');
		sessionStorage.removeItem('token');
		sessionStorage.clear();
	}

	public setIdentity(identity:any) {
		sessionStorage.setItem('identity', JSON.stringify(identity));
	}

	public setToken(token:string) {
		sessionStorage.setItem('token', token);
	}

	public getIdentity() {
		let identity = JSON.parse(sessionStorage.getItem('identity'));
		if(identity != "undefined") {
			this.identity = identity;
		} else {
			this.identity = null;
		}

		return  this.identity;
	}

	public getToken() {
		let token = sessionStorage.getItem('token');
		if(token != "undefined") {
			this.token = token;
		} else {
			this.token = null;
		}

		return  this.token;
	}
}	
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Artist } from '../models/artist';

@Injectable()
export class AuthenticationService {
	public isLogged(identity: any) {
		if(identity != null) {
			return true;
		} else {
			return false;
		}
	}

	public isAdmin(identity: any) {
		if(this.isLogged(identity) && identity.role == 'ROLE_ADMIN') {
			return true;
		} else {
			return false;
		}
	}

	public isUser(identity: any) {
		if(this.isLogged(identity) && identity.role == 'ROLE_USER') {
			return true;
		} else {
			return false;
		}
	}
}
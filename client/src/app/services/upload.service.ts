import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Artist } from '../models/artist';

@Injectable()
export class UploadService {
	public url: string;

	public constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	public makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
		return new Promise(function(resolve, reject) {
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			for(var i: any = 0; i < files.length; i++) {
				formData.append(name, files[i], files[i].name);
			}

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			}
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}
}
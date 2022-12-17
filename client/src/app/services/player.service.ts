import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/song';
import { GLOBAL } from './global';

@Injectable()
export class PlayerService {
	public url: string;

	private songSource = new BehaviorSubject(new Song('', '' ,'' ,'' ,'', null));
	public song = this.songSource.asObservable();

	public constructor() {
		this.url = GLOBAL.url;
	}

	public setSong(song:Song) {
		// Meter al storage
		localStorage.setItem("song", JSON.stringify(song));
		this.songSource.next(song);
	}

	public getSong():Song {
		return JSON.parse(localStorage.getItem("song"));
	}
}
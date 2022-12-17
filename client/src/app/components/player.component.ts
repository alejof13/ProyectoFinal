import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';
import { PlayerService } from '../services/player.service';

@Component({
	selector: 'player',
	templateUrl: './../views/player.html',
	providers: []
})

export class PlayerComponent implements OnInit {
	public url: string;
	public song: Song;
	public playerSongSource: any;
	public playerSongControls: any;
	public playerSongImage: any;
	public playerSongTitle: any;
	public playerSongArtist: any;
	public playerSongFile: any;
	public playerVolume: number;

	public message: string;

	public constructor(
		private _playerService: PlayerService
	) {
		this.url = GLOBAL.url;
		
		// Valores del reproductor por defecto
		this.playerSongImage = "5HifqDvtIu6Z6GXmzoMxq-X0.jpg";
		this.playerSongTitle = "Ninguna canción seleccionada";
		this.playerSongArtist = "Sin artísta";
		this.playerSongSource = null;
		this.playerSongControls = null;
		this.playerVolume = 0.6;
	}

	public ngOnInit() {
		console.log("player.component cargado...");

		this._playerService.song.subscribe((song) => {
			this.song = song;
			
			// Verificar la existencia de contenido en el stored
			this.getSongStored();
		});
	}

	public getSongStored() {
		this.song = this._playerService.getSong();
		if(this.song) {
			this.playerSongImage = this.song.album.image;
			this.playerSongTitle = this.song.name;
			this.playerSongArtist = this.song.album.artist.name;
			this.playerSongFile = this.song.file;
			this.playerSongControls = document.getElementById("player-controls");
			this.playerSongSource = document.getElementById("player-source");

			// Setear recurso
			this.setSource();
		}
	}

	public setSource() {
		this.playerSongSource.setAttribute('src', this.url+"get-file-song/"+this.playerSongFile);
	}
	
	public playSong() {
		this.playerSongControls.play();
	}

	public pauseSong() {
		this.playerSongControls.pause();
	}

	public volumeUp() {
		if(this.playerVolume < 1) {
			this.playerVolume += 0.1;
			this.playerSongControls.volume = this.playerVolume;
		}
	}

	public volumeDown() {
		if(this.playerVolume > 0.1) {
			this.playerVolume -= 0.1;
			this.playerSongControls.volume = this.playerVolume;
		}	
	}
}
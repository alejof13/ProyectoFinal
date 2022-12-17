import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'recent',
	templateUrl: './../views/recent.html'
})

export class RecentComponent implements OnInit {
	public title: string;
	public url: string;

	public constructor() {
		this.url = GLOBAL.url;
		this.title = "Recientes";
	}

	public ngOnInit() {
		console.log("recent.component cargado...");
	}
}
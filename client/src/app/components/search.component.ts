import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'search',
	templateUrl: './../views/search.html'
})

export class SearchComponent implements OnInit {
	public title: string;
	public url: string;
	public search: string;

	public constructor() {
		this.url = GLOBAL.url;
		this.title = "Buscar";
		this.search = "";
	}

	public ngOnInit() {
		console.log("search.component cargado...");
	}

	public onSearch() {
		console.log(this.search);
	}
}
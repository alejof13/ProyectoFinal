import { Artist } from "./artist";

export class Album {
	// Se definen de este modo ya que se le "dice" que se declaren e inicializen
	constructor(
		public _id: string,
		public title: string,
		public description: string,
		public year: string,
		public image: string,
		public artist: Artist
	) {}
}
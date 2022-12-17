import { Album } from "./album";

export class Song {
	// Se definen de este modo ya que se le "dice" que se declaren e inicializen
	constructor(
		public _id: string,
		public number: string,
		public name: string,
		public duration: string,
		public file: string,
		public album: Album
	) {}
}
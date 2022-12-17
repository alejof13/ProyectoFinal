export class Artist {
	// Se definen de este modo ya que se le "dice" que se declaren e inicializen
	constructor(
		public _id: string,
		public name: string,
		public description: string,
		public image: string
	) {}
}
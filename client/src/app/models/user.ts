export class User {
	// Se definen de este modo ya que se le "dice" que se declaren e inicializen
	constructor(
		public _id: string,
		public name: string,
		public surname: string,
		public email: string,
		public password: string,
		public role: string,
		public image: string
	) {}
}
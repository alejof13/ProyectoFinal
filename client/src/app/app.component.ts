import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [UserService]
})

export class AppComponent implements OnInit {
	public title = 'MusicFy!';
	public user: User;
	public user_register: User;
	public identity: User;
	public token: string;
	public errorLogin: string;
	public typeRegisterMessage: string = "alert-danger";
	public alertRegister: string;
	public url: string;

	public constructor(
		private _userService: UserService,
		private _route: ActivatedRoute,
		private _router: Router,
	){
		this.user = new User('', '', '', '', '', 'ROLE_USER', '');
		this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
		this.url = GLOBAL.url;
	}

	public ngOnInit() {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	public onSubmit() {
		// Conseguir los datos del usuario identificado
		this._userService.signup(this.user, null).subscribe(
			(res : any) => {
				let identity = res.user;
				this.identity = identity;

				if(!this.identity._id) {
					this.errorLogin = "El usuario no está correctamente logueado";
				} else {
					// Crear sesión en el LocalStorage para tener al usuario en sesión
					//localStorage.setItem('identity', JSON.stringify(identity));
					this._userService.setIdentity(identity);

					// Conseguir el token para enviarselo a cada petición HTTP
					this._userService.signup(this.user, 'true').subscribe(
						(res : any) => {
							let token = res.token;
							this.token = token;

							if(this.token.length <= 0) {
								this.errorLogin = "El token no se ha generado";
							} else {
								// Crear sesión en el LocalStorage para tener al usuario en sesión
								//localStorage.setItem('token', token);
								this._userService.setToken(token);
								this.user = new User('', '', '', '', '', 'ROLE_USER', '');
							}
						},
						(err : any) => {
							var errorLogin = <any>err;
							
							if(errorLogin != null) {
								this.errorLogin = err.message;
							}
						}
					);
				}
			},
			(err : any) => {
				var errorLogin = <any>err;
				
				if(errorLogin != null) {
					this.errorLogin = err.message;
				}
			}
		);
	}

	public logout() {
		this._userService.logout();
		this.identity = null;
		this.token = null;
		this._router.navigate(['/']);
	}

	public onSubmitRegister() {
		this._userService.register(this.user_register).subscribe(
			(res : any) => {
				let user = res.user;
				this.user_register = user;
				if(this.user._id == null) {
					this.alertRegister = "No se ha registrado el usuario";
					this.typeRegisterMessage = "alert-danger";
				} else {
					this.alertRegister = "El registro se ha completado correctamente, accede con tu email: "+this.user_register.email;
					this.typeRegisterMessage = "alert-info";
					this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
				}
			},
			(err : any) => {
				var errorLogin = <any>err;
				
				if(errorLogin != null) {
					this.alertRegister = err.message;
					this.typeRegisterMessage = "alert-danger";
				}
			}
		);
	}
}
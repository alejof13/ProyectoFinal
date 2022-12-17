import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms'
import { appRoutingProviders, routing } from './app.routing';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PlayerService } from './services/player.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

import { UserEditComponent } from './components/user-edit.component';

import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

import { PlayerComponent } from './components/player.component';
import { AlbumListComponent } from './components/album-list.component';
import { SongListComponent } from './components/song-list.component';
import { SearchComponent } from './components/search.component';
import { RecentComponent } from './components/recent.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SearchComponent,
		RecentComponent,
		UserEditComponent,
		ArtistListComponent,
		ArtistAddComponent,
		ArtistEditComponent,
		ArtistDetailComponent,
		AlbumListComponent,
		AlbumAddComponent,
		AlbumEditComponent,
		AlbumDetailComponent,
		SongListComponent,
		SongAddComponent,
		SongEditComponent,
		PlayerComponent
	],
	imports: [
		BrowserModule,
		SweetAlert2Module.forRoot(),
		FormsModule,
		AppRoutingModule,
		HttpClientModule,
		routing
	],
	providers: [
		appRoutingProviders,
		PlayerService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
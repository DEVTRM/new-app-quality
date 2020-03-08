import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(private http: HttpClient, private storage: Storage) { }

  requestSong(song) {

    this.storage.get(TOKEN_KEY).then( (token) => {
      let access_token = token;
      let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + access_token,
      });

      let data = {
        'song_text': song.song
      }
      console.log("Data: ");
      console.log(data);
      this.http.post('http://127.0.0.1:8000/api/auth/songs/request', data, { headers: headers } ).subscribe(
        result =>  {
          console.log("Canción solicitada correctamente");
        }, error => {
          console.log("Error al solicitar la canción");
        }
      );
    }, (error) => {
      console.log("Error al obtener token");
    });
  }
}

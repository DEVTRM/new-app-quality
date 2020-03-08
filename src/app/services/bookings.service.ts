import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient, private storage: Storage) { }


  getPlaces() {
    return this.storage.get(TOKEN_KEY).then( (token) => {
      let access_token = token;
      let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + access_token,
      });

      return this.http.get('http://127.0.0.1:8000/api/auth/places/list', {headers: headers }).toPromise();
    });
    
  }
  requestBooking(booking) {

    this.storage.get(TOKEN_KEY).then( (token) => {
      let access_token = token;
      let headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + access_token,
      });

      let data = {
        'persons': booking.n_persons,
        'booking_date': booking.booking_date.split('T')[0]+" "+booking.booking_hour.split('T')[1].split('.')[0],
        'place_id': booking.place
      }

      console.log("Data: ");
      console.log(data);

      this.http.post('http://127.0.0.1:8000/api/auth/booking/book', data, { headers: headers } ).subscribe(
        result =>  {
          console.log("Reserva solicitada correctamente");
        }, error => {
          console.log("Error al solicitar la reserva");
        }
      );
    }, (error) => {
      console.log("Error al obtener token");
    });
  }
}

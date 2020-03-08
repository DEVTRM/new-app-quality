import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BookingsService } from '../services/bookings.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  private places = [];
  private place:number;
  private bookingsForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private bookingsService: BookingsService, private alertController: AlertController, private navController: NavController) { 
    this.bookingsForm = this.formBuilder.group({
      n_persons: ['', Validators.required],
      booking_date: ['', Validators.required],
      booking_hour: ['', Validators.required],
      place: ['', Validators.required]
    });
    this.getPlaces();
  }

  ngOnInit() {
  }

  // Obtengo los sitios disponibles para 
  getPlaces() {
    this.bookingsService.getPlaces().then((places) =>  {
      this.places = places['data'];
    });
  }

  logBookingForm() {
    if (this.bookingsForm.valid == true) {
      let alert_data = {
        'header': 'Reserva completada',
        'message': 'Tu reserva se ha completado correctamente.',
        'buttons': 'Ok',
      }
      this.presentAlert(alert_data);
    } else {
      let alert_data = {
        'header': 'Formulario inválido',
        'message': 'Debe rellenar correctamente todos los campos del formulario',
        'buttons': 'Ok',
      }
      this.presentAlert(alert_data);
    }
  }


  async presentAlert(alert_data) {
    const alert = await this.alertController.create({
      header: alert_data['header'],
      message: alert_data['message'],
      buttons: [
        {
          text: alert_data['buttons'],
          role: 'cancel',
          handler: data => {
            if (this.bookingsForm.valid == true) {
              this.bookingsService.requestBooking(this.bookingsForm.value);
              //this.navController.navigateRoot('/list' , {animated:true});
            }
          }
        }],
    });

    await alert.present();
  }

}

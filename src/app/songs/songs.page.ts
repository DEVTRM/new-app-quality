import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SongsService } from '../services/songs.service';
import { AlertController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit {

  private songForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private songService: SongsService, private alertController: AlertController, public navController: NavController) {
    this.songForm = this.formBuilder.group({
      song: ['', Validators.required]
    });
   }

   logForm() {
     let song = this.songForm.value;
     this.songService.requestSong(song);
     let alert_data = {
       'header': 'Solicitud de canción',
       'message': 'Tu solicitud de canción se ha enviado correctamente',
       'buttons': 'Ok',
     }
     this.presentAlert(alert_data);
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
            this.navController.navigateRoot('/list' , {animated:true});  
          }
        }],
    });

    await alert.present();
  }x

  ngOnInit() {

  }

}

import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private storage: Storage, 
    private plt: Platform,
    private router: Router,
    public alertController: AlertController
    ) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  register(values) {

    if (values.gender == "Hombre") {
      var gender_selected = "0";
    } else {
      var gender_selected = "1";
    }

    const uploadData = new FormData(); // declar form object
    uploadData.append('name', values.name);
    uploadData.append('email', values.email);
    uploadData.append('gender', gender_selected);
    uploadData.append('phone', values.phone);
    uploadData.append('password', values.matching_passwords.password);
    uploadData.append('password_confirmation', values.matching_passwords.confirm_password);
    
    console.log("Datos signup: ");
    console.log(uploadData);
    this.loadingController.create({keyboardClose: true, message: 'Entrando ...'})
      .then(loadingEl => {
        loadingEl.present(); // show loading
        this.http.post<any>('http://127.0.0.1:8000/api/auth/signup', uploadData)
        .subscribe(
          res => {

            // Compruebo si el usuaro se ha creado correctamente
            if (res.hasOwnProperty('message')) {
              let login_data = {
                'email': uploadData.get('email'),
                'password': uploadData.get('password'),
              }

              this.login(login_data);
              this.router.navigate(['list']);
            } else {
              this.signUpFailedAlert(res.ERR_MSG);
            }

            // Hide loading
            loadingEl.dismiss();

            // example return data 
            // res = { isSuccess: true, tokenKey: 'token-key', others: 'others..' }
            /* if (res.isSuccess) { 
              return this.storage.set(TOKEN_KEY, res.access_token).then(() => {
                this.authenticationState.next(true);
              });
            } else {
              this.registerFailedAlert('Por favor, introduce valores válidos para el registro!');
            } */
          },
          err => {
            console.log(err);
          }
        );
      });
  }

  login(values) {
    
    const uploadData = new FormData(); // declar form object
    uploadData.append('email', values.email);
    uploadData.append('password', values.password);
    
    this.loadingController.create({keyboardClose: true, message: 'Entrando ...'})
      .then(loadingEl => {
        loadingEl.present(); // show loading
        this.http.post<any>('http://127.0.0.1:8000/api/auth/login', uploadData)
        .subscribe(
          res => {
            loadingEl.dismiss(); // hide loading
            // res = { isSuccess: true, tokenKey: 'token-key', others: 'others..' }
            // Autenticado correctamente
            return this.storage.set(TOKEN_KEY, res.access_token).then(() => {
              this.authenticationState.next(true);
            });
          },
          err => {
            loadingEl.dismiss();
            this.loginFailedAlert();
            this.logout();
            console.log(err);
          }
        );
      });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      this.router.navigate(['login']);
    });
  }
 
  isAuthenticated() {
    if (!this.authenticationState.value) {
      this.router.navigate(['login']);
    }
    return this.authenticationState.value;
  }


  async loginFailedAlert() {
    const alert = await this.alertController.create({
      header: 'Error en el login',
      message: 'Por favor, introduce un correo/movil y contraseña válidos.',
      buttons: ['OK']
    });

    await alert.present();
  }


  async signUpFailedAlert(err_msg) {
    const alert = await this.alertController.create({
      header: 'Error en el registro!',
      message: err_msg,
      buttons: ['Ok']
    });

    await alert.present();
  }

}

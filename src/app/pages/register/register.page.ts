import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UsernameValidator } from '../../validators/username.validator';
import { PhoneValidator } from '../../validators/phone.validator';
import { PasswordValidator } from '../../validators/password.validator';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validations_form: FormGroup;
  matching_passwords_group: FormGroup;

  genders: Array<string>;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    this.genders = [
      "Hombre",
      "Mujer"
    ];

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    let phone = new FormControl('', Validators.compose([
      Validators.required
    ]));

    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.required),
      gender: new FormControl(this.genders[0], Validators.required),
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });

    /**
     * check login state
     */
    this.checkLoginState();
  }

  validation_messages = {
    'name': [
      { type: 'required', message: 'El nombre es obligatorio.' }
    ],
    'email': [
      { type: 'required', message: 'El correo electrónico es obligatorio.' },
      { type: 'pattern', message: 'Por favor, introduce un correo válido.' }
    ],
    'phone': [
      { type: 'required', message: 'El teléfono es obligatorio.' },
    ],
    'password': [
      { type: 'required', message: 'La contraseña es obligatoria.' },
      { type: 'minlength', message: 'La contraseña debe de ser de al menos 5 caracteres.' },
      { type: 'pattern', message: 'La contraseña debe contener letras y números.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Es boligatorio confirmar la contraseña.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Las contraseñas no coinciden.' }
    ],
    'terms': [
      { type: 'pattern', message: 'Debes aceptar los términos y condiciones de uso.' }
    ],
  };

  onSubmitRegister(values){
    this.authenticationService.register(values);
    /*
    this.router.navigate(["list"]); */
  }

  /**
   * declar - check login state
   */
  checkLoginState(){
    this.authenticationService.authenticationState.subscribe(state => {
      if (state) {
        this.router.navigate(['list']);
      }
    });
  }

}

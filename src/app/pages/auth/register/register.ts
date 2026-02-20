import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  name = '';
  lastName = '';
  email = '';
  password = '';
  repeatPassword = '';
  errorMessage = '';
  showSavedMessage = false;
  savedMessage = '';

  emailExists = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(form: NgForm, event: Event) {
    event.preventDefault(); // evita que el navegador haga submit

    this.errorMessage = '';
    this.emailExists = false;

    if (!form.valid) {
      form.control.markAllAsTouched();
      this.errorMessage = 'Por favor, rellene todos los campos correctamente.';
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const user: User = {
      name: this.name + ' ' + this.lastName,
      email: this.email,
      password: this.password,
    };

    const success = this.authService.register(user);

    if (!success) {
      this.emailExists = true;
      return;
    }

    this.savedMessage = 'Te has registrado con éxito.';
    this.showSavedMessage = true;

    setTimeout(() => {
      this.authService.login(user.email, user.password);
      this.showSavedMessage = false;
      this.router.navigate(['/mi-cuenta']);
    }, 1500);
  }
}

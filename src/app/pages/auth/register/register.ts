import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    this.errorMessage = '';

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

    if (success) {
      // Registro exitoso, redirige a inicio
      this.router.navigate(['/inicio']);
    } else {
      this.errorMessage = 'El usuario ya existe';
    }
  }
}

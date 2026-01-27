import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  login() {
    this.errorMessage = '';

    const success = this.authService.login(this.email, this.password);

    if (!success) {
      this.errorMessage = 'Email o contraseña incorrectos';
    }
    // Si es exitoso, AuthService ya redirige a /inicio
  }
}

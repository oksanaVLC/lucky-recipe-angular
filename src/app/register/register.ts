import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  register() {
    console.log({ name: this.name, lastName: this.lastName, email: this.email });
  }
}

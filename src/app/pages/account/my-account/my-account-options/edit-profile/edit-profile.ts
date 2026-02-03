import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../../../core/services/auth';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss'],
})
export class EditProfileComponent {
  name = '';
  email = '';
  avatar: string | null = null;

  currentPassword = '';
  newPassword = '';
  repeatNewPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.name = user.name;
      this.email = user.email;
      this.avatar = (user as any).avatar ?? null;
    }
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatar = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveProfile() {
    this.errorMessage = '';
    this.successMessage = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Validar cambio de contraseña
    if (this.newPassword || this.repeatNewPassword) {
      if (this.currentPassword !== currentUser.password) {
        this.errorMessage = 'La contraseña actual es incorrecta';
        return;
      }

      if (this.newPassword !== this.repeatNewPassword) {
        this.errorMessage = 'Las nuevas contraseñas no coinciden';
        return;
      }

      currentUser.password = this.newPassword;
    }

    // Actualizar datos
    currentUser.name = this.name;
    if (this.avatar) {
      (currentUser as any).avatar = this.avatar;
    }

    // Guardar en localStorage
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.email === currentUser.email);
    if (index !== -1) {
      users[index] = currentUser;
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Mensaje de éxito + redirección
    this.successMessage = 'Perfil actualizado correctamente';

    setTimeout(() => {
      this.router.navigate(['/mi-cuenta']);
    }, 1500);
  }

  private getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  logout() {
    this.authService.logout();
  }
}

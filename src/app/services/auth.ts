import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private currentUser: User | null = null;

  constructor(private router: Router) {
    // Recuperar sesión si existe
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      this.loggedIn = true;
    }
  }

  // Registro
  register(user: User): boolean {
    const users = this.getAllUsers();
    if (users.find((u) => u.email === user.email)) {
      return false; // ya existe
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    this.login(user.email, user.password); // log automático al registrarse
    return true;
  }

  // Login
  login(email: string, password: string): boolean {
    const users = this.getAllUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      this.loggedIn = true;
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/inicio']); // <-- navegación desde el servicio
      return true;
    }
    return false;
  }

  // Logout
  logout() {
    this.loggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/inicio']); // <-- también aquí
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private getAllUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}

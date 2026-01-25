import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false; // Estado de autenticación

  constructor(private router: Router) {}

  // Simula login
  login() {
    this.loggedIn = true;
    console.log('Usuario logueado');
    this.router.navigate(['/inicio']); // Redirige al dashboard
  }

  // Logout
  logout() {
    this.loggedIn = false;
    console.log('Usuario deslogueado');
    this.router.navigate(['/inicio']); // Redirige al dashboard
  }

  // Devuelve true si está logueado
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}

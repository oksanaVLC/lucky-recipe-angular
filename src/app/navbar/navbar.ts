import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../components/search-bar/search-bar';
import { AuthService } from '../services/auth';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchBarComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  isMenuOpen = false;
  isLanguageMenuOpen = false;

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isLanguageMenuOpen = false;
  }

  toggleLanguageMenu() {
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
  }

  setLanguage(lang: string) {
    console.log('Idioma seleccionado:', lang);
    this.isLanguageMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }

  onSearch(term: string) {
    this.searchService.setSearchTerm(term);
    this.closeMenu();
    console.log('Buscar desde navbar:', term);
  }
}

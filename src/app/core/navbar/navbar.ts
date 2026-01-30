import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
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
  // ✅ Usamos signal en vez de boolean normal
  isMenuOpen = signal(false);

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private router: Router,
  ) {}

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
    console.log('Menu toggled:', this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/inicio']);
  }

  onSearch(term: string) {
    this.searchService.setSearchTerm(term);
    this.closeMenu();
  }
}

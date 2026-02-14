// app.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer';
import { Navbar } from './core/navbar/navbar';

import { NgParticlesService } from '@tsparticles/angular';
import { loadSlim } from '@tsparticles/slim';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, FooterComponent],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  constructor(private readonly ngParticlesService: NgParticlesService) {}

  ngOnInit(): void {
    this.ngParticlesService.init(async (engine) => {
      await loadSlim(engine);
    });
  }

  onSearch(term: string) {
    console.log('Buscar:', term);
  }
}

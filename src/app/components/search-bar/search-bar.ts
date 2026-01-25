import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBarComponent {
  searchTerm = '';
  recognition: any;

  @Output() search = new EventEmitter<string>();

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.searchTerm = transcript;
        this.emitSearch();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
      };
    }
  }

  // Emitir búsqueda solo si hay texto
  emitSearch() {
    let trimmed = this.searchTerm.trim();
    // quitar puntuación final
    trimmed = trimmed.replace(/[.,;!?]$/, '');
    if (trimmed) {
      this.search.emit(trimmed);
    }
  }

  // Para el micrófono
  startVoice() {
    if (this.recognition) this.recognition.start();
    else alert('Tu navegador no soporta reconocimiento de voz.');
  }

  stopVoice() {
    if (this.recognition) this.recognition.stop();
  }
}

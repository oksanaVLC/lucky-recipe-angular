import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private lastUrl: string | null = null;
  private lastScroll = 0;

  setLastUrl(url: string, scroll: number) {
    this.lastUrl = url;
    this.lastScroll = scroll;
  }

  getLastUrl(): string | null {
    return this.lastUrl;
  }

  getLastScroll(): number {
    return this.lastScroll;
  }
}

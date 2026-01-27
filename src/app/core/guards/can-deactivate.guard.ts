import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

// Interfaz que cualquier componente con guard debe implementar
export interface CanComponentDeactivate {
  canDeactivate: () => Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

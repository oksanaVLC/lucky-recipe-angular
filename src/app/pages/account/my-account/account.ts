import { CommonModule } from '@angular/common'; // necesario si uso directivas ngIf, ngFor, etc.
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DraftService } from '../../../core/services/draft.service';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
})
export class AccountComponent {
  constructor(public draftService: DraftService) {}
}

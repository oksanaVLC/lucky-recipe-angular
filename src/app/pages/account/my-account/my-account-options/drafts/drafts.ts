import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Draft, DraftService } from '../../../../../core/services/draft.service';
import { BackButtonComponent } from '../../../../../shared/components/back-button/back-button';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './drafts.html',
  styleUrls: ['./drafts.scss'],
})
export class DraftsComponent implements OnInit {
  drafts: Draft[] = [];
  showDeleteModal = false;
  draftToDelete!: Draft;

  constructor(
    private draftService: DraftService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.drafts = this.draftService.getDrafts();
  }

  editDraft(draft: Draft) {
    this.draftService.setCurrentDraft(draft);
    this.router.navigate(['/mi-cuenta/crear-receta']);
  }

  confirmDelete(draft: Draft) {
    this.draftToDelete = draft;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  deleteDraft() {
    if (this.draftToDelete) {
      this.draftService.deleteDraft(this.draftToDelete.id);
      this.drafts = this.draftService.getDrafts();
    }
    this.showDeleteModal = false;
  }
}

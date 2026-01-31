import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-button-small',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './back-button-small.html',
  styleUrls: ['./back-button-small.scss'],
})
export class BackButtonSmallComponent {
  goBack() {
    history.back();
  }
}

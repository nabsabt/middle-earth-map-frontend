import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.scss',
  imports: [TranslateModule],
  providers: [],
})
export class DonateComponent {
  constructor() {}
}

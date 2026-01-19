import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  imports: [TranslateModule],
  providers: [],
})
export class AboutComponent {
  constructor() {}
}

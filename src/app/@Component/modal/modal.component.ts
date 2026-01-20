import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { ModalType } from '../../@Interface/maproot.interface';
import { TranslateModule } from '@ngx-translate/core';
import { AboutComponent } from './about/about.component';
import { DiscussComponent } from './discuss/discuss.component';
import { DonateComponent } from './donate/donate.component';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  imports: [TranslateModule, AboutComponent, DiscussComponent, DonateComponent],
  providers: [],
})
export class ModalComponent implements OnInit, OnDestroy {
  public modalType = input<ModalType | undefined>(undefined);
  public closeModal = output();

  constructor() {}
  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public onCloseModal() {}
}

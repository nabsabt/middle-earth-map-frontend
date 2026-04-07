import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ModalType } from '../../@Interface/maproot.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, TranslateModule, CommonModule],
})
export class SideMenu {
  public modalToggle = output<ModalType>();

  public isButtonsContainerOpened = signal<boolean>(false);
  constructor() {}

  public onOpenModal(modalName: ModalType) {
    this.modalToggle.emit(modalName);
  }

  public toggleButtonsContainer() {
    this.isButtonsContainerOpened.set(!this.isButtonsContainerOpened());
  }
}

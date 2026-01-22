import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AlertService } from '../../../@Service/alert.service';
import { ChatService } from '../../../@Service/chat.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AI_CHAR } from '../../../@Interface/maproot.interface';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [TranslateModule, MatSelectModule, ReactiveFormsModule],
  providers: [AlertService, ChatService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
  private sendMessageSub: Subscription;

  private chatService = inject(ChatService);
  public characters = signal<Array<AI_CHAR>>([
    'Aragorn',
    'Gandalf',
    'Gollum',
    'Illuvatar',
    'Sauron',
  ]);
  public selectedCharacter = signal<AI_CHAR | undefined>(undefined);
  public messageInputText = signal<string>('');
  public messages = signal<Array<string>>([]);

  public loading = signal<boolean>(false);

  form = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(400),
    ]),
  });

  constructor() {}
  ngOnInit(): void {}

  public onCharacterSelected(char: AI_CHAR) {
    this.selectedCharacter.set(char);
  }

  public sendChatMessage() {
    if (this.form.invalid || !this.selectedCharacter()) {
      return;
    }
    const message: string = this.form.getRawValue().message as string;
    console.log(message, this.selectedCharacter());
    this.loading.set(true);
    this.sendMessageSub = this.chatService
      .postChatMessage(message, this.selectedCharacter() as AI_CHAR)
      .subscribe({
        next: (res: { reply: string }) => {
          console.log('reply: ', res.reply);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          this.loading.set(false);

          return error;
        },
      });
  }
  ngOnDestroy(): void {
    this.selectedCharacter.set(undefined);
    this.sendMessageSub?.unsubscribe();
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AlertService } from '../../../@Service/alert.service';
import { ChatService } from '../../../@Service/chat.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AI_CHAR } from '../../../@Interface/maproot.interface';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [TranslateModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  providers: [AlertService, ChatService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chatBox') chatBox?: ElementRef<HTMLElement>;
  private isChatAllowedSub: Subscription;

  private sendMessageSub: Subscription;
  private alertService = inject(AlertService);
  private chatService = inject(ChatService);

  public isChatAllowed = signal<boolean>(false);
  public characters = signal<Array<AI_CHAR>>([
    'Aragorn',
    'Gandalf',
    'Gollum',
    'Illuvatar',
    'Sauron',
  ]);
  public selectedCharacter = signal<AI_CHAR | undefined>(undefined);
  public messageInputText = signal<string>('');
  public messages = signal<Array<{ isResponse: boolean; text: string }>>([]);

  public loading = signal<boolean>(false);

  form = new FormGroup({
    message: new FormControl({ value: '', disabled: this.loading() }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(400),
    ]),
  });

  constructor() {}

  ngOnInit(): void {
    this.isChatAllowedSub = this.chatService.isChatMessageAllowed().subscribe({
      next: (res: { isAllowed: boolean }) => {
        this.isChatAllowed.set(res.isAllowed);
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.alertService.showAlert(error.error.message, {
          position: 'bottom',
        });
        return error;
      },
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      const el = this.chatBox?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight - el.clientHeight;
    });
  }

  public onCharacterSelected(char: AI_CHAR) {
    this.selectedCharacter.set(char);
  }

  public sendChatMessage() {
    if (this.form.invalid || !this.selectedCharacter()) {
      return;
    }
    const message: string = this.form.getRawValue().message as string;
    this.loading.set(true);
    this.messages.update((arr) => [...arr, { isResponse: false, text: message }]);
    this.scrollToBottom();

    this.messageInputText.set('');
    this.form.controls.message.setValue('');

    this.sendMessageSub = this.chatService
      .postChatMessage(message, this.selectedCharacter() as AI_CHAR)
      .subscribe({
        next: (res: { reply: string }) => {
          this.messages.update((arr) => [...arr, { isResponse: true, text: res.reply }]);
          this.loading.set(false);
          this.scrollToBottom();
        },
        error: (error: HttpErrorResponse): HttpErrorResponse => {
          this.loading.set(false);
          this.alertService.showAlert(error.error.message, {
            position: 'bottom',
          });
          return error;
        },
      });
  }
  ngOnDestroy(): void {
    this.selectedCharacter.set(undefined);
    this.sendMessageSub?.unsubscribe();
    this.isChatAllowedSub?.unsubscribe();
    this.messages.set([]);
  }
}

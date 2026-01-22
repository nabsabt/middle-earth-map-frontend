import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbackMailService } from '../../../@Service/mail.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../@Service/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'discuss',
  templateUrl: './discuss.component.html',
  styleUrl: './discuss.component.scss',
  imports: [TranslateModule, ReactiveFormsModule],
  providers: [AlertService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscussComponent implements OnInit, OnDestroy {
  private onCheckMailSub: Subscription;
  private onSendMailSub: Subscription;

  private mailService = inject(FeedbackMailService);
  private translateService = inject(TranslateService);
  private alertService = inject(AlertService);

  public lang = toSignal(
    this.translateService.onLangChange.pipe(
      map((e) => (e.lang === 'hu' ? 'HU' : 'EN')),
      startWith(this.translateService.currentLang === 'hu' ? 'HU' : 'EN'),
    ),
    { initialValue: 'EN' as const },
  );

  public canMailBeSent = signal<boolean>(true);
  public warningMessage = signal<string | undefined>('');

  public sending = signal<boolean>(false);
  public done = signal<boolean>(false);
  public error = signal<string>('');

  constructor() {}
  ngOnInit(): void {
    this.onCheckMailSub = this.mailService.canMailBeSent().subscribe({
      next: (res: { status: boolean; warningMessage: string | undefined }) => {
        this.canMailBeSent.set(res.status);

        if (!res.status) {
          this.form.controls.message.disable();
          this.form.controls.email.disable();
          this.form.controls.name.disable();
        }

        !res.status ? this.warningMessage.set(res.warningMessage) : '';
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        return error;
      },
    });
  }

  form = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  get message() {
    return this.form.get('message');
  }
  get email() {
    return this.form.get('email');
  }
  get name() {
    return this.form.get('name');
  }

  public async submitMessage() {
    this.error.set('');
    this.done.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.showAlert(
        this.lang() === 'HU'
          ? 'Kérlek, minden mezőt tölts ki rendesen!'
          : 'Please, fill every field properly!',
        { position: 'bottom' },
      );
      return;
    }
    this.sending.set(true);

    this.onSendMailSub = this.mailService.postNewMail().subscribe({
      next: async (res: { status: boolean; message: string }) => {
        if (res.status) {
          /**
           * Mail can be sent, now calling EmailJS service->
           */
          try {
            const { message, email, name } = this.form.value;
            await this.mailService.send(message!, email || undefined, name || undefined);
            this.done.set(true);
            this.form.reset();
            this.alertService.showAlert(res.message);
          } catch (e: any) {
            this.error.set(this.lang() === 'HU' ? 'Hiba történt!' : 'Some error occured!');
            this.alertService.showAlert(
              this.lang() === 'HU'
                ? 'Az üzenetküldés sikertelen! Kérlek, próbálkozz kicsit később!'
                : 'Could not send message! Please, try again a bit later!',
              { position: 'bottom' },
            );
          } finally {
            this.sending.set(false);
          }
          return;
        } else {
          this.alertService.showAlert(res.message, { position: 'bottom' });
        }
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.alertService.showAlert(error.error.message);
        return error;
      },
    });
  }

  ngOnDestroy(): void {
    this.onCheckMailSub?.unsubscribe();
    this.onSendMailSub?.unsubscribe();
  }
}

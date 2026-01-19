import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbackMailService } from '../../../@Service/mail.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../@Service/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'discuss',
  templateUrl: './discuss.component.html',
  styleUrl: './discuss.component.scss',
  imports: [TranslateModule, ReactiveFormsModule],
  providers: [AlertService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscussComponent {
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

  public sending = signal<boolean>(false);
  public done = signal<boolean>(false);
  public error = signal<string>('');

  constructor() {}

  form = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
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
      console.log('invalif, ', this.lang());
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

    try {
      console.log('trying');
      const { message, email, name } = this.form.value;
      await this.mailService.send(message!, email || undefined, name || undefined);
      this.done.set(true);
      this.form.reset();
      this.alertService.showAlert(
        this.lang() === 'HU' ? 'Üzenet elküldve! Köszönöm!' : 'Message sent! Thank you!',
        { position: 'bottom' },
      );
    } catch (e: any) {
      console.log(e?.message);
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
  }
}

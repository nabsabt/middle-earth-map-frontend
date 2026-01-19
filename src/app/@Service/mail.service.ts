import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackMailService {
  private readonly serviceId = environment.emailjs.serviceId;
  private readonly templateId = environment.emailjs.templateId;
  private readonly publicKey = environment.emailjs.publicKey;

  async send(message: string, fromEmail?: string, fromName?: string): Promise<void> {
    const trimmed = message?.trim();
    if (!trimmed) throw new Error('Message is empty');

    const params = {
      message: trimmed,
      from_email: fromEmail?.trim() || 'anonymous',
      from_name: fromName?.trim() || 'anonymous',
      sent_at: new Date().toISOString(),
    };

    await emailjs.send(this.serviceId, this.templateId, params, {
      publicKey: this.publicKey,
    });
  }
}

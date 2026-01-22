import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FeedbackMailService {
  private readonly serviceId = environment.emailjs.serviceId;
  private readonly templateId = environment.emailjs.templateId;
  private readonly publicKey = environment.emailjs.publicKey;

  constructor(private http: HttpClient) {}

  public canMailBeSent(): Observable<{ status: boolean; warningMessage: string | undefined }> {
    return this.http.get<{ status: boolean; warningMessage: string | undefined }>(
      `${environment.apiURL}/api/checkEmailSend`,
    );
  }

  public postNewMail(): Observable<{ status: boolean; message: string }> {
    return this.http.post<{ status: boolean; message: string }>(
      `${environment.apiURL}/api/postNewMail`,
      {},
    );
  }

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

import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FeedbackMailService {
  constructor(private http: HttpClient) {}

  public isMailSendingAllowed(): Observable<{
    status: boolean;
    warningMessage: string | undefined;
  }> {
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

  public fetchEmailJSKeys(): Observable<{
    result: { publicKey: string; serviceId: string; templateId: string };
  }> {
    return this.http.get<{
      result: { publicKey: string; serviceId: string; templateId: string };
    }>(`${environment.apiURL}/api/getEmailJSKeys`);
  }

  async send(
    emailJSparams: { publicKey: string; serviceId: string; templateId: string },
    message: string,
    fromEmail?: string,
    fromName?: string,
  ): Promise<void> {
    const trimmed = message?.trim();
    if (!trimmed) throw new Error('Message is empty');

    const params = {
      message: trimmed,
      from_email: fromEmail?.trim() || 'anonymous',
      from_name: fromName?.trim() || 'anonymous',
      sent_at: new Date().toISOString(),
    };

    await emailjs.send(emailJSparams.serviceId, emailJSparams.templateId, params, {
      publicKey: emailJSparams.publicKey,
    });
  }
}

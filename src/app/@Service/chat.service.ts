import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AI_CHAR } from '../@Interface/maproot.interface';

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) {}

  public isChatMessageAllowed(): Observable<{
    isAllowed: boolean;
  }> {
    return this.http.get<{ isAllowed: boolean }>(`${environment.apiURL}/api/isChatMessageAllowed`);
  }

  public postChatMessage(message: string, replyAs: AI_CHAR): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${environment.apiURL}/api/postMessageToAI`, {
      message,
      replyAs,
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClearedQuestion, QuizResults } from '../@Interface/quiz.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class QuizService {
  constructor(private http: HttpClient) {}

  public getQuestion(level: 1 | 2 | 3): Observable<ClearedQuestion> {
    return this.http.get<ClearedQuestion>(`${environment.apiURL}/api/getQuizQuestion`, {
      params: { lvl: level },
    });
  }

  public getResults(): Observable<QuizResults> {
    return this.http.get<QuizResults>(`${environment.apiURL}/api/getQuizResults`);
  }

  public getIsCorrect(
    questionPOS: number,
    selectedOption: number,
  ): Observable<{ correctAnswerNumber: number }> {
    return this.http.get<{ correctAnswerNumber: number }>(
      `${environment.apiURL}/api/getIsCorrect`,
      {
        params: { questionPOS: questionPOS, selectedOption: selectedOption },
      },
    );
  }

  public removeClientData(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${environment.apiURL}/api/removeClientData`);
  }
}

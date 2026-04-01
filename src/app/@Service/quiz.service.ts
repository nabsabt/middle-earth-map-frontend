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

  public getAnswerResult(
    questionPOS: number,
    selectedOption: number,
  ): Observable<{ isCorrect: boolean } | QuizResults> {
    return this.http.get<{ isCorrect: boolean } | QuizResults>(
      `${environment.apiURL}/api/getAnswerResult`,
      {
        params: { questionPOS: questionPOS, selectedOption: selectedOption },
      },
    );
  }
}

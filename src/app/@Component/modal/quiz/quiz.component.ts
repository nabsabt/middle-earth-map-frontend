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
import { QuizService } from '../../../@Service/quiz.service';
import { AlertService } from '../../../@Service/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ClearedQuestion, QuizResults } from '../../../@Interface/quiz.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  standalone: true,
  imports: [TranslateModule, MatSelectModule, CommonModule],
  providers: [AlertService, QuizService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnInit, OnDestroy {
  private getQuestionSub: Subscription;
  private getIsCorrectSub: Subscription;
  private getResultsSub: Subscription;

  public selectedLevel = signal<1 | 2 | 3 | undefined>(undefined);

  public question = signal<ClearedQuestion | undefined>(undefined);
  public result = signal<QuizResults | undefined>(undefined);

  public pickedOption = signal<number | undefined>(undefined);
  public correctAnswer = signal<number | undefined>(undefined);

  private quizService = inject(QuizService);

  constructor(public translateService: TranslateService) {}
  ngOnInit(): void {}

  public onLevelSelected(evt: 1 | 2 | 3) {
    console.log(evt);
    this.selectedLevel.set(evt);
    this.getQuestion();
  }

  public getQuestion() {
    this.getQuestionSub?.unsubscribe();
    this.pickedOption.set(undefined);
    this.correctAnswer.set(undefined);
    this.getQuestionSub = this.quizService.getQuestion(this.selectedLevel()!).subscribe({
      next: (res: ClearedQuestion) => {
        this.question.set(res);
      },
      error: (err: HttpErrorResponse): HttpErrorResponse => {
        return err;
      },
    });
  }

  public onOptionSelected(option: number) {
    this.pickedOption.set(option);
    this.getIsCorrectSub = this.quizService.getIsCorrect(this.question()!.pos, option).subscribe({
      next: (res: { correctAnswerNumber: number }) => {
        console.log('ccorrect answer is: ', res.correctAnswerNumber);
        this.correctAnswer.set(res.correctAnswerNumber);
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        return error;
      },
    });
  }

  public getResult() {
    this.getResultsSub = this.quizService.getResults().subscribe({
      next: (res: QuizResults) => {
        console.log('percentage: ', res.percentage);
        console.log('overall text: ', res.responseMessage);
        this.question.set(undefined);
        this.pickedOption.set(undefined);
        this.correctAnswer.set(undefined);
        this.result.set(res);
      },
      error: (err: HttpErrorResponse): HttpErrorResponse => {
        return err;
      },
    });
  }

  get optionsArr() {
    const opts = this.question()?.options;
    if (!opts) return [];
    return Object.entries(opts);
  }

  public optionClass(optionId: number): string {
    const picked = this.pickedOption();
    const correct = this.correctAnswer();

    if (!picked || !correct) return '';

    if (optionId === correct) return 'correct';
    if (optionId === picked) return 'incorrect';

    return '';
  }
  ngOnDestroy(): void {
    this.getQuestionSub?.unsubscribe();
    this.getIsCorrectSub?.unsubscribe();
    this.getResultsSub?.unsubscribe();
  }
}

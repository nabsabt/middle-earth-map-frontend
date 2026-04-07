import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { QuizService } from '../../../@Service/quiz.service';
import { AlertService } from '../../../@Service/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ClearedQuestion, QuizResults } from '../../../@Interface/quiz.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../../@Service/loader.service';

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
  private onRemoveClientSub: Subscription;

  public selectedLevel = signal<1 | 2 | 3 | undefined>(undefined);

  public question = signal<ClearedQuestion | undefined>(undefined);
  public result = signal<QuizResults | undefined>(undefined);

  public pickedOption = signal<number | undefined>(undefined);
  public correctAnswer = signal<number | undefined>(undefined);

  public isLoading = signal<{ loading: boolean; initial: boolean }>({
    loading: false,
    initial: false,
  });

  private quizService = inject(QuizService);
  private loaderService = inject(LoaderService);

  constructor(public translateService: TranslateService) {
    this.loaderService.$isLoadingAsObservable.subscribe(
      (loading: { loading: boolean; initial: boolean }) => {
        this.isLoading.set(loading);
      },
    );
  }
  ngOnInit(): void {
    this.onRemoveClientSub = this.quizService.removeClientData().subscribe({
      next: (res: { status: string }) => {},
      error: (err: HttpErrorResponse): HttpErrorResponse => {
        return err;
      },
    });
  }

  public onLevelSelected(evt: 1 | 2 | 3) {
    this.selectedLevel.set(evt);
    this.getQuestion();
  }

  public getQuestion() {
    this.getQuestionSub?.unsubscribe();

    this.resetQuestionProps();
    this.loaderService.showLoader(false);
    this.getQuestionSub = this.quizService.getQuestion(this.selectedLevel()!).subscribe({
      next: (res: ClearedQuestion) => {
        this.question.set(res);
        this.loaderService.hideLoader();
      },
      error: (err: HttpErrorResponse): HttpErrorResponse => {
        this.loaderService.hideLoader();
        return err;
      },
    });
  }

  public onOptionSelected(option: number) {
    this.pickedOption.set(option);
    this.loaderService.showLoader(false);

    this.getIsCorrectSub = this.quizService.getIsCorrect(this.question()!.pos, option).subscribe({
      next: (res: { correctAnswerNumber: number }) => {
        this.loaderService.hideLoader();
        this.correctAnswer.set(res.correctAnswerNumber);
      },
      error: (error: HttpErrorResponse): HttpErrorResponse => {
        this.loaderService.hideLoader();
        return error;
      },
    });
  }

  public getResult() {
    this.loaderService.showLoader(false);
    this.getResultsSub = this.quizService.getResults().subscribe({
      next: (res: QuizResults) => {
        this.loaderService.hideLoader();
        this.resetQuestionProps();
        this.result.set(res);
      },
      error: (err: HttpErrorResponse): HttpErrorResponse => {
        this.loaderService.hideLoader();
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

  private resetQuestionProps() {
    this.question.set(undefined);
    this.pickedOption.set(undefined);
    this.correctAnswer.set(undefined);
  }

  ngOnDestroy(): void {
    this.onRemoveClientSub?.unsubscribe();
    this.getQuestionSub?.unsubscribe();
    this.getIsCorrectSub?.unsubscribe();
    this.getResultsSub?.unsubscribe();
  }
}

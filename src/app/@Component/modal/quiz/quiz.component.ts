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
  constructor(public translateService: TranslateService) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private isLoading = new BehaviorSubject<{ loading: boolean; initial: boolean }>({
    loading: false,
    initial: false,
  });
  public $isLoadingAsObservable = this.isLoading.asObservable();
  private delay: number = 800;

  constructor() {}

  public showLoader(isInitial: boolean) {
    this.isLoading.next({ loading: true, initial: isInitial });
    isInitial ? (this.delay = 3000) : '';
  }

  public hideLoader() {
    setTimeout(() => {
      this.isLoading.next({ loading: false, initial: false });
    }, this.delay);
    this.delay = 800;
  }
}

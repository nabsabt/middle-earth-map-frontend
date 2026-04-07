import { isPlatformBrowser } from '@angular/common';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function LangInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const platform = inject(PLATFORM_ID);
  let userID: any = '00119';
  if (isPlatformBrowser(platform) && localStorage.getItem('userID')) {
    userID = localStorage.getItem('userID');
  }

  const lang = inject(TranslateService).currentLang;
  const newReq = req.clone({
    headers: req.headers.append('Lang-Header', lang).append('Authorization', userID),
  });
  return next(newReq);
}

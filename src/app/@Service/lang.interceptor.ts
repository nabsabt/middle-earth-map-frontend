import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function LangInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const lang = inject(TranslateService).currentLang;
  const newReq = req.clone({
    headers: req.headers.append('Lang-Header', lang),
  });
  return next(newReq);
}

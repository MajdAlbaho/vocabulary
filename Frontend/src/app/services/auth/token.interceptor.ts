import { HttpRequest, HttpEvent, HttpHandlerFn, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export function TokenInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  var router = inject(Router);

  request = request.clone({
    withCredentials: true
  });

  return next(request).pipe(
    tap({
      next: () => { },
      error: (error: any) => {
        if (error.status == 401) {
          router.navigate(['login']);
        }
      }
    }));
}
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Subject, catchError, switchMap, filter, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';

let isRefreshing = false;
let refreshTokenSubject = new Subject<string | null>();

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const isAuthRequest = req.url.includes('/api/auth/');
  const isRefreshRequest = req.url.includes('/api/auth/refresh');

  req = req.clone({
    setHeaders: {
      'x-client-key': 'ClientKeyFromClientFlutterApp',
    },
  });

  if (token && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequest && !isRefreshRequest) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        return next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }));
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })))
    );
  }
}
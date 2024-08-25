import { HttpInterceptorFn } from '@angular/common/http'

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return next(clonedReq);
  }

  return next(req);
}
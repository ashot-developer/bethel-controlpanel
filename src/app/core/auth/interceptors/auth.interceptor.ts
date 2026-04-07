import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for auth endpoints
  if (req.url.includes('/auth/local')) {
    return next(req);
  }

  // Get token directly from localStorage to avoid circular dependency
  const token = localStorage.getItem('auth_token');

  // If token exists, clone the request and add Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // If no token, proceed with original request
  return next(req);
};
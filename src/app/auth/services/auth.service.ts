import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { BaseResponse, SignInResponse, SignUpResponse } from '../interfaces/response.interface';
import { SignInRequest } from '../interfaces/signin.interface';
import { ChatService } from '../../chat/services/chat.service';
import { User } from '../../chat/interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {

  private serviceUrl: string = 'http://localhost:9000/api';
  public loggedUser?: User;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  
  isAuthenticated(): Observable<boolean> {
    return this.me().pipe(
      map(response => {
        this.loggedUser = response.data;
        return !!this.loggedUser;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  me(): Observable<SignInResponse> {
    return this.http
      .get<SignInResponse>(`${this.serviceUrl}/users/me`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  signUp(request: FormData): Observable<SignUpResponse> {

    return this.http
      .post<SignUpResponse>(`${this.serviceUrl}/auth/signup`, request)
      .pipe(
        catchError(this.handleError)
      );;
  }

  signIn(requestBody: SignInRequest): Observable<SignInResponse> {

    return this.http
      .post<SignInResponse>(`${this.serviceUrl}/auth/signin`, requestBody, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    this.http
      .post<BaseResponse>(`${this.serviceUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.log('Logout failed', error);
          return of(null);
        })
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.router.navigate(['/login']);
        },
        error: () => console.log('An error occurred')
      });
  }

  handleError(error: HttpErrorResponse) {
    return throwError( () => error );
  }
}
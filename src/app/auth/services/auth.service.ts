import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { BaseResponse, SignInResponse, SignUpResponse } from '../interfaces/response.interface';
import { SignInRequest } from '../interfaces/signin.interface';
import { ChatService } from '../../chat/services/chat.service';
import { User } from '../../chat/interfaces/user.interface';
import { Router } from '@angular/router';
import { SignalRService } from '../../shared/services/signalr.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  private serviceUrl: string = 'http://localhost:9000/api';
  public loggedUser?: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private signalRService: SignalRService
  ) { }
  
  isAuthenticated(): Observable<boolean> {
    return this.me().pipe(
      map(response => {
        this.loggedUser = response.data;
        this.startNotifications();
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
          this.finishNotifications();
          this.router.navigate(['/login']);
        },
        error: () => console.log('An error occurred')
      });
  }

  startNotifications() {
    this.signalRService.startConnection();
    this.signalRService.addMessageListener();
  }

  finishNotifications() {
    this.signalRService.stopConnection();
  }

  handleError(error: HttpErrorResponse) {
    return throwError( () => error );
  }
}
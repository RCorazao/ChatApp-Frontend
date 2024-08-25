import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { MeResponse, SignInResponse, SignUpResponse } from '../interfaces/response.interface';
import { SignInRequest } from '../interfaces/signin.interface';
import { User } from '../../chat/interfaces/user.interface';
import { Router } from '@angular/router';
import { SignalRService } from '../../shared/services/signalr.service';
import { environment } from '../../../environments/environment.development';

@Injectable({providedIn: 'root'})
export class AuthService {

  private serviceUrl: string = environment.authUrl + '/api';
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

  me(): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(`${this.serviceUrl}/users/me`)
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
      .post<SignInResponse>(`${this.serviceUrl}/auth/signin`, requestBody)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.finishNotifications();
    this.router.navigate(['/login']);
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
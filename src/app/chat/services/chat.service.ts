import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

import { ChatMessageResponse, ChatResponse, MessageResponse } from '../interfaces/response.interface';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { User } from '../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class ChatService {

  private apiToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIkZ1bGxOYW1lIjoiUmVpc29uIENvcmF6YW8iLCJBdmF0YXIiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAvYXZhdGFycy81ODk1OGQ0Ny1jYjM5LTRhZjAtYTk2Yy0yODkxMmYxNWEyMTNfaW1hZ2VzLmpwZWciLCJuYmYiOjE3MjI0NTg5MjQsImV4cCI6MTcyMjU0NTMyNCwiaWF0IjoxNzIyNDU4OTI0fQ.gTC2wSPLmkk3EgwFVPECqXbODgB3bmQP8eiDm1cicGE';
  private serviceUrl: string = 'http://localhost:10000/api';

  public loggedUser: User = {
    id: 3,
    fullName: "Test User",
    email: "Test@gmail.com",
    avatar: "default-user.svg"
  };

  private _chatsSubject = new BehaviorSubject<Chat[] | []>([]);
  chats$ = this._chatsSubject.asObservable();
  
  private _currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this._currentChatSubject.asObservable();

  set chats(chats: Chat[]) {
    this._chatsSubject.next(chats);
  }

  get chats(): Chat[] {
    return this._chatsSubject.value;
  }

  set currentChat(chat: Chat | null) {
    this._currentChatSubject.next(chat);
  }

  get currentChat(): Chat | null {
    return this._currentChatSubject.value;
  }

  constructor(private http: HttpClient) { }

  getChats(): void {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.apiToken}`);

    this.http
      .get<ChatResponse>(`${this.serviceUrl}/chats`, { headers })
      .pipe(
        map(response => response.success ? response.data : []),
        tap(response => this._chatsSubject.next(response)),
        catchError( () => of([]) )
      ).subscribe(
        () => {},
        error => console.error('Error fetching chats ', error)
      );
  }

  getMessages(chatId: string, pageNumber: number = 1, pageSize: number = 20): Observable<Message[]> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.apiToken}`);

    const requestBody = {
      pageNumber,
      pageSize
    }

    return this.http
      .post<ChatMessageResponse>(`${this.serviceUrl}/chats/${chatId}`, requestBody, { headers })
      .pipe(
        map(response => response.success ? response.data.messages : []),
        catchError( () => of([]) )
      );
  }

  sendMessage(chatId: string, content: string): Observable<Message | null> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.apiToken}`);

    const requestBody = {
      chatId,
      content
    }

    return this.http
      .post<MessageResponse>(`${this.serviceUrl}/messages/`, requestBody, { headers })
      .pipe(
        map(response => response.success ? response.data : null)
      );
  }
  
}
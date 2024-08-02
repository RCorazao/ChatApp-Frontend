import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

import { ChatMessageResponse, ChatResponse, MessageResponse } from '../interfaces/response.interface';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../../shared/pages/services/auth.service';

@Injectable({providedIn: 'root'})
export class ChatService {

  private serviceUrl: string = 'http://localhost:10000/api';

  private _chatsSubject = new BehaviorSubject<Chat[] | []>([]);
  chats$ = this._chatsSubject.asObservable();
  
  private _currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this._currentChatSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get loggedUser(): User {
    return this.authService.loggedUser!;
  }

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


  getChats(): void {
    this.http
      .get<ChatResponse>(`${this.serviceUrl}/chats`, { withCredentials: true })
      .pipe(
        map(response => response.success ? response.data : []),
        tap(response => this._chatsSubject.next(response)),
        catchError( () => of([]) )
      ).subscribe(
        {
          next: () => console.log('Chats loaded'),
          error: () => console.log('Error fetching chats')      
        }
      );
  }

  getMessages(chatId: string, pageNumber: number = 1, pageSize: number = 30): Observable<Message[]> {
    const requestBody = {
      pageNumber,
      pageSize
    }

    return this.http
      .post<ChatMessageResponse>(`${this.serviceUrl}/chats/${chatId}`, requestBody, { withCredentials: true })
      .pipe(
        map(response => response.success ? response.data.messages : []),
        catchError( () => of([]) )
      );
  }

  sendMessage(chatId: string, content: string): Observable<Message | null> {
    const requestBody = {
      chatId,
      content
    }

    return this.http
      .post<MessageResponse>(`${this.serviceUrl}/messages/`, requestBody, { withCredentials: true })
      .pipe(
        map(response => response.success ? response.data : null)
      );
  }
  
}
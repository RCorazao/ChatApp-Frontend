import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { ChatMessageResponse, ChatResponse, MessageResponse, SearchResponse, UserContactResponse } from '../interfaces/response.interface';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../../auth/services/auth.service';
import { Notification } from '../interfaces/notification.interface';
import { SignalRService } from '../../shared/services/signalr.service';

@Injectable({providedIn: 'root'})
export class ChatService {

  private serviceUrl: string = 'http://localhost:10000/api';

  private _chatsSubject = new BehaviorSubject<Chat[] | []>([]);
  chats$ = this._chatsSubject.asObservable();
  
  private _currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this._currentChatSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {
    this.signalRService.messageReceived.subscribe( (notification: Notification) => {
      this.handleNewMessage(notification);
    });
  }

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

  getMessages(chatId: string, skip: number = 0, pageSize: number = 30): Observable<Message[]> {
    const requestBody = {
      skip,
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
      .post<MessageResponse>(`${this.serviceUrl}/messages`, requestBody, { withCredentials: true })
      .pipe(
        map(response => response.success ? response.data : null)
      );
  }

  handleNewMessage(notification: Notification) {
    let chat = this.chats.find( p => p.id === notification.chat.id );
    if (!chat) {
      chat = this.addChat(notification.chat);
    }

    this.addMessage(chat!, notification.message);
  }

  addMessage(chat: Chat, message: Message) {
    chat.messages[0] = message;
    this.chats.splice(this.chats.indexOf(chat), 1);
    this.chats.unshift(chat);
  }

  searchChats(filter: string, pageNumber: number = 0, pageSize: number = 20): Observable<UserContactResponse[]> {
    const requestBody = {
      filter,
      pageNumber,
      pageSize
    }

    return this.http
      .post<SearchResponse>(`${this.serviceUrl}/chats/search-chats`, requestBody, { withCredentials: true })
      .pipe(
        map(response => response.success ? response.data : []),
        catchError( () => of() )
      );
  }

  createChat( userId: number ): Observable<Chat | null> {
    const requestBody = {
      userId
    }

    return this.http
      .post<ChatMessageResponse>(`${this.serviceUrl}/chats/create-chat`, requestBody, { withCredentials: true })
      .pipe(
        map(response => response.success ? response.data : null),
        catchError( this.handleError )
      );
  }

  addChat(newChat: Chat): Chat {
    const currentChats = this._chatsSubject.value;
    const chatExists = currentChats.find(chat => chat.id === newChat.id);
    if (!chatExists) {
      const updatedChats = [...currentChats, newChat];
      this._chatsSubject.next(updatedChats);
      return newChat;
    }
    return chatExists;
  }

  handleError(error: HttpErrorResponse) {
    return throwError( () => error );
  }
}
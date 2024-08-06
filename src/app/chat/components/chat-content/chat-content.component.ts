import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatInformation } from '../../interfaces/chat-information.interface';
import { Chat } from '../../interfaces/chat.interface';
import { Subscription } from 'rxjs';
import { Message } from '../../interfaces/message.interface';
import { v4 as uuid } from 'uuid';
import { UserContactResponse } from '../../interfaces/response.interface';
import { SignalRService } from '../../../shared/services/signalr.service';
import { Notification } from '../../interfaces/notification.interface';

@Component({
  selector: 'chat-content',
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss'
})

export class ChatContentComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public currentChat: Chat | null = null;
  public messages: Message[] = [];
  public isOnTop: boolean = false;
  public searchChats: UserContactResponse[] = [];

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService
  ) {
    this.signalRService.messageReceived.subscribe( (notification: Notification) => {
      this.handleNewMessage(notification);
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.chatService.currentChat$.subscribe(chat => {
        this.currentChat = chat;
        this.messages = [];
        this.isOnTop = false;
        this.loadMessages();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get isChatLoaded(): boolean{
    return this.currentChat !== null;
  }

  chatHeader(): ChatInformation {
    if (this.currentChat!.type !== 0) {
      return {
        name: this.currentChat!.name
      }
    } else {
      let contact = this.currentChat!.users.find(u => u.id !== this.chatService.loggedUser.id);
      return {
        name: contact?.fullName,
        avatar: contact?.avatar
      }
    }   
  }

  public loadMessages(): void {  
    if (!this.isOnTop) {
      const countExpect = 30;
      if (this.currentChat) {
        this.chatService.getMessages(this.currentChat.id, this.messages.length, countExpect)
          .subscribe(
            messages => {
              messages.map( m => this.messages.push(m) )
              this.isOnTop = !(messages.length === countExpect);
            }
          );
      }
    }
  }

  sendMessage( content: string ) {
    if (this.currentChat) {
      const newMessage = this.buildMessage(content);
      this.messages.unshift(newMessage);

      this.chatService.sendMessage(newMessage.chatId, newMessage.content)
        .subscribe(
          result => {
            if (result) {
              newMessage.id = result.id;
              newMessage.createdAt = result.createdAt;
              this.chatService.addMessage(this.currentChat!, newMessage);
            } else {
              this.removeMessage(newMessage.id);
            }
          }
        );
    }
  }

  handleNewMessage(notification: Notification) {  
    const message = notification.message;
    if ( notification.isCurrentUser ) return;

    this.messages.unshift(message);
  }

  searchContact( value: string ) {
    if (!this.currentChat) {
      this.chatService.searchChats(value)
        .subscribe( response => {
          this.searchChats = response;
        } );
    }
  }

  // ============================================================

  private buildMessage( content: string ): Message {
    const tempId = uuid();
    const newMessage: Message = {
      id: tempId,
      userId: this.chatService.loggedUser.id,
      chatId: this.currentChat!.id,
      content: content,
      createdAt: new Date().toDateString()
    }
    return newMessage;
  }

  private removeMessage(id: string) {
    const index =  this.messages.findIndex(message => message.id === id);
    this.messages.splice(index, 1);
  }
}

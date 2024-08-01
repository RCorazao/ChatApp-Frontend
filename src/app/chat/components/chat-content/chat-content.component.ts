import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatInformation } from '../../interfaces/chat-information.interface';
import { Chat } from '../../interfaces/chat.interface';
import { Subscription } from 'rxjs';
import { Message } from '../../interfaces/message.interface';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'chat-content',
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss'
})

export class ChatContentComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public currentChat: Chat | null = null;
  public messages: Message[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.subscription.add(
      this.chatService.currentChat$.subscribe(chat => {
        this.currentChat = chat;
        this.messages = [];
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

  private loadMessages(): void {
    if (this.currentChat) {
      this.chatService.getMessages(this.currentChat.id)
        .subscribe(
          messages => {
            messages.map( m => this.messages.push(m) )
          }
        );
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
              this.currentChat!.messages[0] = newMessage;
            } else {
              this.removeMessage(newMessage.id);
            }
          }
        );
    }
  }

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

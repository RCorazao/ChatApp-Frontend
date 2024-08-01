import { Component, Input } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'chat-card',
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss'
})
export class ChatCardComponent {
  @Input()
  public chat!: Chat;
  public currentUser: number = 3;

  constructor ( private chatService: ChatService ) { }

  get contact(): User | null {
    return this.chat.type !== 0 
      ? null 
      : this.chat.users.find(user => user.id !== this.currentUser) ?? null;
  }

  get lastMessage(): Message | null {
    return this.chat.messages[0];
  }

  changeChat(){
    this.chatService.currentChat = this.chat;
  }

}

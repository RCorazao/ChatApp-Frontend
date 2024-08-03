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

  constructor ( private chatService: ChatService ) { }



  get contact(): User | null {
    return this.chat.type !== 0 
      ? null 
      : this.chat.users.find(user => user.id !== this.chatService.loggedUser.id) ?? null;
  }

  get lastMessage(): Message | null {
    return this.chat.messages[0];
  }

  isCurrentChat(): boolean {
    return this.chat.id === this.chatService.currentChat?.id;
  }

  changeChat(){
    if (!this.isCurrentChat())
      this.chatService.currentChat = this.chat;
  }

}

import { Component, Input } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {

  @Input()
  public chats: Chat[] = [];

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatInformation } from '../../interfaces/chat-information.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {

  @Input()
  public chat!: ChatInformation;

  constructor ( private chatService: ChatService ) { }

  exitChat() {
    this.chatService.currentChat = null;
  }

}

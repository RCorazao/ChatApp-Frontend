import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'chat-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit {

  @Input()
  public messages: Message[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

}

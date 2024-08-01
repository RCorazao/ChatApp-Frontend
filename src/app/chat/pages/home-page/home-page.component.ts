import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  constructor( private chatService: ChatService ) {}

  ngOnInit(): void {
    this.chatService.getChats();
  }

}

import { Component, Input } from '@angular/core';
import { UserContactResponse } from '../../interfaces/response.interface';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';

@Component({
  selector: 'chat-search-list',
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.scss'
})
export class SearchListComponent {

  @Input()
  public searchList: UserContactResponse[] = [];

  constructor ( private chatService: ChatService ) { }

  createChat( userId: number ) {
    this.chatService.createChat( userId )
      .subscribe( response => {
        if ( response ) {
          this.chatService.currentChat = response;
          this.chatService.addChat(response);
        } else {
          console.log('Invalid chat');       
        }
      });
  }


}

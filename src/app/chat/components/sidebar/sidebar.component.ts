import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'chat-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public chats: Chat[] = [];

  constructor (
    private chatService: ChatService
  ) {  }

  ngOnInit(): void {
    this.subscription.add(
      this.chatService.chats$.subscribe(chats => {
        this.chats = chats;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

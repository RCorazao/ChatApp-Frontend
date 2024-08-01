import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnChanges {

  public isOwner: boolean = false;
  
  @Input()
  public message!: Message;

  constructor( private chatService: ChatService ){ }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && changes['message'].currentValue) {
      this.checkOwnership();
    }
  }

  get owner(): number {
    return this.chatService.loggedUser.id;
  }

  private checkOwnership(): void {
    if (this.message) {
      this.isOwner = this.owner === this.message.userId;
    }
  }

}

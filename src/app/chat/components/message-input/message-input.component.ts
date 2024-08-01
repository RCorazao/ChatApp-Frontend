import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-message-input',
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {

  message: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  sendMessage() {
    if (this.message.trim()) {
      this.onValue.emit(this.message);
      this.message = '';
    }
  }

}

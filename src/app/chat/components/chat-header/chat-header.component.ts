import { Component, Input, OnInit } from '@angular/core';
import { ChatInformation } from '../../interfaces/chat-information.interface';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {

  @Input()
  public chat!: ChatInformation;

}

import { Component, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Message } from '../../interfaces/message.interface';


@Component({
  selector: 'chat-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent {

  @Input()
  public messages: Message[] = [];

  @Output()
  public notify: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  scrollPosition = 0;

  ngAfterViewInit() {
    this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    const element = this.scrollContainer.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const scrolledToBottom = Math.abs(scrollTop) + clientHeight >= scrollHeight;

    if (scrolledToBottom) {
      this.notify.emit();
    }  
  }
}

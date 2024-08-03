import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../../shared/pages/services/auth.service';

@Component({
  selector: 'chat-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public chats: Chat[] = [];
  public isMenuOpen = false;

  @ViewChild('menuContainer', { static: false }) menuContainer!: ElementRef;

  constructor (
    private chatService: ChatService,
    private authService: AuthService
  ) {  }

  ngOnInit(): void {
    this.subscription.add(
      this.chatService.chats$.subscribe(chats => {
        this.chats = chats;
      })
    );
  }

  get user(): User {
    return this.chatService.loggedUser;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  disconnect() {
    this.toggleMenu();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isMenuOpen && !this.menuContainer.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

}

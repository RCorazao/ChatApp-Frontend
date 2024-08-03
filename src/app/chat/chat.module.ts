import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatCardComponent } from './components/chat-card/chat-card.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatContentComponent } from './components/chat-content/chat-content.component';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageComponent } from './components/message/message.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchListComponent } from './components/search-list/search-list.component';



@NgModule({
  declarations: [
    HomePageComponent,
    SidebarComponent,
    ChatCardComponent,
    ChatListComponent,
    ChatContentComponent,
    ChatHeaderComponent,
    MessageListComponent,
    MessageComponent,
    MessageInputComponent,
    SearchInputComponent,
    SearchListComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HomePageComponent
  ]
})
export class ChatModule { }

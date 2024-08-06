import { Chat } from "./chat.interface";
import { Message } from "./message.interface";

export interface Notification {
  isCurrentUser: boolean;
  chat: Chat;
  message: Message;
}

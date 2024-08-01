import { Chat } from "./chat.interface";
import { Message } from "./message.interface";

export interface MessageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Message;
}

export interface ChatResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Chat[];
}

export interface ChatMessageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Chat;
}
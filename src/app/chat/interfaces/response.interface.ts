import { Chat } from "./chat.interface";
import { Message } from "./message.interface";
import { User } from "./user.interface";

export interface BaseResponse {
  statusCode: number;
  success: boolean;
  message: string;
}
export interface MessageResponse extends BaseResponse {
  data: Message;
}

export interface ChatResponse extends BaseResponse  {
  data: Chat[];
}

export interface ChatMessageResponse extends BaseResponse  {
  data: Chat;
}

export interface SearchResponse extends BaseResponse {
  data: UserContactResponse[];
}

export interface UserContactResponse extends User {
  isContact: boolean;
}
import { Message } from "./message.interface";
import { User } from "./user.interface";

export interface Chat {
  id: string;
  name?: string;
  type: number;
  users: User[];
  messages: Message[];
}

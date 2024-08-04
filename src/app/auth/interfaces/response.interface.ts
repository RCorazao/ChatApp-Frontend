import { User } from '../../chat/interfaces/user.interface';

export interface BaseResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface SignInResponse extends BaseResponse {
  data: User;
}

export interface SignUpResponse {
  succeeded: boolean;
  data?: any;
  errors?: { [key: string]: string };
}
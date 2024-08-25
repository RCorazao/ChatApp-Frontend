import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Notification } from '../../chat/interfaces/notification.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: signalR.HubConnection;
  public messageReceived = new EventEmitter<Notification>();

  public startConnection() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Error)
      .withUrl( environment.chatUrl + '/notificationHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ' + err));

    this.hubConnection.onreconnected(connectionId => {
      console.log('SignalR reconnected: ', connectionId);
    });

    this.hubConnection.onclose(err => {
      console.log('SignalR connection closed: ', err);
    });
  }

  public addMessageListener() {
    this.hubConnection?.on('NewMessage', (notification: Notification) => {
      this.messageReceived.emit(notification);
    });
  }

  public stopConnection() {
    this.hubConnection?.stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(err => console.log('Error while stopping SignalR connection: ' + err));
  }

}

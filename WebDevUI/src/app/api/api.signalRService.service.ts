// import { EventEmitter, Injectable } from '@angular/core';
// import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
// import { ApiConst } from './api.baseurlconst.service';

// @Injectable()
// export class SignalrService {
//     public notiUrl: string = 'notify';
//     messageReceived = new EventEmitter<any>();
//     //connectionEstablished = new EventEmitter<Boolean>();

//     public _apiHost: any;
//     public apiHost: string;

//     //private connectionIsEstablished = false;
//     private _hubConnection: HubConnection;

//     constructor() {
//         this._apiHost=new ApiConst();
//         var lHost = this._apiHost.autohost('');
//         this.apiHost=lHost+this.notiUrl;
//         this.createConnection();
//         this.registerOnServerEvents();
//         this.startConnection();
//     }

//     // sendMessage(message: any) {
//     //     this._hubConnection.invoke('NewMessage', message);
//     // }

//     private createConnection() {
//         this._hubConnection = new HubConnectionBuilder()
//             .withUrl(this.apiHost)
//             .build();
//     }

//     private startConnection(): void {
//         this._hubConnection
//             .start()
//             .then(() => {
//                 //this.connectionIsEstablished = true;
//                 console.log('Hub connection started');
//                 //this.connectionEstablished.emit(true);
//             })
//             .catch(err => {
//                 console.log('Error while establishing connection, retrying...');
//                 setTimeout(function () { this.startConnection(); }, 5000);
//             });
//     }

//     private registerOnServerEvents(): void {
//         this._hubConnection.on('BroadcastMessage', (data: any) => {
//             debugger;
//             this.messageReceived.emit(data);
//         });
//     }
// }

import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { ApiConst } from './api.baseurlconst.service';
@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    messageReceived = new EventEmitter<any>();
    public _apiHost: any;
    public apiHost: string;
    public notiUrl: string = 'notify';
    public chatHistoryList: any;
    constructor() {
        this._apiHost = new ApiConst();
        var lHost = this._apiHost.autohost('');
        this.apiHost = lHost + this.notiUrl;
        this.startConnection();
        this.addBroadcastChatListener();
    }

    private hubConnection: signalR.HubConnection
    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.apiHost)
            .build();
        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err))
    }

    public addBroadcastChatListener = () => {
        this.hubConnection.on('BroadcastMessage', (data) => {
            debugger;
            if (data != '' && data != null) {
                this.messageReceived.emit(data);
            }
        });
    }
}
import { WebSocketServer } from "ws";

export interface IFrontResponse {
    data: string;
    id: number;
    type: string;
}

export interface IPlayer {
    userPassword: string;
    userID: string;
    wsClient: WebSocket;
}

export interface IRoomUser {
    name: string;
    index: string;
}

export interface IRoom {
    roomId: number;
    roomUsers: IRoomUser[];
}

export interface IDatabase {
    players: { [key: string]: IPlayer };
    rooms: IRoom[];
    games: any[][];
}

export interface IDataFront {
    indexRoom: any;
    password: string;
    name: string;
    gameId: number;
    ships: any; // Можете указать более конкретный тип в зависимости от структуры ships
    id: number;
    // Другие свойства dataFront, если они есть
}

export interface IWebSocketWithID extends WebSocket {
    name: string;
    id: string;
}
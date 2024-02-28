import { IWebSocketWithID } from './../../interfaces/interfaces';
import WebSocket from "ws";
import { WebSocketServer } from "ws";
import { IDataFront, IDatabase } from "../../interfaces/interfaces";
import {
    updateDB
} from "../../ws_server/index";


export let addUser = (DB: IDatabase, dataFront: IDataFront, wsClient: IWebSocketWithID, wss: WebSocketServer) => {
    const reqRoomIndex = dataFront.indexRoom;
    let readyToPlay: string[] = [];

    DB.rooms.forEach((room, i) => {
        if (room.roomId === reqRoomIndex) {
            DB.rooms[i].roomUsers.push({
                name: wsClient.name,
                index: wsClient.id
            });
            readyToPlay = [DB.rooms[i].roomUsers[0].index, DB.rooms[i].roomUsers[1].index];
        }
        if (room.roomId !== reqRoomIndex && room.roomUsers[0].name === wsClient.name) {
            DB.rooms[i].roomUsers.splice(i); // Проверьте, нужно ли вам использовать splice() или нет
        }
    });

    updateDB(DB);

    // Преобразуем коллекцию в массив и итерируем по нему с помощью for...of цикла
    const clientsArray = Array.from(wss.clients) as (WebSocket & IWebSocketWithID)[];
    for (const client of clientsArray) {
        // Проверяем, есть ли у клиента свойство id
        if (client.readyState === WebSocket.OPEN && client.id === wsClient.id) {
            const req = {
                type: "create_game",
                data: JSON.stringify({
                    idGame: reqRoomIndex,
                    idPlayer: readyToPlay[1],
                }),
                id: 0,
            };
            client.send(JSON.stringify(req));
        }
        if (client.readyState === WebSocket.OPEN && client.id === wsClient.id) {
            const req = {
                type: "create_game",
                data: JSON.stringify({
                    idGame: reqRoomIndex,
                    idPlayer: readyToPlay[0],
                }),
                id: 0,
            };
            client.send(JSON.stringify(req));
        }
    }

    const updRoomRes = {
        type: "update_room",
        data: JSON.stringify(DB.rooms.filter(room => {
            room.roomUsers.length < 2;
        })),
        id: 0,
    };
    wsClient.send(JSON.stringify(updRoomRes));
};
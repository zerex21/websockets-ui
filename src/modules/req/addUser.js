import WebSocket from "ws";

import {
    updateDB
} from "../../ws_server/index.js";


export let addUser = (DB, dataFront, wsClient, wss) => {
    const reqRoomIndex = dataFront.indexRoom;
    let readyToPlay = [];

    DB.rooms.forEach((room, i) => {
        if (room.roomId === reqRoomIndex) {
            DB.rooms[i].roomUsers.push({
                name: wsClient.name,
                index: wsClient.id
            });
            readyToPlay = [DB.rooms[i].roomUsers[0].index, DB.rooms[i].roomUsers[1].index];
        }
        if (room.roomId !== reqRoomIndex && room.roomUsers[0].name === wsClient.name) {
            DB.rooms[i].roomUsers.splice(i); //arr.splice(i) пересмотреть
        }
    })

    updateDB(DB);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.id === readyToPlay[0]) {
            const req = {
                type: "create_game",
                data: JSON.stringify({
                    idGame: reqRoomIndex,
                    idPlayer: readyToPlay[1],

                }),
                id: 0,
            };
            client.send(JSON.stringify(req));
        };
        if (client.readyState === WebSocket.OPEN && client.id === readyToPlay[1]) {
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
    })

    const updRoomRes = {
        type: "update_room",
        data: JSON.stringify(DB.rooms.filter(room => {
            room.roomUsers.length < 2;
        })),
        id: 0,
    };
    wsClient.send(JSON.stringify(updRoomRes));
}
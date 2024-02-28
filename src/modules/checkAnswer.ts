import { IWebSocketWithID } from './../interfaces/interfaces';
import {
    updateDB
} from "../ws_server/index";
import { WebSocketServer} from "ws";
import {
    addShip
} from "./req/addShip";
import {
    registration
} from "./req/registration";
import {
    createRoom
} from "./req/createRoom";
import {
    addUser
} from "./req/addUser";
import { IDataFront, IDatabase } from "../interfaces/interfaces";



export let checkAnswer = (message: any, wsClient: IWebSocketWithID, wss: WebSocketServer) => {
    const frontRes = JSON.parse(message.toString());

    let dataFront:IDataFront | undefined;
    if (frontRes.data !== '') {
        dataFront = JSON.parse(frontRes.data);
    }
    const id = frontRes.id;
    console.log('id', frontRes.id)

    const DB:IDatabase = updateDB();

    switch (frontRes.type) {
        case "reg":
            registration(DB, dataFront!, wsClient, id)
            break;

        case "create_room":
            createRoom(DB, dataFront!, wsClient)
            break;

        case "add_user_to_room":
            addUser(DB, dataFront!, wsClient, wss)
            break;

        case 'add_ships':
            addShip(DB, dataFront!, wsClient)
            break;
    }
}
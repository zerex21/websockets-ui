import { IWebSocketWithID } from './../../interfaces/interfaces';
import {
    updateDB
} from "../../ws_server/index";
import { IDataFront, IDatabase } from "../../interfaces/interfaces";


export let registration = (DB:IDatabase, dataFront:IDataFront, wsClient:IWebSocketWithID, id:number) => {
    const userName = dataFront.name;
    const userPassword = dataFront.password;

    const playersDB = DB.players;

    if (playersDB[userName] === undefined) {
        const userID = wsClient.id;
        wsClient.name = userName;
        playersDB[userName] = {
            userPassword,
            userID,
            wsClient
        };
        updateDB(DB);
        const serverAnswer = {
            type: 'reg',
            data: JSON.stringify({
                name: userName,
                index: id,
                error: false,
                errorText: '',
            }),
            id: 0,
        }
        wsClient.send(JSON.stringify(serverAnswer));
    } else if (playersDB[userName].userPassword === userPassword) {
        const serverAnswer = {
            type: 'reg',
            data: JSON.stringify({
                name: userName,
                index: id,
                error: false,
                errorText: '',
            }),
            id: 0,
        }
        wsClient.send(JSON.stringify(serverAnswer));
    } else {
        const serverAnswer = {
            type: 'reg',
            data: JSON.stringify({
                name: userName,
                index: id,
                error: true,
                errorText: 'password is incorrect',
            }),
            id: 0,
        }
        wsClient.send(JSON.stringify(serverAnswer));
    }
}
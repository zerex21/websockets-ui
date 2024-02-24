import {
    updateDB
} from "../../ws_server/index.js";


export let registration = (DB, dataFront, wsClient, id) => {
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
import {
    updateDB
} from "../ws_server/index.js";

import {
    addShip
} from "./req/addShip.js";
import {
    registration
} from "./req/registration.js";
import {
    createRoom
} from "./req/createRoom.js";
import {
    addUser
} from "./req/addUser.js";



export let checkAnswer = (message, wsClient, wss) => {
    const frontRes = JSON.parse(message.toString());

    let dataFront = '';
    if (frontRes.data !== '') {
        dataFront = JSON.parse(frontRes.data);
    }
    const id = frontRes.id;
    console.log('id', frontRes.id)

    const DB = updateDB();

    switch (frontRes.type) {
        case "reg":
            registration(DB, dataFront, wsClient, id)
            break;

        case "create_room":
            createRoom(DB, dataFront, wsClient)
            break;

        case "add_user_to_room":
            addUser(DB, dataFront, wsClient, wss)
            break;

        case 'add_ships':
            addShip(DB, dataFront, wsClient)
            break;
    }
}
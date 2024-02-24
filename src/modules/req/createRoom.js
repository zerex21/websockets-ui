import {
    updateDB
} from "../../ws_server/index.js";

export let createRoom = (DB, dataFront, wsClient) => {
    Object.keys(DB.players).forEach(playerName => {
        if (DB.players[playerName].wsClient === wsClient) {
            //userName = playerName;
            DB.rooms.push({
                roomId: DB.rooms.length,
                roomUsers: [{
                    name: playerName,
                    index: wsClient.id,
                }],
            })
        }
    })

    const serverAnswer = {
        type: "update_room",
        data: JSON.stringify(DB.rooms),
        id: 0,
    };
    wsClient.send(JSON.stringify(serverAnswer));
}
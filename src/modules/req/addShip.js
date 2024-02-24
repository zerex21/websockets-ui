import {
    updateDB
} from "../../ws_server/index.js";


export let addShip = (DB, dataFront, wsClient) => {
    DB.games[dataFront.gameId][0] = dataFront.ships;
    updateDB(DB);

    const res = {
        type: "start_game",
        data: JSON.stringify({
            ships: dataFront.ships,
            currentPlayerIndex: dataFront.id,
        }),
        id: 0,
    };
    wsClient.send(JSON.stringify(res));
}
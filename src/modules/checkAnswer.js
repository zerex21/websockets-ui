import {
    /* sockets, */
    updateDB
} from "../ws_server/index.js";
import {
    randomUUID
} from "crypto";
const activePlayers = [];
const games = {};
let idGames = 0;
let indxRoom = 0

/* let DB = {
    players: [],
    rooms: [],
    games: [
        []
    ],
};
 */


export let initGame = (ws, gameId) => {
    if (!games[gameId]) {
        games[gameId] = [ws]
    }

    if (games[gameId] && games[gameId].length < 2) {
        games[gameId] = [...games[gameId], ws]
    }

    if (games[gameId] && games[gameId].length === 2) {
        games[gameId] = games[gameId].filter(wsc => wsc.name !== ws.name)
        games[gameId] = [...games[gameId], ws]
    }
}


export let checkAnswer = (message, wsClient) => {
    const frontRes = JSON.parse(message.toString());
    /*   const player = {
          index: wsClient.index,
          userName: '',
          password: '',
          ships: [],
          attackCell: [],
          socket: wsClient
      } */


    let dataFront = '';
    if (frontRes.data !== '') {
        dataFront = JSON.parse(frontRes.data);
    }
    const id = frontRes.id;
    console.log('id', frontRes.id)


    switch (frontRes.type) {
        case "reg":
            /*   const dataFront = JSON.parse(frontRes.data); */


            /*  player.userName = dataFront.name;
             player.userName = dataFront.password; */

            const userName = dataFront.name;
            const userPassword = dataFront.password;
            const DB = updateDB();
            const playersDB = DB.players;
            /*   let serverAnswer = {}; */


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






            /* if (!activePlayers.find(player => player === dataFront.name)) {
                activePlayers.push(dataFront.name);
                serverAnswer = {
                    type: frontRes.type,
                    data: JSON.stringify({
                        name: player.userName,
                        index: player.index,
                        error: false,
                        message: ''
                    }),
                    id: 0
                }
            } else
                serverAnswer = {
                    type: frontRes.type,
                    data: JSON.stringify({
                        name: '',
                        index: '',
                        error: true,
                        message: 'The user exists'
                    }),
                    id: 0
                }

            wsClient.send(JSON.stringify(serverAnswer));
            updateRoom(); */
            break;

        case "create_room":
            let createRoom = {};
            idGames += 1
            games[idGames] = activePlayers
            createRoom = {
                type: "create_game",
                data: JSON.stringify({
                    idGame: idGames,
                    idPlayer: player.index,
                }),
                id: 0
            }
            console.log('room', games)
            wsClient.send(JSON.stringify(createRoom));
            updateRoom();
            break;

        case "add_player":
            const dataRoom = JSON.parse(frontRes.data);
            games[dataRoom.indexRoom].addPLayer(player);
            break;
    }
}

const updateRoom = () => {
    const updateRoom = {
        type: "update_room",
        data: JSON.stringify(
            Object.keys(games).map((gameId) => {
                const idNumber = Number(gameId);
                return {
                    roomId: idNumber,
                    roomUsers: [{
                        name: games[idNumber].playerOne.userName,
                        index: games[idNumber].playerOne.index
                    }]

                }
            })
        )
    }
    sockets.map(socket => socket.send(JSON.stringify(updateRoom)));
}

/* export const updateDB = (dbInstance = DB) => {
    DB = dbInstance;
    console.log(DB);
    return DB;
} */
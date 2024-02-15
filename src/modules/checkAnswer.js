import {
    sockets
} from "../ws_server/index.js";

const activePlayers = [];
const games = {};
let idGame = 0;



export let checkAnswer = (message, wsClient) => {

    const player = {
        index: wsClient.index,
        userName: '',
        password: '',
        ships: [],
        attackCell: [],
        socket: wsClient
    }



    const frontRes = JSON.parse(message /* .toString() */ )

    switch (frontRes.type) {
        case "reg":

            const dataFront = JSON.parse(frontRes.data);
            player.userName = dataFront.name;
            player.password = dataFront.password;
            let serverReply = {};

            if (!activePlayers.find(player => player === dataFront.name)) {
                activePlayers.push(dataFront.name);
                serverReply = {
                    type: "reg",
                    data: JSON.stringify({
                        name: player.userName,
                        index: player.index,
                        error: false,
                        message: 'The user was created'
                    }),
                    id: 0
                }
            } else
                serverReply = {
                    type: "reg",
                    data: JSON.stringify({
                        name: '',
                        index: '',
                        error: true,
                        message: 'This user exists'
                    }),
                    id: 0
                }

            wsClient.send(JSON.stringify(serverReply));
            updateRoom();
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
    /*   console.log(sockets) */
    sockets.map(socket => socket.send(JSON.stringify(updateRoom)));
}
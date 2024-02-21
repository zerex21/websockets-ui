import {
    WebSocketServer
} from "ws";
import {
    checkAnswer,
    initGame,
} from "../modules/checkAnswer.js";
import {
    randomUUID
} from "crypto";

/* export const sockets = []; */

let DB = {
    players: {},
    rooms: [],
    games: [
        []
    ],
};

/* let gameId = 1; */

export const start_WSS = () => {
    const WSS_PORT = 3000;

    const wss = new WebSocketServer({
            port: WSS_PORT
        },
        () => console.log('Start Web Socket server on the 3000 port!'));

    wss.on("connection", (wsClient) => {
        console.log('connection')
        wsClient.id = randomUUID();
        /*  wsClient.index = Math.floor(Math.random() * Date.now());
         sockets.push(wsClient);
         console.log(sockets.length) */

        wsClient.on('message', async (message) => {
            console.log(JSON.parse(message))
            /* const req = JSON.parse(message.toString()) */
            checkAnswer(message, wsClient, wss)
            /*      console.log('getData from Client', JSON.parse(message))
                console.log('sockets', sockets) */




            /* wsClient.send(JSON.stringify(message))
             */
        })


        wsClient.on('close', async (message) => {
            console.log('close')
        })
    })
}

export const updateDB = (dbInstance = DB) => {
    DB = dbInstance;
    console.log(DB);
    return DB;
}
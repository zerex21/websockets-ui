import {
    WebSocketServer
} from "ws";
import {
    checkAnswer,
} from "../modules/checkAnswer.js";
import {
    randomUUID
} from "crypto";


let DB = {
    players: {},
    rooms: [],
    games: [
        []
    ],
};


export const start_WSS = () => {
    const WSS_PORT = 3000;

    const wss = new WebSocketServer({
            port: WSS_PORT
        },
        () => console.log('Start Web Socket server on the 3000 port!'));

    wss.on("connection", (wsClient) => {
        console.log('connection')
        wsClient.id = randomUUID();

        wsClient.on('message', async (message) => {
            checkAnswer(message, wsClient, wss)
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
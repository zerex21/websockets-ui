import {
    WebSocketServer
} from "ws";
import {
    checkAnswer,
} from "../modules/checkAnswer.js";


export const sockets = [];

export const start_WSS = () => {
    const WSS_PORT = 3000;

    const wss = new WebSocketServer({
            port: WSS_PORT
        },
        () => console.log('Start Web Socket server on the 3000 port!'));

    wss.on("connection", (wsClient) => {
        console.log('connection')

        sockets.push(wsClient);
        wsClient.index = Math.floor(Math.random() * Date.now());

        wsClient.on('message', async (message) => {
            /*  console.log('getData from Client', JSON.parse(message)) */
            /* console.log('sockets', sockets) */
            /* console.log(sockets) */
            checkAnswer(message, wsClient)

            /* wsClient.send(JSON.stringify(message)) */

        })


        wsClient.on('close', async (message) => {
            console.log('close')
        })
    })
}
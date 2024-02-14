import WebSocket from "ws";
import {
    WebSocketServer
} from "ws";
/* import { ExtWebSocket } from "./types";
import { games, requestProcessing } from "./utils/requestProcessing"; */


export const sockets = [];

export const start_WSS = () => {
    const WSS_PORT = 3000;

    /* const wss = new WebSocketServer({
        WSS_PORT
    })

    wss.on('connection', (ws) => {

        ws.on('message', (data) => {
            console.log('asdasd')
        })

        ws.send('Hello')
    }) */

    const wss = new WebSocketServer({
            port: WSS_PORT
        },
        () => console.log('Start Web Socket server on the 3000 port!'));

    wss.on("connection", (wsClient) => {
        console.log('connection')
        sockets.push(wsClient);
        wsClient.index = Math.floor(Math.random() * Date.now());

        wsClient.on('message', async (message) => {
            console.log(JSON.parse(message))

        })

        wsClient.on('close', async (message) => {
            console.log('close')
        })
    })
}
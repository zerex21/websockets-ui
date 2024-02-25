import { WebSocketServer } from "ws";
import {
    checkAnswer,
} from "../modules/checkAnswer";
import {
    randomUUID
} from "crypto";
import { IDatabase, IWebSocketWithID } from "../interfaces/interfaces";



let DB:IDatabase = {
    players: {},
    rooms: [],
    games: [
        []
    ],
};

const clients: { [id: string]:IWebSocketWithID} = {};
export const start_WSS = () => {
    const WSS_PORT = 3000;

    const wss = new WebSocketServer({
            port: WSS_PORT
        },
        () => console.log('Start Web Socket server on the 3000 port!'));

    wss.on("connection", (wsClient: IWebSocketWithID) => {

        console.log('connection')
        const id = randomUUID();
        clients[id] = wsClient

        wsClient.addEventListener("message", async (event) => {
            checkAnswer(event.data, wsClient, wss);
        });

        wsClient.addEventListener("close", async (event) => {
            console.log('close', event.code, event.reason);
            delete clients[id]; // Удаляем клиента из объекта при закрытии соединения
        });
    })
}

export const updateDB = (dbInstance:IDatabase = DB):IDatabase => {
    DB = dbInstance;
    console.log(DB);
    return DB;
}
import {
    httpServer
} from "./src/http_server/index";

import {
    start_WSS
} from "./src/ws_server/index";

const HTTP_PORT = 8181;


const localhost = `http://localhost:${HTTP_PORT}/`
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}. Go to ${localhost}`)
})
start_WSS()
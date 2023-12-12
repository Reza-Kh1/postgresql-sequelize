import http from "http"
import app from "./app/app.js"
const port = 5000
const hostName = "localhost"
const server = http.createServer(app)
server.listen(port,hostName,()=>{
    console.log(`server run port ${port} ${hostName}`);
})
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import {Server, Socket} from "socket.io"
import {createServer} from "http"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import routes from './routes/index'
import path from "path"

import './config/dataBase'


const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser())

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", req.header('Origin'));
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//     next();
// });



const http = createServer(app)
export const io = new Server(http)
import {SocketServer} from "./config/socket";


io.on("connection",(socket: Socket) => {
    SocketServer(socket)
})




app.use('/api', routes)




if(process.env.NODE_ENV === 'production'){
    app.use(express.static('index.html'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'))
    })
}


const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})
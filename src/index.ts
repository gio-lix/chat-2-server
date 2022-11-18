import dotenv from 'dotenv'
import express from 'express'
import {Server, Socket} from "socket.io"
import {createServer} from "http"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import routes from './routes/index'



const app = express()

dotenv.config()
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


io.on("connection",(socket: Socket) => {
    SocketServer(socket)
})



// Routes
app.use('/api', routes.authRouter)
app.use('/api', routes.userRouter)
app.use('/api', routes.categoryRouter)
app.use('/api', routes.blogRouter)
app.use('/api', routes.commentRouter)





// Database
import '../src/config/dataBase'
import {SocketServer} from "./config/socket";


const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})
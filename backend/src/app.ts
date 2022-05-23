import express, {Request, Response, NextFunction, Application} from 'express'
import http from 'http'
import useMongodb from './database/mongodb_database'
import morgan from 'morgan'
import bodyParser from 'body-parser'

// Import controllers
import gameController from './controllers/game_controller'

const app: Application = express()
const port: number|string = process.env.PORT || 3017

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
  }
  next()
})

// Routes which should handle requests
app.use("/game", gameController)

app.use((
    req: Request, 
    res:Response, 
    next: NextFunction
    ) => {
        const error: any = new Error("Not found")
        error.status = 404
        next(error)
    })

app.use((err: any ,req: Request, res: Response, next: NextFunction) => {
    res.status( err?.status || 500)
    res.send({
        status: err?.status || 500,
        message: err?.message,
    })
    next()
})

const { connectDB } = useMongodb()

connectDB()

const server: http.Server = http.createServer(app)

server.listen(port)
console.log(`🚀 Server ready at http://localhost:${port}`)
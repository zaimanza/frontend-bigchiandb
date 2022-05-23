import express, {Request, Response, NextFunction, Application} from 'express'
import { Server } from 'http'

const app: Application = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("hello")
})

app.use((err: any ,req: Request, res: Response, next: NextFunction) => {
    res.status( err.status || 500)
    res.send({
        status: err.status || 500,
        message: err.message,
    })
    next()
})

const server: Server = app.listen(3017,() => console.log("server on port 3000"))
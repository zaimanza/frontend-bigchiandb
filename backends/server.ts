import http from 'http'
import app from './app'
import useMongodb from './database/mongodb_database'

const { connectDB } = useMongodb()

connectDB()
const port: number|string = process.env.PORT || 3000

const server: http.Server = http.createServer(app)

server.listen(port)
console.log(`🚀 Server ready at http://localhost:${port}`)
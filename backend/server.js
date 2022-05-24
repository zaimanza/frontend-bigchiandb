const http = require('http');
const app = require('./app');
const useMongodb = require("./modules/useMongodb");

const { connectDB } = useMongodb()

connectDB()

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log(`🚀 Server ready at http://localhost:${port}`);
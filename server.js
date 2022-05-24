const http = require('http');
const useMongodb = require("./modules/useMongodb")
const usePlayer = require('./modules/usePlayer')

const { connectDB } = useMongodb()
const { player_login, player_register } = usePlayer()
connectDB()

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const playerRoutes = require("./controllers/player");
const gameRoutes = require("./controllers/game");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next()
})

// set the view engine to ejs
app.set('view engine', 'ejs')

// Routes which should handle requests
app.use("/player", playerRoutes)
app.use("/game", gameRoutes)

// index page
app.get('/login', async (req, res) => {
    const register_result = await player_login({
        mnemonic: "moment conduct device congress awkward grain team gas flight option culture sign"
    })
    console.table(register_result)
    res.render('pages/index')
})
app.get('/register', async (req, res) => {
    const register_result = await player_register()
    console.table(register_result)
    res.render('pages/index')
})
app.get('/start_game', async (req, res) => {

    res.render('pages/index')
})

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log(`🚀 Server ready at http://localhost:${port}`);
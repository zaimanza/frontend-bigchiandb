import morgan from 'morgan'
import bodyParser from 'body-parser'
import express, { Express, NextFunction, Request, Response } from 'express'
const app: Express = express()

// Import controllers
import gameController from './controllers/game_controller'

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/game", gameController);

app.use((
    req: Request, 
    res:Response, 
    next: NextFunction
    ) => {
        const error: Error = new Error("Not found");
        //   error.status = 404;
        next(error);
    });

app.use((
    error: any, 
    req: Request, 
    res: Response,
    next: NextFunction
    ) => {
        res.status(error?.status || 500);
        res.json({
            error: {
                message: error.message
            }
        });
    });

export default app;

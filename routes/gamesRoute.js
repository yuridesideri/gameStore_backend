import { Router } from "express";
import { listGames, postGames } from "../controllers/gamesControllers.js";



const gamesRouter = Router();

gamesRouter.get('/games', listGames);
gamesRouter.post('/games', postGames)



export default gamesRouter;
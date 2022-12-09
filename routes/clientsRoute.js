import { Router } from "express";
import { listRentals } from "../controllers/rentControllers.js";



const clientsRouter = Router();


clientsRouter.use('/rentals',listRentals);


export default clientsRouter;
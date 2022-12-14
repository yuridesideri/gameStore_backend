import { Router } from "express";
import { deleteRental, finishRental, listRental, postRental } from "../controllers/rentControllers.js";



const rentRouter = Router();


rentRouter.delete("/rentals/:id", deleteRental);
rentRouter.post("/rentals/:id/return", finishRental);
rentRouter.post("/rentals", postRental);
rentRouter.get("/rentals", listRental)


export default rentRouter;
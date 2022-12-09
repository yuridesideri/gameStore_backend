import { Router } from "express";
import categoriesRouter from "./categoriesRoute.js";
import gamesRouter from "./gamesRoute.js";
import customersRouter from "./customersRoute.js";
import rentRoutes from "./rentRoute.js";

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentRoutes);



export default router;
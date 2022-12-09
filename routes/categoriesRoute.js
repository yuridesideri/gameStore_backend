import { Router } from "express";
import { listCategories, postCategories } from "../controllers/categoriesController.js";

const categoriesRouter = Router();


categoriesRouter.get('/categories', listCategories);
categoriesRouter.post('/categories', postCategories);




export default categoriesRouter;
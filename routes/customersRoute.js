import { Router } from "express";
import { insertCustomers, listCustomers, updateCustomer } from "../controllers/customersControllers.js";




const customersRouter = Router();

customersRouter.get("/customers/:id?", listCustomers);
customersRouter.post("customers", insertCustomers);
customersRouter.put("customers/:id", updateCustomer);


export default customersRouter;
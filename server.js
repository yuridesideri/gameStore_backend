import express from "express";
import cors from "cors";
import router from "./routes/routeIndex";

const server = express();
server.use(cors());
server.use(express.json());
server.use(router);


server.listen(4000, () => console.log("Server running in port: "));
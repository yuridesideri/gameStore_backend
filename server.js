import express from "express";
import cors from "cors";
import router from "./routes/routeIndex.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(router);


const port = 4000;
server.listen(port, () => console.log(`Server running in port: ${port}`));
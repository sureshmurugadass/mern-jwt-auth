import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import configureRoutes from "./routes";

// init app
const app = express();

//configure dotenv
dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//connect routers
configureRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on ${port}`));

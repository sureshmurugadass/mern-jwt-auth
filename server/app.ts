import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import configureRoutes from "./routes";
import cookieParser from "cookie-parser";

// init app
const app = express();

//configure dotenv
dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());

//connect routers
configureRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on ${port}`));

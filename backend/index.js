import express from "express";
import ConnectDb from "../backend/Db/Connectdb.js";
import dotenv from "dotenv";
import cors from "cors";
import cardetailsrouter from "./Routes/cardatasroutes.js";


const app = express();
ConnectDb();
dotenv.config();
app.use(cors({
    origin: "http://localhost:5173",

}));

app.use(express.json());

app.use('/api/cars', cardetailsrouter);



app.listen(8888, () => {
    console.log(`Server is running on port ` + 8888);
});

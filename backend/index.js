import express from "express";
import ConnectDb from "./Db/ConnectDb.js";
import dotenv from "dotenv";
import cors from "cors";
import cardetailsrouter from "./Routes/cardetailsdata.js";


const app = express();
ConnectDb();
dotenv.config();
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
}));

app.use(express.json());





app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(8888, () => {
    console.log(`Server is running on port ` + 8888);
});

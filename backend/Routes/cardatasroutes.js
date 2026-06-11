import express from "express";
import { GetCarData, PostCarData, SearchCar } from "../Controllers/Cardatascontrollers.js";

const router = express.Router();

router.get("/getall", GetCarData);
router.post("/postall", PostCarData);
router.post("/search", SearchCar);

export default router;

import express from "express";
import { searchCars } from "../Controllers/Searchcontrollers.js";

const router = express.Router();


router.post("/search", searchCars);

export default router;

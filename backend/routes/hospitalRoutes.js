import express from "express";
import { getAllHospitals } from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/hospitals", getAllHospitals);

export default router;

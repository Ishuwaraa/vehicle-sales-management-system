import express from "express";
import { getAllVehicles, getVehicleById, searchVehicles } from "../controllers/customerVehicleController.js";

const router = express.Router();

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/search', searchVehicles);

export default router;
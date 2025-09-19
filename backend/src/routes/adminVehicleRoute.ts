import express from "express";
import { addVehicle, deleteVehicle, getAllVehicles, getVehicleById, updateVehicle } from "../controllers/adminVehicleController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/awsMiddleware.js";


const router = express.Router();

router.get('/', verifyJWT, getAllVehicles);
router.get('/:id', verifyJWT, getVehicleById);
router.post('/', verifyJWT, upload, addVehicle);
router.put('/:id', verifyJWT, updateVehicle);
router.delete('/:id', verifyJWT, deleteVehicle);

export default router;
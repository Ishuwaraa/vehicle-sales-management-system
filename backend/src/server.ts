import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { initializeDataSource } from "./data-source.js";

import authRoutes from "./routes/authRoute.js";
import adminVehicleRoutes from "./routes/adminVehicleRoute.js";

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin/vehicle", adminVehicleRoutes);

const initializeApp = async () => {
  try {
    await initializeDataSource();
    console.log("Data Source has been initialized!");
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start the application: ", err);
    process.exit(1);
  }
}

initializeApp();
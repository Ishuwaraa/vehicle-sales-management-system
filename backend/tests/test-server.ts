import express from "express";
import "reflect-metadata";

// import authRoutes from "../src/routes/authRoute";

export const createTestApp = () => {
    const app = express();

    // app.use("/api/auth", authRoutes);

    return app;
};
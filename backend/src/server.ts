import express from "express";
import OpenAI from 'openai';
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// })

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const MONGO_DB_URI = process.env.DB_URI;

if (MONGO_DB_URI) {
  mongoose.connect(MONGO_DB_URI)
    .then(() => {
      app.listen(port, () => console.log("connected to db and listening on port: " , port));
    })
    .catch((err) => console.log(err))
}

app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello")
// })

// app.get("/test", async (req, res) => {
//   const response = await client.responses.create({
//     model: 'gpt-4.1-nano',
//     instructions: 'You are a coding assistant that talks like a pirate',
//     input: 'Are semicolons optional in JavaScript?',
//   })

//   res.send(response.output_text);
// })
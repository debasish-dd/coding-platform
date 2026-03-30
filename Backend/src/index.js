
import express from 'express';
import authRouter from "./routes/auth.routes.js"
import problemRouter from "./routes/problem.routes.js"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser())

// app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/problems", problemRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
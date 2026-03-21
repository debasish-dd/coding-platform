import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
// app.use(express.urlencoded())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/v1/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
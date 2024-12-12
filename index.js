import express from "express";
import dbConnection from "./db/conn.js";
import userRoute from "./routes/userRoutes.js";
import cors from "cors";
const app = express();
const port = 501;

dbConnection();

app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRoute);

app.get("/", (req, res) => {
  res.send("Welcome to my api server");
});

app.listen(port, () => {
  console.log(`The server is listening on port http://localhost:${port}`);
});

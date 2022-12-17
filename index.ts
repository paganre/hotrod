import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api/1", (req, res) => {
  res.json({
    grid: [
      ["W", "W", "E", "W", "W"],
      ["W", "W", " ", "W", "W"],
      ["W", "W", " ", "W", "W"],
      ["W", "W", " ", "W", "W"],
      ["W", "W", "S", "W", "W"],
    ],
  });
});

app.get("/api/2", (req, res) => {
  res.json({
    grid: [
      ["W", "W", " ", " ", " ", "W", "W", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", "W", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", "W", "E", " ", " "],
      ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
      ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
      ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
      ["W", "W", " ", "W", " ", "W", "W", "W", "W", " "],
      ["W", "W", " ", "W", " ", "W", " ", " ", " ", " "],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", "W", " ", "W", "W", "W"],
      ["W", "W", " ", "W", " ", " ", " ", "W", "W", "W"],
      ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
    ],
  });
});

app.get("/api/3", (req, res) => {
  res.json({
    grid: [
      ["W", "W", "P", "P", "P", "W", "W", "W", "W", "W"],
      ["W", "W", "P", "W", "P", "W", "W", "W", "W", "W"],
      ["W", "W", "P", "W", "P", "W", "W", "E", "P", "P"],
      ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
      ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
      ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
      ["W", "W", "P", "W", "P", "W", "W", "W", "W", "P"],
      ["W", "W", "P", "W", "P", "W", "P", "P", "P", "P"],
      ["W", "W", "P", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "W", "P", "W", "W", "W"],
      ["W", "W", " ", "W", "P", "P", "P", "W", "W", "W"],
      ["W", "W", "S", "W", "W", "W", "W", "W", "W", "W"],
    ],
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

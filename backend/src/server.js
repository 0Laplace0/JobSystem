import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prismaClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend is running 🚀"));

app.get("/api/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

app.listen(4000, () => console.log("🚀 Backend running on 4000"));

app.get("/api/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        employee_id: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

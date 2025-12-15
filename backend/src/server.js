import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prismaClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend is running 🚀"));

/* ================= EMPLOYEES ================= */
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        employee_id: true,
        first_name: true,
        last_name: true,
        role: true,
      },
      orderBy: { employee_id: "asc" },
    });

    res.json(employees);
  } catch (err) {
    console.error("❌ /api/employees error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= TIME RECORDS ================= */
app.get("/api/timerecords", async (req, res) => {
  try {
    const records = await prisma.timeRecord.findMany({
      include: {
        employee: {
          select: {
            first_name: true,
            last_name: true,
            role: true,
          },
        },
      },
      orderBy: { record_id: "desc" },
      take: 50,
    });

    const result = records.map((r) => ({
      record_id: r.record_id,
      employee_id: r.employee_id,
      first_name: r.employee?.first_name,
      last_name: r.employee?.last_name,
      role: r.employee?.role,
      work_date: r.work_date ? r.work_date.toISOString().split("T")[0] : null,
      check_in_time: r.check_in_time ? r.check_in_time.toISOString() : null,
      check_out_time: r.check_out_time ? r.check_out_time.toISOString() : null,
      is_late: r.is_late,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ /api/timerecords error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(4000, () => console.log("🚀 Backend running on 4000"));

import React, { useEffect, useMemo, useState } from "react";
import "../styles/Attendance.css";

/* ================= Utils ================= */
const pad2 = (n) => String(n).padStart(2, "0");
const formatDate = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatTime = (d) =>
  `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;

/* ================= Config ================= */
const STORAGE_KEY = "attendance_records_v1";
const WORK_START = { h: 9, m: 0 }; // 09:00
const LATE_AFTER_MINUTES = 1; // เกิน 09:01 = สาย

/* ================= Component ================= */
export default function AttendancePage() {
  const [now, setNow] = useState(new Date());

  /* ---------- records ---------- */
  const [records, setRecords] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  /* ---------- leave form ---------- */
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveDate, setLeaveDate] = useState(formatDate(new Date()));
  const [leaveType, setLeaveType] = useState("");
  const [leaveNote, setLeaveNote] = useState("");

  /* ✅ date filter (แทนปุ่มล้างข้อมูล) */
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  /* ---------- realtime clock ---------- */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---------- persist ---------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  /* ================= Computed ================= */
  const today = useMemo(() => formatDate(now), [now]);

  const todaysRecords = useMemo(
    () => records.filter((r) => r.date === today),
    [records, today]
  );

  const hasCheckInToday = useMemo(
    () => todaysRecords.some((r) => r.type === "CHECK_IN"),
    [todaysRecords]
  );

  const hasCheckOutToday = useMemo(
    () => todaysRecords.some((r) => r.type === "CHECK_OUT"),
    [todaysRecords]
  );

  const isLateNow = useMemo(() => {
    const start = new Date(now);
    start.setHours(WORK_START.h, WORK_START.m, 0, 0);

    const lateCutoff = new Date(start);
    lateCutoff.setMinutes(lateCutoff.getMinutes() + LATE_AFTER_MINUTES);

    return now > lateCutoff;
  }, [now]);

  /* ✅ records ของวันที่ที่เลือก (สำหรับตาราง) */
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const recordDate = r.type === "LEAVE" && r.leaveDate ? r.leaveDate : r.date;
      return recordDate === selectedDate;
    });
  }, [records, selectedDate]);

  /* ================= Actions ================= */
  const addRecord = (type, extra = {}) => {
    const dt = new Date();
    setRecords((prev) => [
      {
        id: `${dt.getTime()}_${Math.random().toString(16).slice(2)}`,
        date: formatDate(dt),
        time: formatTime(dt),
        createdAt: dt.toISOString(),
        type, // CHECK_IN | CHECK_OUT | LATE | LEAVE
        note: extra.note || "",
        leaveDate: extra.leaveDate || "",
        leaveType: extra.leaveType || "",
      },
      ...prev,
    ]);
  };

  const onCheckIn = () => {
    if (hasCheckInToday) return alert("วันนี้คุณเข้างานไปแล้ว");

    if (isLateNow) {
      addRecord("LATE", { note: "เข้างานหลังเวลาเริ่มงาน" });
    }

    addRecord("CHECK_IN");
  };

  const onCheckOut = () => {
    if (!hasCheckInToday) return alert("ยังไม่ได้เข้างานวันนี้");
    if (hasCheckOutToday) return alert("วันนี้คุณออกงานไปแล้ว");
    addRecord("CHECK_OUT");
  };

  const onSubmitLeave = () => {
    if (!leaveDate) return alert("กรุณาเลือกวันที่ลา");

    addRecord("LEAVE", {
      leaveDate,
      leaveType,
      note: leaveNote.trim(),
    });

    setLeaveNote("");
    setLeaveType("");
    setShowLeaveForm(false);

    // ✅ ถ้ากำลังดูวันที่เดียวกับที่ลาอยู่ จะเห็นรายการทันที
    setSelectedDate(leaveDate);
  };

  /* ================= Render helpers ================= */
  const typeLabel = (t) => {
    if (t === "CHECK_IN") return "เข้างาน";
    if (t === "CHECK_OUT") return "ออกงาน";
    if (t === "LATE") return "สาย";
    if (t === "LEAVE") return "ลา";
    return t;
  };

  const typeClass = (t) => {
    if (t === "CHECK_IN") return "badge badge-green";
    if (t === "CHECK_OUT") return "badge badge-brown";
    if (t === "LATE") return "badge badge-red";
    if (t === "LEAVE") return "badge badge-yellow";
    return "badge";
  };

  /* ================= UI ================= */
  return (
    <div className="att-page">
      {/* Header */}
      <div className="att-header">
        <div>
          <h1 className="att-title">Attendance Management</h1>
          <div className="att-sub">
            <span className="att-date">{today}</span>
            <span className="att-dot">•</span>
            <span className="att-time">{formatTime(now)}</span>
          </div>
        </div>

        <div className="att-actions">
          <button className="btn btn-green" onClick={onCheckIn}>
            Check In
          </button>
          <button className="btn btn-red" onClick={onCheckOut}>
            Check Out
          </button>
          <button className="btn btn-yellow" onClick={() => setShowLeaveForm(true)}>
            Leave
          </button>

          <div className="att-datefilter">
            <span className="att-datefilter-label">Date :</span>
            <input
              className="att-datefilter-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="att-summary">
        <div className="summary-card">
          <div className="summary-label">สถานะวันนี้</div>
          <div className="summary-value">
            {hasCheckOutToday
              ? "ออกงานแล้ว"
              : hasCheckInToday
              ? "เข้างานแล้ว"
              : "ยังไม่เข้างาน"}
          </div>
          <div className={`summary-hint ${isLateNow ? "late" : ""}`}>
            {isLateNow
              ? "เลยเวลาเริ่มงาน (เข้างานจะถูกบันทึกว่าสาย)"
              : "ยังอยู่ในเวลาเริ่มงาน"}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">กิจกรรมวันนี้</div>
          <div className="summary-value">{todaysRecords.length} รายการ</div>
        </div>
      </div>

      {/* Leave Form */}
      {showLeaveForm && (
        <div className="leave-panel">
          <div className="leave-title">บันทึกการลา</div>

          <div className="leave-grid">
            <div className="leave-field">
              <label className="leave-label">วันที่ลา</label>
              <input
                className="leave-input"
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
              />
            </div>

            <div className="leave-field">
              <label className="leave-label">ประเภท</label>
              <select
                className="leave-input"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">-- ไม่ระบุ --</option>
                <option value="SICK">ลาป่วย</option>
                <option value="PERSONAL">ลากิจ</option>
                <option value="VACATION">ลาพักร้อน</option>
                <option value="OTHER">อื่น ๆ</option>
              </select>
            </div>
          </div>

          <div className="leave-field leave-field-full">
            <label className="leave-label">Note</label>
            <textarea
              className="leave-textarea"
              placeholder="เช่น ลาป่วย, ลากิจ, มีธุระด่วน..."
              value={leaveNote}
              onChange={(e) => setLeaveNote(e.target.value)}
            />
          </div>

          <div className="leave-actions">
            <button className="btn" onClick={onSubmitLeave}>
              บันทึกการลา
            </button>
            <button className="btn btn-ghost" onClick={() => setShowLeaveForm(false)}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrap">
        <div className="table-title">
          ประวัติสถานะ (วันที่ {selectedDate})
        </div>

        <table className="att-table">
          <thead>
            <tr>
              <th width="120">วันที่</th>
              <th width="100">เวลา</th>
              <th width="120">สถานะ</th>
              <th>Note</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">
                  ไม่มีข้อมูลในวันที่ {selectedDate}
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td>{r.type === "LEAVE" && r.leaveDate ? r.leaveDate : r.date}</td>
                  <td>{r.time}</td>
                  <td>
                    <span className={typeClass(r.type)}>{typeLabel(r.type)}</span>
                  </td>
                  <td className="note-cell">
                    {r.leaveType ? `(${r.leaveType}) ` : ""}
                    {r.note || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

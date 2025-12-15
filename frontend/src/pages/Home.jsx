import { useEffect, useState } from "react";

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [timerecords, setTimerecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [empRes, timeRes] = await Promise.all([
          fetch("http://localhost:4000/api/employees"),
          fetch("http://localhost:4000/api/timerecords"),
        ]);

        if (!empRes.ok) throw new Error(`employees HTTP ${empRes.status}`);
        if (!timeRes.ok) throw new Error(`timerecords HTTP ${timeRes.status}`);

        const empData = await empRes.json();
        const timeData = await timeRes.json();

        setEmployees(Array.isArray(empData) ? empData : []);
        setTimerecords(Array.isArray(timeData) ? timeData : []);
      } catch (e) {
        console.error(e);
        setError(e.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>กำลังโหลดข้อมูล...</p>;

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ color: "red" }}>เกิดข้อผิดพลาด</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>รายชื่อพนักงาน</h2>
      <table border="1" cellPadding="8" style={{ marginBottom: 30 }}>
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>ตำแหน่ง</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.employee_id}>
              <td>{e.first_name}</td>
              <td>{e.last_name}</td>
              <td>{e.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>ประวัติการลงเวลา</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>พนักงาน</th>
            <th>วันที่</th>
            <th>เข้า</th>
            <th>ออก</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {timerecords.map((r) => (
            <tr key={r.record_id}>
              <td>{r.first_name} {r.last_name}</td>
              <td>{r.work_date}</td>
              <td>{r.check_in_time ? r.check_in_time.slice(11, 16) : "-"}</td>
              <td>{r.check_out_time ? r.check_out_time.slice(11, 16) : "-"}</td>
              <td style={{ color: r.is_late ? "red" : "green" }}>
                {r.is_late ? "มาสาย" : "ตรงเวลา"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

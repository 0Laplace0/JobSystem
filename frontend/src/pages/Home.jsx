import { useEffect, useState } from "react";

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูลพนักงาน...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>รายชื่อพนักงาน</h1>

      <table border="1" cellPadding="10" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>ตำแหน่ง</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employee_id}>
              <td>{emp.first_name}</td>
              <td>{emp.last_name}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

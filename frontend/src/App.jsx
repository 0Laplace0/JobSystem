import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import "./index.css";
import Attendance from "./pages/Attendance";
// import HR from "./pages/HR";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
        {/* <Route path="/hr" element={<HR />} /> */}
      </Routes>
    </MainLayout>
  );
}

export default App;

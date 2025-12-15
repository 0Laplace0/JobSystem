import { useState } from "react";
import SideNavbar from "../components/SideNavbar";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <SideNavbar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="app-main">
        <Header />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}

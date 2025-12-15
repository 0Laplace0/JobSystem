import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClock,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SideNavbar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-title">SYSTEM</div>
        </div>

        {/* <button className="collapse-btn" onClick={onToggle} title="Toggle">
          {collapsed ? "»" : "«"}
        </button> */}
      </div>

      <nav className="nav">
        <NavItem to="/" label="Home" icon={<FaHome />} collapsed={collapsed} end/>
        <NavItem to="/attendance" label="Attendance" icon={<FaClock />} collapsed={collapsed}/>
        <NavItem to="/hr" label="HR" icon={<FaUsers />} collapsed={collapsed}/>
      </nav>

      <div className="sidebar-bottom">
        <NavItem to="/logout" label="Logout" icon={<FaSignOutAlt />} collapsed={collapsed}/>
      </div>
    </aside>
  );
}

function NavItem({ to, label, icon, collapsed, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      }
    >
      <span className="nav-icon">{icon}</span>
      {!collapsed && <span className="nav-label">{label}</span>}
    </NavLink>
  );
}

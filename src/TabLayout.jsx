// src/TabLayout.jsx
import { NavLink, Outlet } from 'react-router-dom'
import { FaHome, FaCalendarAlt, FaFlask, FaBook, FaGavel } from 'react-icons/fa'
import './styles/TabLayout.css'

function TabLayout() {
  return (
    <div className="tab-container">
      <div className="main-content">
        <Outlet />
      </div>
      <nav className="tab-bar">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <FaHome size={20} />
          <span>首頁</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaCalendarAlt size={20} />
          <span>行事曆</span>
        </NavLink>
        <NavLink to="/test" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaFlask size={20} />
          <span>試做</span>
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaBook size={20} />
          <span>部落格</span>
        </NavLink>
        <NavLink to="/rules" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaGavel size={20} />
          <span>規則</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default TabLayout

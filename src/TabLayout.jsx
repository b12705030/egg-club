// src/TabLayout.jsx
import { NavLink, Outlet } from 'react-router-dom'
import './styles/TabLayout.css'
import { FaHome, FaCalendarAlt, FaUsers, FaBookOpen, FaFileAlt } from 'react-icons/fa'
import { TiHome } from 'react-icons/ti'
import { HiMiniCalendarDateRange } from "react-icons/hi2"
import { FaKitchenSet } from "react-icons/fa6"
import { LuCakeSlice } from "react-icons/lu"
import { FaListCheck } from "react-icons/fa6"


function TabLayout() {
  return (
    <div className="tab-container">
      <div className="main-content">
        <Outlet />
      </div>

      <nav className="tab-bar">
        <NavLink to="/" end>
          <TiHome />
          <span>首頁</span>
        </NavLink>
        <NavLink to="/calendar">
          <HiMiniCalendarDateRange />
          <span>行事曆</span>
        </NavLink>
        <NavLink to="/test">
          <FaKitchenSet />
          <span>試作</span>
        </NavLink>
        <NavLink to="/blog">
          <LuCakeSlice />
          <span>食譜集</span>
        </NavLink>
        <NavLink to="/rules">
          <FaListCheck />
          <span>其他</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default TabLayout

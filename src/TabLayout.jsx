import { Outlet, NavLink } from 'react-router-dom'
import './styles/TabLayout.css'

function TabLayout({ session, onLogout }) {
  return (
    <div className="tab-container">
      <div className="main-content">
        <Outlet />
      </div>

      <nav className="tab-bar">
        <NavLink to="/" end>主畫面</NavLink>
        <NavLink to="/calendar">行事曆</NavLink>
        <NavLink to="/test">試做專區</NavLink>
        <NavLink to="/blog">部落格</NavLink>
        <NavLink to="/rules">規則</NavLink>
        {session && (
          <button onClick={onLogout}>登出</button>
        )}
      </nav>
    </div>
  )
}

export default TabLayout

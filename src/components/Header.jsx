import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { useProfile } from '../ProfileContext'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { profile } = useProfile()

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'global' })
    window.location.href = '/'
  }

  return (
    <header className="header-bar">
      <div className="left">
        🍰 <span>臺大蛋研 NTUESC</span>
      </div>
      <div className="right">
        {profile ? (
          <button className="header-btn" onClick={handleLogout}>
            <FiLogOut /> 登出
          </button>
        ) : (
          <button className="header-btn" onClick={() => navigate('/')}>
            <FiLogIn /> 登入
          </button>
        )}
      </div>
    </header>
  )
}

export default Header

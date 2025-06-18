import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ProfileProvider } from './ProfileContext'  // 👈 加這行

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileProvider> {/* 👈 用這包起 App */}
      <App />
    </ProfileProvider>
  </React.StrictMode>
)

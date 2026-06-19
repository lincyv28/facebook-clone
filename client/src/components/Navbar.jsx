import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  // Get logged-in user's name from localStorage
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 100
    }}>

      {/* Left side - Logo */}
      <div style={{ color: '#1877f2', fontSize: '32px', fontWeight: 'bold' }}>
        f
      </div>

      {/* Middle - Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search Facebook"
          style={{
            backgroundColor: '#f0f2f5',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '15px',
            outline: 'none',
            width: '240px'
          }}
        />
      </div>

      {/* Right side - User info + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            backgroundColor: '#e4e6eb',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {user ? user.firstName[0] : 'U'}
          </div>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>
            {user ? user.firstName : 'User'}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e4e6eb',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

    </div>
  )
}

export default Navbar
import { useNavigate } from 'react-router-dom'

function LeftSidebar() {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'fixed',
      top: '56px',
      left: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#ffffff',
      padding: '8px',
      overflowY: 'auto'
    }}>

      {/* Profile link */}
      <div
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '4px'
        }}>
        <div style={{
          backgroundColor: '#e4e6eb',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          U
        </div>
        <span style={{ fontWeight: '600', fontSize: '15px' }}>Your Profile</span>
      </div>

      {/* Menu items */}
      {[
        'Friends',
        'Groups',
        'Marketplace',
        'Watch',
        'Memories'
      ].map((item) => (
        <div key={item} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '500',
          marginBottom: '4px'
        }}>
          <div style={{
            backgroundColor: '#e4e6eb',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            •
          </div>
          {item}
        </div>
      ))}

    </div>
  )
}

export default LeftSidebar
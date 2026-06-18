function RightSidebar() {
  return (
    <div style={{
      position: 'fixed',
      top: '56px',
      right: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#ffffff',
      padding: '16px',
      overflowY: 'auto'
    }}>

      {/* Sponsored Section */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          fontSize: '17px',
          fontWeight: '700',
          color: '#65676b',
          marginBottom: '12px'
        }}>
          Sponsored
        </h4>
        <div style={{
          display: 'flex',
          gap: '8px',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#e4e6eb',
            borderRadius: '8px'
          }}/>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              Sample Ad
            </div>
            <div style={{ fontSize: '13px', color: '#65676b' }}>
              sample-website.com
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        borderTop: '1px solid #e4e6eb',
        marginBottom: '20px'
      }}/>

      {/* Contacts Section */}
      <div>
        <h4 style={{
          fontSize: '17px',
          fontWeight: '700',
          color: '#65676b',
          marginBottom: '12px'
        }}>
          Contacts
        </h4>

        {[
          'Alice',
          'Bob',
          'Charlie',
          'David',
          'Emma'
        ].map((contact) => (
          <div key={contact} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '4px'
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{
                backgroundColor: '#e4e6eb',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {contact[0]}
              </div>
              {/* Online indicator */}
              <div style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '10px',
                height: '10px',
                backgroundColor: '#31a24c',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}/>
            </div>
            <span style={{
              fontSize: '15px',
              fontWeight: '500'
            }}>
              {contact}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default RightSidebar
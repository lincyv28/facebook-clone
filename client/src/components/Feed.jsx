function Feed() {
  return (
    <div style={{
      marginLeft: '280px',
      marginRight: '280px',
      marginTop: '76px',
      padding: '20px',
      minHeight: '100vh'
    }}>

      {/* Create Post Box */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            backgroundColor: '#e4e6eb',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            U
          </div>
          <input
            type="text"
            placeholder="What's on your mind?"
            style={{
              flex: 1,
              backgroundColor: '#f0f2f5',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 16px',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Sample Posts */}
      {[1, 2, 3].map((post) => (
        <div key={post} style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {/* Post Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <div style={{
              backgroundColor: '#e4e6eb',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              U
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>
                User Name
              </div>
              <div style={{ fontSize: '13px', color: '#65676b' }}>
                2 hours ago
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div style={{ fontSize: '15px', marginBottom: '12px' }}>
            This is a sample post number {post}. Hello from Facebook Clone!
          </div>

          {/* Post Actions */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderTop: '1px solid #e4e6eb',
            paddingTop: '8px'
          }}>
            {['Like', 'Comment', 'Share'].map((action) => (
              <button key={action} style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#65676b'
              }}>
                {action}
              </button>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}

export default Feed
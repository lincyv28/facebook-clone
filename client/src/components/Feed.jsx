import { useState } from 'react'
import CreatePost from './CreatePost'

function Feed() {
  const [newPosts, setNewPosts] = useState([])

  const handlePostCreated = (post) => {
    // Add the new post to the top of the list
    setNewPosts([post, ...newPosts])
  }

  return (
    <div style={{
      marginLeft: '280px',
      marginRight: '280px',
      marginTop: '76px',
      padding: '20px',
      minHeight: '100vh'
    }}>

      {/* Create Post Box */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Newly created posts (this session) */}
      {newPosts.map((post) => (
        <div key={post._id} style={{
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
              {post.user.firstName[0]}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>
                {post.user.firstName} {post.user.lastName}
              </div>
              <div style={{ fontSize: '13px', color: '#65676b' }}>
                Just now
              </div>
            </div>
          </div>

          {/* Post Text */}
          {post.text && (
            <div style={{ fontSize: '15px', marginBottom: '12px' }}>
              {post.text}
            </div>
          )}

          {/* Post Image */}
          {post.image && (
            <img
              src={`http://localhost:5000${post.image}`}
              alt="Post"
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
          )}

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

      {/* Old static sample posts (kept for now, will be replaced in Module 8) */}
      {[1, 2, 3].map((post) => (
        <div key={post} style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
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

          <div style={{ fontSize: '15px', marginBottom: '12px' }}>
            This is a sample post number {post}. Hello from Facebook Clone!
          </div>

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
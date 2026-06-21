import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function PostDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`)
        setPost(response.data)
      } catch (err) {
        setError('Post not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#65676b' }}>
          Loading post...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: '#e41e3f', fontSize: '16px', marginBottom: '16px' }}>{error}</p>
          <Link to="/home" style={{ color: '#1877f2' }}>Go back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '90px',
        paddingBottom: '40px'
      }}>

        {/* Back link */}
        <Link to="/home" style={{
          display: 'inline-block',
          marginBottom: '12px',
          color: '#1877f2',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none'
        }}>
          ← Back to Feed
        </Link>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
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
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              overflow: 'hidden'
            }}>
              {post.user.profileImage ? (
                <img
                  src={`http://localhost:5000${post.user.profileImage}`}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                post.user.firstName[0]
              )}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>
                {post.user.firstName} {post.user.lastName}
              </div>
              <div style={{ fontSize: '13px', color: '#65676b' }}>
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Post Text */}
          {post.text && (
            <div style={{ fontSize: '16px', marginBottom: '12px' }}>
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
                maxHeight: '500px',
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
      </div>
    </div>
  )
}

export default PostDetails
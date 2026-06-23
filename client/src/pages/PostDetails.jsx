import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function PostDetails() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')

  const token = localStorage.getItem('token')
  const loggedInUser = JSON.parse(localStorage.getItem('user'))

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

  // Like / Unlike
  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPost(response.data.post)
    } catch (error) {
      console.log(error)
    }
  }

  // Add comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPost(response.data.post)
      setCommentText('')
    } catch (error) {
      console.log(error)
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPost(response.data.post)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete comment')
    }
  }

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

          {/* Like count display */}
          {post.likes.length > 0 && (
            <div style={{
              fontSize: '13px',
              color: '#65676b',
              marginBottom: '8px',
              borderTop: '1px solid #e4e6eb',
              paddingTop: '8px'
            }}>
              👍 {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
            </div>
          )}

          {/* Post Actions */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderTop: post.likes.length > 0 ? 'none' : '1px solid #e4e6eb',
            paddingTop: post.likes.length > 0 ? '0' : '8px',
            marginBottom: '12px'
          }}>
            <button
              onClick={handleLike}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '600',
                color: loggedInUser && post.likes.includes(loggedInUser._id) ? '#1877f2' : '#65676b'
              }}
            >
              Like
            </button>
            <button style={{
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
              Comment
            </button>
            <button style={{
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
              Share
            </button>
          </div>

          {/* Comments Section - always visible on details page */}
          <div style={{ borderTop: '1px solid #e4e6eb', paddingTop: '12px' }}>

            {post.comments.map((comment) => (
              <div key={comment._id} style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '10px'
              }}>
                <div style={{
                  backgroundColor: '#e4e6eb',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {comment.user.profileImage ? (
                    <img
                      src={`http://localhost:5000${comment.user.profileImage}`}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    comment.user.firstName[0]
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    backgroundColor: '#f0f2f5',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    display: 'inline-block'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>
                      {comment.user.firstName} {comment.user.lastName}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      {comment.text}
                    </div>
                  </div>

                  {loggedInUser && comment.user._id === loggedInUser._id && (
                    <div
                      onClick={() => handleDeleteComment(comment._id)}
                      style={{
                        fontSize: '12px',
                        color: '#65676b',
                        cursor: 'pointer',
                        marginTop: '2px',
                        paddingLeft: '4px',
                        fontWeight: '600'
                      }}
                    >
                      Delete
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add comment input */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
              <div style={{
                backgroundColor: '#e4e6eb',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '13px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {loggedInUser && loggedInUser.profileImage ? (
                  <img
                    src={`http://localhost:5000${loggedInUser.profileImage}`}
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  loggedInUser ? loggedInUser.firstName[0] : 'U'
                )}
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment()
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#f0f2f5',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PostDetails
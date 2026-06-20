import { useState, useEffect } from 'react'
import axios from 'axios'
import CreatePost from './CreatePost'

function Feed() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch posts for a given page
  const fetchPosts = async (pageNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts?page=${pageNumber}`)
      return response.data
    } catch (error) {
      console.log(error)
      return { posts: [], hasMore: false }
    }
  }

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true)
      const data = await fetchPosts(1)
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setLoading(false)
    }
    loadInitialPosts()
  }, [])

  // When a new post is created, add it to the top
  const handlePostCreated = (post) => {
    setPosts([post, ...posts])
  }

  // Load more posts (pagination)
  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    const data = await fetchPosts(nextPage)
    setPosts([...posts, ...data.posts])
    setHasMore(data.hasMore)
    setPage(nextPage)
    setLoadingMore(false)
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

      {/* Loading state for initial load */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#65676b',
          fontSize: '15px'
        }}>
          Loading posts...
        </div>
      )}

      {/* No posts yet */}
      {!loading && posts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#65676b',
          fontSize: '15px',
          backgroundColor: '#ffffff',
          borderRadius: '8px'
        }}>
          No posts yet. Be the first to post something!
        </div>
      )}

      {/* Render posts */}
      {!loading && posts.map((post) => (
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
              <div style={{ fontWeight: '600', fontSize: '15px' }}>
                {post.user.firstName} {post.user.lastName}
              </div>
              <div style={{ fontSize: '13px', color: '#65676b' }}>
                {new Date(post.createdAt).toLocaleString()}
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

      {/* Load More button */}
      {!loading && hasMore && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              backgroundColor: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1877f2',
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* End of feed message */}
      {!loading && !hasMore && posts.length > 0 && (
        <div style={{ textAlign: 'center', color: '#65676b', fontSize: '14px', padding: '20px' }}>
          You've reached the end!
        </div>
      )}

    </div>
  )
}

export default Feed
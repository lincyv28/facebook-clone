import { useState } from 'react'
import axios from 'axios'

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!text && !selectedImage) {
      setError('Write something or add an image first')
      return
    }

    const formData = new FormData()
    formData.append('text', text)
    if (selectedImage) {
      formData.append('image', selectedImage)
    }

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      // Clear the form
      setText('')
      setSelectedImage(null)
      setPreviewUrl(null)

      // Tell the parent component (Feed) that a new post was created
      if (onPostCreated) {
        onPostCreated(response.data.post)
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }}>

      <form onSubmit={handleSubmit}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: previewUrl ? '12px' : '0' }}>
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
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: '#f0f2f5',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 16px',
              fontSize: '15px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Image preview */}
        {previewUrl && (
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div style={{ color: '#e41e3f', fontSize: '13px', marginBottom: '8px' }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e4e6eb',
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          <label style={{
            cursor: 'pointer',
            color: '#45bd62',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            📷 Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1877f2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default CreatePost
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    let newErrors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (isValid) {
      alert('Login form is valid! (Backend connection comes in Module 5)')
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '400px'
      }}>

        {/* Logo */}
        <div style={{
          color: '#1877f2',
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          facebook
        </div>

        <form onSubmit={handleSubmit}>

          {/* Email field */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: errors.email ? '1px solid #e41e3f' : '1px solid #ccd0d5',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
            {errors.email && (
              <div style={{ color: '#e41e3f', fontSize: '13px', marginTop: '4px' }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: errors.password ? '1px solid #e41e3f' : '1px solid #ccd0d5',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
            {errors.password && (
              <div style={{ color: '#e41e3f', fontSize: '13px', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#1877f2',
              color: '#ffffff',
              padding: '12px',
              fontSize: '17px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Log In
          </button>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid #dadde1',
            margin: '8px 0 16px 0'
          }} />

          {/* Create account button */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              style={{
                backgroundColor: '#42b72a',
                color: '#ffffff',
                padding: '12px 16px',
                fontSize: '17px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Create new account
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    let newErrors = {}

    if (!firstName) {
      newErrors.firstName = 'First name is required'
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required'
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (!isValid) return

    setLoading(true)

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password
      })

      // Redirect to login page after successful registration
      navigate('/')

    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '11px',
    fontSize: '15px',
    border: hasError ? '1px solid #e41e3f' : '1px solid #ccd0d5',
    borderRadius: '6px',
    outline: 'none'
  })

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
        padding: '24px 32px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '430px'
      }}>

        {/* Header */}
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
          Create a new account
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#65676b',
          fontSize: '15px',
          marginBottom: '20px'
        }}>
          It's quick and easy.
        </p>

        <div style={{ borderTop: '1px solid #dadde1', marginBottom: '16px' }} />

        {/* Form level error */}
        {errors.form && (
          <div style={{
            backgroundColor: '#ffebe8',
            color: '#e41e3f',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* First name + Last name in one row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle(errors.firstName)}
              />
              {errors.firstName && (
                <div style={{ color: '#e41e3f', fontSize: '12px', marginTop: '4px' }}>
                  {errors.firstName}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle(errors.lastName)}
              />
              {errors.lastName && (
                <div style={{ color: '#e41e3f', fontSize: '12px', marginTop: '4px' }}>
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Email field */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle(errors.email)}
            />
            {errors.email && (
              <div style={{ color: '#e41e3f', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle(errors.password)}
            />
            {errors.password && (
              <div style={{ color: '#e41e3f', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password field */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle(errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <div style={{ color: '#e41e3f', fontSize: '12px', marginTop: '4px' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Register button */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#42b72a',
                color: '#ffffff',
                padding: '12px 60px',
                fontSize: '17px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>

          {/* Link to login */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/" style={{ color: '#1877f2', fontSize: '14px' }}>
              Already have an account? Log in
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Register
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = ({ target }) => {
    setFormData((currentData) => ({
      ...currentData,
      [target.name]: target.value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await axiosInstance.post('customers/register', formData)
      navigate('/')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Registration failed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-[#1e293b] px-4 py-2 text-center text-xs font-semibold tracking-[0.2em] text-[#fffdf5]">
        Complimentary shipping on orders over ₹75
      </div>

      <header className="auth-shell border-b border-[#1e293b]/10 bg-[#fffdf5]/95 px-5 py-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link className="text-2xl font-black tracking-[-0.06em] text-[#1e293b]" to="/">
            shop<span className="text-[#8b5cf6]">kart</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#1e293b]/75 md:flex">
            <span>New here?</span>
            <Link className="auth-link transition hover:text-[#8b5cf6]" to="/login">
              Log in
            </Link>
          </div>
        </div>
      </header>

      <section className="auth-shell mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
        <div className="auth-visual relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
            alt="Lifestyle editorial banner for a boutique storefront"
          />
          <div className="auth-visual-overlay" />
          <div className="auth-badge absolute bottom-6 left-6 rounded-2xl px-5 py-4 sm:bottom-8 sm:left-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b5cf6]">Fresh arrivals</p>
            <p className="mt-1 text-lg font-bold text-[#1e293b]">The essentials you’ll keep returning to</p>
          </div>
        </div>

        <div className="auth-card p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8b5cf6]">
              Create an account
            </p>
            <h1 className="text-4xl font-black tracking-[-0.06em] text-[#1e293b]">
              Join us today
            </h1>
            <p className="mt-3 text-base text-[#1e293b]/65">Register to start shopping your favorite finds.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-[#1e293b]">
              Full name
              <input
                className="auth-input mt-2"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#1e293b]">
              Email address
              <input
                className="auth-input mt-2"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#1e293b]">
              Phone number
              <input
                className="auth-input mt-2"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="555-0100"
                autoComplete="tel"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#1e293b]">
              Password
              <input
                className="auth-input mt-2"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-button w-full rounded-full px-4 py-3.5 text-sm font-bold uppercase tracking-[0.12em]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1e293b]/65">
            Already have an account?{' '}
            <Link className="font-bold text-[#1e293b] transition hover:text-[#8b5cf6]" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register

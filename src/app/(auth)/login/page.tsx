'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      <div className="w-full max-w-md">
        <div 
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#111111', border: '1px solid #222222' }}
        >
          <div className="text-center mb-8">
            <div className="mb-4" style={{ fontSize: '48px' }}>🚀</div>
            <h1 className="text-2xl font-semibold text-white mb-2">Mission Control</h1>
            <p style={{ fontSize: '13px', color: '#A1A1A1' }}>
              AI Agent Project Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block font-medium text-white mb-2"
                style={{ fontSize: '13px' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #222222',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="oscar@example.com"
                required
                onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                onBlur={(e) => e.target.style.borderColor = '#222222'}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block font-medium text-white mb-2"
                style={{ fontSize: '13px' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #222222',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="••••••••"
                required
                onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                onBlur={(e) => e.target.style.borderColor = '#222222'}
              />
            </div>

            {error && (
              <div 
                className="p-3 rounded-xl text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#EF4444'
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#6366F1',
                color: 'white',
                fontSize: '14px'
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#818CF8')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6366F1')}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

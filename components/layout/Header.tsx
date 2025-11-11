'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, Shield, Settings } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  // Detect current layer from pathname
  const currentLayer = pathname?.match(/\/(europeans|americans|others)/)?.[1]

  useEffect(() => {
    // Check for saved preference first
    const stored = localStorage.getItem('darkMode')

    let darkMode = false
    if (stored !== null) {
      // Use saved preference
      darkMode = stored === 'true'
    } else {
      // Auto-detect system preference
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    setIsDark(darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [])

  const toggleDark = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem('darkMode', newDark.toString())
    document.documentElement.classList.toggle('dark', newDark)
  }

  const currentUser = user ? {
    id: user.id,
    email: user.email || '',
    full_name: user.name || null,
    is_admin: user.isAdmin || false,
    pack_id: user.packId || 'free',
  } : null

  return (
    <header className="sticky top-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-700/80 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Swiss Immigration Pro
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className={`md:flex items-center space-x-4 ${isOpen ? 'flex flex-col absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 space-y-2 md:space-y-0 md:relative md:border-0 md:p-0 md:bg-transparent' : 'hidden'}`}>
            <Link href="/visas" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Visas
            </Link>
            <Link href="/citizenship" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Citizenship
            </Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Pricing
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>

                {currentUser.is_admin && (
                  <Link href="/admin" className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => signOut()}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}

            <button
              onClick={toggleDark}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}


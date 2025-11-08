'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, Shield, Settings } from 'lucide-react'
import { useUser, useStackApp } from '@stackframe/stack'
import { CONFIG } from '@/lib/config'
import AdvancedSearch from '@/components/AdvancedSearch'
import type { LayerType } from '@/lib/layerLogic'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useUser()
  const stackApp = useStackApp()
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()
  
  // Detect current layer from pathname
  const currentLayer = pathname?.match(/\/(europeans|americans|others)/)?.[1] as LayerType | undefined

  useEffect(() => {
    // Check for saved preference first
    const stored = localStorage.getItem('darkMode')
    
    let darkMode = false
    if (stored !== null) {
      // Use saved preference
      darkMode = stored === 'true'
    } else {
      // Check system preference on first visit
      if (typeof window !== 'undefined' && window.matchMedia) {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        // Save system preference
        localStorage.setItem('darkMode', String(darkMode))
      }
    }
    
    setIsDark(darkMode)
    
    // Apply dark mode class with transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark-mode')
    }
    
    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-update if user hasn't manually set a preference
        if (stored === null) {
          const newMode = e.matches
          setIsDark(newMode)
          localStorage.setItem('darkMode', String(newMode))
          if (newMode) {
            document.documentElement.classList.add('dark')
            document.body.classList.add('dark-mode')
          } else {
            document.documentElement.classList.remove('dark')
            document.body.classList.remove('dark-mode')
          }
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    localStorage.setItem('darkMode', String(newMode))
    
    // Add smooth transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
    // Toggle dark mode classes
    if (newMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark-mode')
    }
    
    // Remove transition after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('userLayer')
      localStorage.removeItem('quizAnswers')
      localStorage.removeItem('quizCompleted')
    } catch (error) {
      console.warn('Failed to clear local storage on logout', error)
    }
    document.cookie = 'userLayer=; path=/; max-age=0'
    document.cookie = 'quizCompleted=; path=/; max-age=0'
    document.cookie = 'countryOfOrigin=; path=/; max-age=0'
    // Stack Auth handles logout via redirect to protected route
    window.location.href = '/auth/login'
  }

  const openQuiz = () => {
    if (typeof window !== 'undefined' && typeof window.openInitialQuiz === 'function') {
      window.openInitialQuiz()
    }
  }

  const currentUser = user ? {
    id: user.id,
    email: user.primaryEmail || '',
    full_name: user.displayName || null,
    is_admin: user.clientMetadata?.is_admin || false, // Check client metadata for admin status
    pack_id: user.clientMetadata?.pack_id || 'free', // Check client metadata for pack
  } : null

  return (
    <header className="sticky top-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-700/80 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-xl sm:text-2xl">🇨🇭</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white block leading-tight">
                Swiss<span className="text-blue-600 dark:text-blue-400">Immigration</span>Pro
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Expert Guidance</span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white sm:hidden">
              SIP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {currentLayer ? (
              // Layer-specific navigation
              <>
                <Link href={`/${currentLayer}`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                  {currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)} Home
                </Link>
                <Link href={`/${currentLayer}/visas`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                  Visas
                </Link>
                <Link href={`/${currentLayer}/process`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                  Process
                </Link>
                <Link href={`/${currentLayer}/requirements`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                  Requirements
                </Link>
                <Link href={`/${currentLayer}/resources`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                  Resources
                </Link>
              </>
            ) : (
              // Default navigation (no layer)
              <>
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              Home
            </Link>
            <Link href="/visas" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              Visas
            </Link>
            <Link href="/citizenship" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              Citizenship
            </Link>
            <Link href="/tools" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              Tools
            </Link>
              </>
            )}
            {/* Show US link only for Americans layer */}
            {currentLayer === 'americans' && (
              <Link href="/us-citizens" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 whitespace-nowrap">
                🇺🇸 US Resources
              </Link>
            )}
            <button
              onClick={openQuiz}
              className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 border border-blue-200/50 dark:border-blue-900/50"
            >
              Take Assessment
            </button>
            <Link href="/pricing" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
              Pricing
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Advanced Search - Hidden on small mobile */}
            <div className="hidden sm:block">
              <AdvancedSearch />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                {isDark ? '🌙' : '☀️'}
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            </button>

            {/* User Menu - Desktop Only */}
            {currentUser && !currentUser.is_admin && (
              <>
                <Link href="/dashboard" className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 border border-blue-200/50 dark:border-blue-800/50">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/profile" className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/70 dark:hover:bg-gray-800/60 rounded-lg transition-all duration-200 border border-red-200/60 dark:border-red-800/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
            
            {currentUser?.is_admin && (
              <>
                <Link href="/admin" className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-purple-500/20">
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <Link href="/admin/settings" className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/70 dark:hover:bg-gray-800/60 rounded-lg transition-all duration-200 border border-red-200/60 dark:border-red-800/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {/* Login Button - Desktop */}
            {!currentUser && (
              <Link 
                href="/auth/login"
                className="hidden lg:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg mobile-menu-enter">
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto smooth-scroll">
              {/* Search Bar - Mobile Only */}
              <div className="sm:hidden mb-4">
                <AdvancedSearch />
              </div>

              {/* Navigation Links */}
              {currentLayer ? (
                // Layer-specific mobile navigation
                <>
                  <Link 
                    href={`/${currentLayer}`} 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                  >
                    🏠 {currentLayer.charAt(0).toUpperCase() + currentLayer.slice(1)} Home
                  </Link>
                  <Link 
                    href={`/${currentLayer}/visas`} 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    📄 Visas & Permits
                  </Link>
                  <Link 
                    href={`/${currentLayer}/process`} 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    📋 Process
                  </Link>
                  <Link 
                    href={`/${currentLayer}/requirements`} 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    ✅ Requirements
                  </Link>
                  <Link 
                    href={`/${currentLayer}/resources`} 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    📚 Resources
                  </Link>
                </>
              ) : (
                // Default mobile navigation
                <>
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                🏠 Home
              </Link>
              <Link 
                href="/visas" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                📄 Visas & Permits
              </Link>
              <Link 
                href="/employment" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                💼 Employment
              </Link>
              <Link 
                href="/citizenship" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                🇨🇭 Citizenship
              </Link>
              <Link 
                href="/tools" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                🧮 Calculators & Tools
              </Link>
              <button
                onClick={() => {
                  openQuiz()
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                🧭 Personalized Assessment
              </button>
                </>
              )}
              {/* Show US link only for Americans layer in mobile */}
              {currentLayer === 'americans' && (
                <Link 
                  href="/us-citizens" 
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  🇺🇸 US Resources
                </Link>
              )}
              {!currentUser?.is_admin && (
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  📚 My Content
                </Link>
              )}
              <Link 
                href="/pricing" 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-bold"
              >
                💎 Pricing
              </Link>

              {/* Divider */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
              
              {/* User Actions */}
              {currentUser && !currentUser.is_admin && (
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>My Dashboard</span>
                  </Link>
                  
                  <Link 
                    href="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </Link>
                </>
              )}
              
              {currentUser?.is_admin && (
                <>
                  <Link 
                    href="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 rounded-lg transition-colors font-medium shadow-sm"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin Settings</span>
                  </Link>
                </>
              )}

              {/* Login/Logout */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition-colors w-full font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}


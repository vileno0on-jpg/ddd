'use client'

import React, { useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'
import { InitialQuizGate } from '@/components/quiz/InitialQuizGate'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <InitialQuizGate />
      <Header />
      <main className="flex-1 bg-white dark:bg-gray-900">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
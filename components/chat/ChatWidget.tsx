'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Crown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { CONFIG } from '@/lib/config'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Don't render during SSR
  if (!mounted) {
    return null
  }
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userPack, setUserPack] = useState<'free' | 'immigration' | 'masterclass' | 'citizenship'>('free')
  const [dailyMessages, setDailyMessages] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Hide chat widget on module pages
  const isModulePage = pathname?.startsWith('/modules/') ?? false

  // Mutual exclusivity: Listen for events from EmbeddedChat
  useEffect(() => {
    const handleCloseChatWidget = () => {
      setIsOpen(false)
    }
    window.addEventListener('closeChatWidget', handleCloseChatWidget)
    return () => window.removeEventListener('closeChatWidget', handleCloseChatWidget)
  }, [])

  // When ChatWidget opens, notify EmbeddedChat
  useEffect(() => {
    if (isOpen) {
      // Dispatch event to close EmbeddedChat
      window.dispatchEvent(new CustomEvent('chatWidgetOpened'))
      // Remove embedded chat flag
      localStorage.removeItem('embeddedChatOpen')
    }
  }, [isOpen])

  useEffect(() => {
    const init = async () => {
      if (!session?.user) {
        setUserPack('free')
        return
      }

      // Load user pack and limits
      try {
        const res = await fetch('/api/user/limits')
        if (res.ok) {
          const data = await res.json()
          setUserPack(data.packId || 'free')
          setDailyMessages(data.messagesToday || 0)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }

      // Load recent messages
      try {
        const msgRes = await fetch('/api/user/messages')
        if (msgRes.ok) {
          const msgData = await msgRes.json()
          const formattedMessages = msgData
            .flatMap((msg: any) => [
              { id: `u-${msg.created_at}`, role: 'user' as const, content: msg.message, timestamp: new Date(msg.created_at) },
              { id: `a-${msg.created_at}`, role: 'assistant' as const, content: msg.response || '', timestamp: new Date(msg.created_at) }
            ])
          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
    init()
  }, [session])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const canSendMessage = userPack === 'free' ? dailyMessages < CONFIG.ai.freeDailyLimit : true

  const handleSend = async () => {
    if (!input.trim() || !canSendMessage || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get user layer from localStorage for personalized responses
      const userLayer = typeof window !== 'undefined' ? localStorage.getItem('userLayer') : null
      
      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          packId: userPack,
          layer: userLayer || undefined, // Pass layer for personalized responses
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || data.message || 'Sorry, I could not process your request.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update daily limit if free tier
      if (userPack === 'free') {
        setDailyMessages(prev => prev + 1)
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: error?.message?.includes('limit') 
          ? 'Daily message limit reached. Please upgrade to unlock unlimited AI chat. [View Pricing](/pricing)'
          : `Sorry, an error occurred: ${error?.message || 'Unknown error'}. 

The AI chat uses a knowledge base system that works without API keys. For more powerful responses, add a free Groq API key (takes 2 minutes):
1. Sign up at https://console.groq.com
2. Get your API key
3. Add to .env.local: GROQ_API_KEY=your_key

Or try asking again - the knowledge base may still help!`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    setIsOpen(false)
    window.location.href = '/pricing'
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          // Check if EmbeddedChat is open - if so, don't open ChatWidget
          if (localStorage.getItem('embeddedChatOpen') === 'true') {
            return // Don't open if EmbeddedChat is open
          }
          setIsOpen(!isOpen)
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Immigration Assistant</span>
            </div>
            {userPack === 'free' && (
              <div className="flex items-center space-x-1 text-sm">
                <Crown className="w-4 h-4" />
                <span>{CONFIG.ai.freeDailyLimit - dailyMessages} left</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-semibold mb-2">AI Immigration Assistant</p>
                <p className="text-xs">Ask me anything about Swiss immigration!</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Limit Warning */}
          {!canSendMessage && (
            <div className="bg-orange-50 dark:bg-orange-900 border-t border-orange-200 dark:border-orange-800 p-3">
              <p className="text-xs text-orange-900 dark:text-orange-100 mb-2">
                Daily limit reached! Upgrade for unlimited access.
              </p>
              <button
                onClick={handleUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors"
              >
                Upgrade Now →
              </button>
            </div>
          )}

          {/* Disclaimer */}
          {messages.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900 border-t border-blue-200 dark:border-blue-800 p-2">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                ⚠️ {CONFIG.discord.disclaimer}
              </p>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={canSendMessage ? "Type your question..." : "Upgrade to continue"}
                disabled={!canSendMessage || isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!canSendMessage || isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


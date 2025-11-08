'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, CheckCircle, Clock, Play, FileText, Download,
  Award, HelpCircle, BarChart3, Menu, X, MessageCircle, ChevronRight,
  Bookmark, Share2, Maximize2, Minimize2, Book, Video, CheckSquare,
  Sparkles, Layers
} from 'lucide-react'
import { getAllModules, getAllModulesForAdmin, getModulePack } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/stripe'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatWidget from '@/components/chat/ChatWidget'

export default function ModuleView() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState<any>(null)
  const [packInfo, setPackInfo] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({})
  const [sectionReadTime, setSectionReadTime] = useState<Record<string, number>>({})
  const sectionTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const [categories, setCategories] = useState<Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }>>([])
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    const isAdmin = session?.user?.isAdmin || false
    const userPackId = session?.user?.packId || 'free'

    const moduleId = params.id as string
    let foundModule: any = null
    let foundPack: any = null
    let locked = false

    if (isAdmin) {
      const allModules = getAllModulesForAdmin()
      const matched = allModules.find((mod: any) => mod.id === moduleId)
      if (matched) {
        foundModule = matched
        const packId = getModulePack(matched.id)
        foundPack = PRICING_PACKS[packId as keyof typeof PRICING_PACKS] || null
      }
    } else {
      const modules = getAllModules(userPackId)
      const matched = modules.find((mod: any) => mod.id === moduleId)
      if (matched) {
        foundModule = matched
        foundPack = PRICING_PACKS[userPackId as keyof typeof PRICING_PACKS] || null
      } else {
        const allModules = getAllModulesForAdmin()
        const fallback = allModules.find((mod: any) => mod.id === moduleId)
        if (fallback) {
          foundModule = fallback
          const packId = getModulePack(fallback.id)
          foundPack = PRICING_PACKS[packId as keyof typeof PRICING_PACKS] || null
          locked = true
        }
      }
    }

    if (!foundModule) {
      router.push('/dashboard')
      return
    }

    setIsLocked(locked)
    setModule(foundModule)
    setPackInfo(foundPack)
    
    // Extract sections from markdown for table of contents
    if (foundModule.content) {
      const sections = extractSections(foundModule.content)
      setActiveSection(sections[0]?.id || '')
      
      // Organize sections into categories
      const organized = organizeSectionsIntoCategories(sections)
      setCategories(organized)
      
      if (!locked) {
        loadProgress(foundModule.id)
      }
    }

    setLoading(false)
  }, [session, status, router, params.id])

  const loadProgress = async (moduleId: string) => {
    if (isLocked) return
    try {
      const res = await fetch(`/api/modules/progress?moduleId=${moduleId}`)
      if (res.ok) {
        const data = await res.json()
        setProgress(data.progress || 0)
        setCompletedSections(data.sections || {})
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const updateSectionProgress = useCallback(async (sectionId: string, completed: boolean) => {
    if (!module || isLocked) return
    
    setCompletedSections(prev => {
      const updated = { ...prev, [sectionId]: completed }
      
      // Recalculate overall progress
      const allSections = extractSections(module.content || '')
      const total = allSections.length
      const completedCount = Object.values(updated).filter(Boolean).length
      const newProgress = total > 0 ? Math.round((completedCount / total) * 100) : 0
      setProgress(newProgress)
      
      return updated
    })
    
    try {
      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: module.id,
          sectionId,
          completed
        })
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }, [module, isLocked])

  const organizeSectionsIntoCategories = (sections: Array<{ id: string; title: string; level: number }>) => {
    const categories: Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }> = []
    let currentCategory: { title: string; sections: Array<{ id: string; title: string; level: number }> } | null = null

    sections.forEach((section) => {
      // H1 sections are category headers
      if (section.level === 1) {
        // Save previous category if exists
        if (currentCategory) {
          categories.push(currentCategory)
        }
        // Start new category
        currentCategory = {
          title: section.title,
          sections: []
        }
      } else {
        // Add to current category or create default
        if (!currentCategory) {
          currentCategory = {
            title: 'Introduction',
            sections: []
          }
        }
        currentCategory.sections.push(section)
      }
    })

    // Add last category
    if (currentCategory) {
      categories.push(currentCategory)
    }

    // If no categories found, create one default
    if (categories.length === 0) {
      categories.push({
        title: 'Module Content',
        sections
      })
    }

    return categories
  }

  const extractSections = (content: string) => {
    const lines = content.split('\n')
    const sections: Array<{ id: string; title: string; level: number }> = []
    
    lines.forEach((line) => {
      if (line.startsWith('#')) {
        const level = (line.match(/^#+/)?.[0] || '').length
        const title = line.replace(/^#+\s*/, '').trim()
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        sections.push({ id, title, level })
      }
    })
    
    return sections
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  // Track scroll position and mark sections as read
  useEffect(() => {
    if (!contentRef.current || !module) return

    const handleScroll = () => {
      const sections = extractSections(module.content || '')
      const viewportHeight = window.innerHeight

      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()

        // Update active section based on scroll (section is near top of viewport)
        if (rect.top <= 150 && rect.bottom >= 100) {
          setActiveSection(section.id)
        }
      })
    }

    // Use Intersection Observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '-200px 0px -200px 0px',
      threshold: 0.3
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id
        if (entry.isIntersecting && !completedSections[sectionId]) {
          if (!sectionTimers.current[sectionId]) {
            sectionTimers.current[sectionId] = setTimeout(() => {
              updateSectionProgress(sectionId, true)
              delete sectionTimers.current[sectionId]
            }, 3000) // 3 seconds minimum reading time
          }
        } else if (!entry.isIntersecting && sectionTimers.current[sectionId]) {
          // Clear timer if section is no longer in view
          clearTimeout(sectionTimers.current[sectionId])
          delete sectionTimers.current[sectionId]
        }
      })
    }, observerOptions)

    // Observe all section elements
    const sections = extractSections(module.content || '')
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    // Also listen to scroll for active section tracking
    const contentElement = contentRef.current
    contentElement.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      contentElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      // Clear all timers
      Object.values(sectionTimers.current).forEach(timer => clearTimeout(timer))
    }
  }, [module, completedSections, updateSectionProgress])

  const handleQuizSubmit = () => {
    if (!module.quiz) return
    
    const totalQuestions = module.quiz.questions.length
    let correct = 0
    
    module.quiz.questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.options[q.correct]) {
        correct++
      }
    })
    
    const score = Math.round((correct / totalQuestions) * 100)
    setQuizScore(score)
    
    // Update progress
    if (score >= 80) {
      setProgress(100)
    } else if (score >= 60) {
      setProgress(75)
    } else {
      setProgress(50)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Module Not Found
          </h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (isLocked) {
    const owningPackId = getModulePack(module.id)
    const owningPack = PRICING_PACKS[owningPackId as keyof typeof PRICING_PACKS]

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-3">
                  Locked Premium Module
                </span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {module.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  This expert module lives inside the {owningPack?.name || 'premium'} plan. Upgrade to unlock the full legal strategy, checklists, and interactive tools.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                View Upgrade Options →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What you’ll unlock
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Full legal references and SEM-backed playbook</li>
                  <li>• Downloadable templates, checklists, and calculators</li>
                  <li>• Interactive progress tracking and milestone reminders</li>
                </ul>
              </div>
              <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Module snapshot
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {module.description}
                </p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  Part of {owningPack?.name || 'Premium Pack'}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              Already upgraded? Make sure you’re logged in with the right account.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const sections = module.content ? extractSections(module.content) : []
  const isAdmin = session?.user?.isAdmin || false

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Sidebar - Table of Contents */}
      {showTableOfContents && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 overflow-y-auto"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <button
                onClick={() => setShowTableOfContents(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                {packInfo?.name || 'Module'}
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs">
                {module.type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {module.title}
            </h2>
            {module.duration && (
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <Clock className="w-4 h-4" />
                <span>{module.duration}</span>
              </div>
            )}
          </div>

          {/* Table of Contents - Organized by Categories */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Table of Contents
            </h3>
            <nav className="space-y-4">
              {categories.map((category, catIdx) => (
                <div key={catIdx} className="space-y-2">
                  {/* Category Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      {category.title}
                    </h4>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  
                  {/* Category Sections */}
                  {category.sections.map((section, idx) => (
                    <button
                      key={`${catIdx}-${idx}`}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                        activeSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } ${
                        completedSections[section.id]
                          ? 'border-l-[3px] border-green-500 dark:border-green-400'
                          : ''
                      }`}
                      style={{ paddingLeft: `${(section.level - 1) * 12 + 12}px` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex-1">{section.title}</span>
                        {completedSections[section.id] && (
                          <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            {/* Completion Summary */}
            {Object.keys(completedSections).length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>Sections Completed</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {Object.values(completedSections).filter(Boolean).length} / {sections.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(completedSections).filter(Boolean).length / sections.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            {!showTableOfContents && (
              <button
                onClick={() => setShowTableOfContents(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {module.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {module.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {chatOpen && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Content + Chat Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto" ref={contentRef}>
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Module Header with Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {categories.length} Categories
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {module.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {module.description}
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Complete</div>
                    </div>
                    {progress === 100 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                      >
                        <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Category Pills */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map((category, idx) => {
                      const categorySections = category.sections
                      const completedCount = categorySections.filter(s => completedSections[s.id]).length
                      const totalCount = categorySections.length
                      const categoryProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
                      
                      return (
                        <div
                          key={idx}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            categoryProgress === 100
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : categoryProgress > 0
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{category.title}</span>
                            {categoryProgress === 100 && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs opacity-75">
                              ({completedCount}/{totalCount})
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>

              {/* Video Placeholder */}
              {module.type === 'video' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Play className="w-20 h-20 text-blue-600 dark:text-blue-400 mb-4" />
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Video Content Coming Soon
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        This module includes video explanations
                      </p>
                    </div>
                  </div>
                  {module.content && (
                    <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
                      <h3 className="text-xl font-bold mb-4">Video Transcript</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {module.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Interactive Checklist Section */}
              {module.content && module.content.includes('## Interactive Checklist') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckSquare className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Interactive Checklist
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Track your progress as you work through this module
                  </p>
                  <div className="space-y-3">
                    {module.content.split('\n').filter((line: string) => line.trim().startsWith('- [ ]')).slice(0, 10).map((line: string, idx: number) => {
                      const item = line.replace('- [ ]', '').trim()
                      return (
                        <label key={idx} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </label>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Module Content */}
              {module.content && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-lg dark:prose-invert max-w-none mb-8"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                        const isCompleted = completedSections[id]
                        return (
                          <div className="relative group mb-6">
                            <h1 
                              id={id} 
                              className="scroll-mt-20 text-4xl font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between"
                            >
                              <span {...props} />
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-4 flex-shrink-0"
                                >
                                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  </div>
                                </motion.div>
                              )}
                            </h1>
                            {isCompleted && (
                              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        )
                      },
                      h2: ({ node, ...props }) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                        const isCompleted = completedSections[id]
                        return (
                          <div className="relative group mb-4 mt-8">
                            <h2 
                              id={id} 
                              className="scroll-mt-20 text-3xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-between"
                            >
                              <span {...props} />
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-4 flex-shrink-0"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                                </motion.div>
                              )}
                            </h2>
                            {isCompleted && (
                              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        )
                      },
                      h3: ({ node, ...props }) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                        const isCompleted = completedSections[id]
                        return (
                          <div className="relative group mb-3 mt-6">
                            <h3 
                              id={id} 
                              className="scroll-mt-20 text-2xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between"
                            >
                              <span {...props} />
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-3 flex-shrink-0"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                                </motion.div>
                              )}
                            </h3>
                          </div>
                        )
                      },
                      p: ({ node, ...props }) => (
                        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="mb-4 ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-300" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="mb-4 ml-6 space-y-2 list-decimal text-gray-700 dark:text-gray-300" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />
                      ),
                      code: ({ node, inline, ...props }: any) => {
                        if (inline) {
                          return (
                            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-red-600 dark:text-red-400" {...props} />
                          )
                        }
                        return (
                          <code className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props} />
                        )
                      },
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />
                      ),
                    }}
                  >
                    {module.content}
                  </ReactMarkdown>
                </motion.div>
              )}

              {/* Interactive Quiz */}
              {module.quiz && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Interactive Quiz
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {module.quiz.questions.map((q: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          {q.question}
                        </h3>
                        <div className="space-y-2 ml-11">
                          {q.options.map((opt: string, optIdx: number) => (
                            <label
                              key={optIdx}
                              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                quizAnswers[idx] === opt
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${idx}`}
                                value={opt}
                                checked={quizAnswers[idx] === opt}
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== module.quiz.questions.length}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                    {quizScore !== null && (
                      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {quizScore}%
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {quizScore >= 80
                            ? 'Excellent work! 🎉 You mastered this module!'
                            : quizScore >= 60
                            ? 'Good job! 👍 Keep practicing!'
                            : 'Keep learning! 💪 Review the content and try again!'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Practice Exercises */}
              {module.exercises && module.exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Practice Exercises
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.exercises.map((exercise: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {exercise.title}
                            </h3>
                          </div>
                          <CheckSquare className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {exercise.description}
                        </p>
                        <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Start Exercise
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Attachments */}
              {module.attachments && module.attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Download className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Downloads
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {module.attachments.map((attachment: string, idx: number) => (
                      <a
                        key={idx}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {attachment.split('/').pop() || `Attachment ${idx + 1}`}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Completion Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setProgress(100)
                    alert('Module completed! 🎉')
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark as Complete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Chat */}
          {chatOpen && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-screen"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span>AI Study Assistant</span>
                </h3>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      👋 Hi! I'm here to help you understand this module. Ask me anything about:
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Key concepts and definitions</li>
                      <li>• Step-by-step processes</li>
                      <li>• Real-world examples</li>
                      <li>• Clarification on confusing parts</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <ChatWidget />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile TOC Toggle */}
      {!showTableOfContents && (
        <button
          onClick={() => setShowTableOfContents(true)}
          className="fixed bottom-6 left-6 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}


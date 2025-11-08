'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Clock, Play, FileText, Download, Award, HelpCircle, BarChart3, Menu, X, MessageCircle, Maximize2, Minimize2, Bookmark } from 'lucide-react'
import { getAllModulesForAdmin, getModulePack } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/stripe'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AdminModuleView() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState<any>(null)
  const [packInfo, setPackInfo] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    if (!session.user.isAdmin) {
      router.push('/dashboard')
      return
    }

    const moduleId = params.id as string
    const modules = getAllModulesForAdmin()
    const matched = modules.find((mod: any) => mod.id === moduleId)

    if (matched) {
      setModule(matched)
      const packId = getModulePack(matched.id)
      setPackInfo(PRICING_PACKS[packId as keyof typeof PRICING_PACKS] || null)

      if (matched.content) {
        const sections = extractSections(matched.content)
        const organized = organizeSectionsIntoCategories(sections)
        setCategories(organized)
        setActiveSection(sections[0]?.id || '')
      }
    }

    setLoading(false)
  }, [session, status, router, params.id])

  const handleQuizSubmit = () => {
    // Mock quiz scoring - in real app, compare with correct answers
    const totalQuestions = module.quiz?.questions?.length || 0
    if (totalQuestions > 0) {
      const correct = Object.keys(quizAnswers).length
      setQuizScore(Math.round((correct / totalQuestions) * 100))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Module Not Found
          </h1>
          <Link href="/admin" className="text-purple-600 hover:text-purple-700">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
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

  const sections = module.content ? extractSections(module.content) : []
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  const [chatOpen, setChatOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }>>([])

  const organizeSectionsIntoCategories = (sections: Array<{ id: string; title: string; level: number }>) => {
    const categories: Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }> = []
    let currentCategory: { title: string; sections: Array<{ id: string; title: string; level: number }> } | null = null

    sections.forEach((section) => {
      if (section.level === 1) {
        if (currentCategory) {
          categories.push(currentCategory)
        }
        currentCategory = {
          title: section.title,
          sections: []
        }
      } else {
        if (!currentCategory) {
          currentCategory = {
            title: 'Introduction',
            sections: []
          }
        }
        currentCategory.sections.push(section)
      }
    })

    if (currentCategory) {
      categories.push(currentCategory)
    }

    if (categories.length === 0) {
      categories.push({
        title: 'Module Content',
        sections
      })
    }

    return categories
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
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
                href="/admin"
                className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Back to Admin</span>
              </Link>
              <button
                onClick={() => setShowTableOfContents(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
                {packInfo?.name || 'Module'}
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
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
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      style={{ paddingLeft: `${(section.level - 1) * 12 + 12}px` }}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              ))}
            </nav>

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
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
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
                      h1: ({ node, ...props }) => (
                        <h1 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20" {...props} />
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
                    {module.quiz.questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          {q.question}
                        </h3>
                        <div className="space-y-2 ml-11">
                          {q.options?.map((opt: string, optIdx: number) => (
                            <label
                              key={optIdx}
                              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                quizAnswers[idx] === opt
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${idx}`}
                                value={opt}
                                checked={quizAnswers[idx] === opt}
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                                className="w-4 h-4 text-purple-600"
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
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                    {quizScore !== null && (
                      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-900/20 dark:to-purple-900/20 rounded-lg border border-green-200 dark:border-green-700">
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
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
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
                          <CheckCircle className="w-5 h-5 text-gray-400" />
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
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {attachment.split('/').pop() || `Attachment ${idx + 1}`}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
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
                  <MessageCircle className="w-5 h-5 text-purple-600" />
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
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
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
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  AI chat powered by Groq
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile TOC Toggle */}
      {!showTableOfContents && (
        <button
          onClick={() => setShowTableOfContents(true)}
          className="fixed bottom-6 left-6 lg:hidden bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}


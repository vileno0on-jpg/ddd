'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCircle, Download, BookOpen, MessageCircle, TrendingUp, Crown, ChevronRight, Check, Lock, Play } from 'lucide-react'
import { PRICING_PACKS } from '@/lib/stripe'
import { getPackContent, getModulesForPack, getProgressPercentage, getAllModulesForAdmin, getModulePack } from '@/lib/content/pack-content'

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<any[]>([])
  const [previewModules, setPreviewModules] = useState<Array<{ module: any; packId: string }>>([])
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'resources' | 'progress'>('overview')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    // Redirect admins to admin panel
    if (session.user.isAdmin) {
      router.push('/admin')
      return
    }

    // Map session to user object
    const userData = {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.name,
      pack_id: session.user.packId || 'free',
      is_admin: session.user.isAdmin || false,
    }

    setUser(userData)
    
    // Load pack content
    const packContent = getPackContent(userData.pack_id)
    if (packContent) {
      const packModules = getModulesForPack(userData.pack_id)
      setModules(packModules)
      setProgress(getProgressPercentage(packModules))

      const previewsForOtherPacks: Array<{ module: any; packId: string }> = []
      const counts: Record<string, number> = {}
      const allModules = getAllModulesForAdmin()

      for (const mod of allModules) {
        const packId = getModulePack(mod.id)
        if (!packId || packId === userData.pack_id) {
          continue
        }
        counts[packId] = counts[packId] || 0
        if (counts[packId] >= 2) {
          continue
        }
        counts[packId] += 1
        previewsForOtherPacks.push({ module: mod, packId })
      }

      setPreviewModules(previewsForOtherPacks)
    }
    
    setLoading(false)
  }, [session, status, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  const isFree = user?.pack_id === 'free'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.full_name || 'User'}!
              </h1>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile Settings
            </Link>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Crown className="w-4 h-4 mr-1" />
              {user?.pack_id?.toUpperCase() || 'FREE'} PACK
            </span>
            {isFree && (
              <a
                href="/pricing"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all text-sm"
              >
                Upgrade to Unlock All Content →
              </a>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'content', label: 'My Content', icon: BookOpen },
              { id: 'resources', label: 'Resources', icon: Download },
              { id: 'progress', label: 'Progress', icon: UserCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {activeTab === 'overview' && <OverviewTab user={user} modules={modules} progress={progress} />}
          {activeTab === 'content' && (
            <ContentTab
              user={user}
              modules={modules}
              isFree={isFree}
              previewModules={previewModules}
            />
          )}
          {activeTab === 'resources' && <ResourcesTab user={user} isFree={isFree} />}
          {activeTab === 'progress' && <ProgressTab user={user} modules={modules} progress={progress} />}
        </motion.div>
      </div>
    </div>
  )
}

function OverviewTab({ user, modules, progress }: any) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{progress}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Guide Progress</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">AI Messages Used</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900 flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">CVs Created</div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#ai-chat" className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
            <span className="font-medium text-gray-900 dark:text-white">AI Chat</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
          <a href="/pricing" className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
            <span className="font-medium text-gray-900 dark:text-white">Browse Packs</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
          <a href="/resources" className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
            <span className="font-medium text-gray-900 dark:text-white">Downloads</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  )
}

function ContentTab({ user, modules, isFree, previewModules }: any) {
  const premiumHighlights = [
    {
      title: 'Cantonal Success Playbook',
      description: 'Advanced Pack members get 10x more cantonal data, salary scripts, and embassy-ready dossiers.',
      badge: 'Advanced Pack',
      href: '/pricing',
    },
    {
      title: 'Citizenship Timeline Planner',
      description: 'Unlock a personalised 10-year roadmap with StAG & OLN compliance checks built in.',
      badge: 'Citizenship Pro',
      href: '/pricing#citizenship',
    },
    {
      title: 'AI Permit Strategy Coach',
      description: 'Chat with our legal-grade AI tutor for unlimited document reviews and interview prep.',
      badge: 'All Paid Packs',
      href: '/pricing',
    },
  ]

  return (
    <div className="space-y-8">
      {isFree && (
        <div className="card p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-900/40 dark:via-gray-900 dark:to-purple-900/40 border-blue-100 dark:border-blue-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-3">
                FREE PREVIEW ACCESS
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Start with our trusted foundation modules
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You’re seeing the same legal-grade frameworks we use with paying clients. Finish these two guides, then unlock the complete system when you’re ready.
              </p>
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              See Everything You Unlock →
            </a>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isFree ? 'Unlocked Starter Modules' : 'Your Content Modules'}
        </h2>
        {modules.length === 0 ? (
          <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
            No modules available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module: any, idx: number) => (
              <Link
                href={`/modules/${module.id}`}
                key={module.id}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-6 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        module.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {module.completed ? (
                          <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {module.title}
                          </h3>
                          {isFree && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              FREE PREVIEW
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{module.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          {module.duration && <span>{module.duration}</span>}
                          {module.duration && <span>•</span>}
                          <span className="capitalize">{module.type}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {!isFree && modules.length === 0 && (
        <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
          No modules available yet for your pack.
        </div>
      )}

      {!isFree && previewModules.length > 0 && (
        <div className="card p-6 border border-dashed border-purple-300 dark:border-purple-700 bg-white/60 dark:bg-gray-900/60">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Explore what other members unlock
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                These premium modules come from our other packs. Upgrade to gain full access instantly.
              </p>
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:from-purple-700 hover:to-blue-800 transition-all"
            >
              Compare Packs →
            </a>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewModules.map(({ module, packId }: any) => {
              const packName = PRICING_PACKS[packId as keyof typeof PRICING_PACKS]?.name || packId
              return (
                <div
                  key={module.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                >
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    {packName}
                  </span>
                  <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                    {module.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {module.description || 'Premium module available in this pack.'}
                  </p>
                  <button
                    onClick={() => (window.location.href = '/pricing')}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Upgrade to Unlock →
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isFree && (
        <div className="card p-6 border border-dashed border-blue-300 dark:border-blue-700 bg-white/60 dark:bg-gray-900/60">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to unlock the full Immigration Masterclass?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upgrade to access 20+ premium modules, interactive calculators, AI strategy coaches, and the exact legal templates that boost approval rates to 92%.
              </p>
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all"
            >
              Upgrade Now →
            </a>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumHighlights.map((highlight) => (
              <a
                key={highlight.title}
                href={highlight.href}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-white dark:bg-gray-800 hover:shadow-lg"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  {highlight.badge}
                </span>
                <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {highlight.title}
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {highlight.description}
                </p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Learn more →
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ResourcesTab({ user, isFree }: any) {
  const resources = {
    immigration: [
      { name: 'Work Permit Application Form', type: 'PDF', category: 'Forms' },
      { name: 'Employment Contract Template', type: 'Template', category: 'Templates' },
      { name: 'Document Checklist', type: 'PDF', category: 'Checklists' },
      { name: 'Quota Tracker Spreadsheet', type: 'Excel', category: 'Tools' }
    ],
    advanced: [
      { name: 'Integration Test Prep Guide', type: 'PDF', category: 'Exam Prep' },
      { name: 'Tax Optimization Strategies', type: 'PDF', category: 'Financial' },
      { name: 'Housing Application Templates', type: 'Template', category: 'Housing' }
    ],
    citizenship: [
      { name: 'Citizenship Application Form', type: 'PDF', category: 'Forms' },
      { name: 'Integration Practice Exam', type: 'PDF', category: 'Exam Prep' },
      { name: 'Language B1 Study Guide', type: 'PDF', category: 'Language' }
    ]
  }

  if (isFree) {
    return (
      <div className="text-center py-12">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade to Download Resources</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Access all templates, checklists, and guides</p>
        <a href="/pricing" className="inline-block btn-primary">
          View Pricing →
        </a>
      </div>
    )
  }

  const packResources = resources[user?.pack_id as keyof typeof resources] || []

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Downloads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packResources.map((resource: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="card p-4 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
                {resource.type}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{resource.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{resource.category}</p>
            <button className="mt-4 w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              Download →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ProgressTab({ user, modules, progress }: any) {
  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Learning Progress</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Overall Completion</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className="bg-blue-600 h-4 rounded-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{modules.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Modules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {modules.filter((m: any) => m.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Getting Started', description: 'Complete your first module', unlocked: true },
            { name: 'Quarter Way', description: 'Complete 25% of content', unlocked: progress >= 25 },
            { name: 'Halfway Hero', description: 'Complete 50% of content', unlocked: progress >= 50 },
            { name: 'Almost There', description: 'Complete 75% of content', unlocked: progress >= 75 },
            { name: 'Complete!', description: 'Finish all modules', unlocked: progress >= 100 }
          ].map((achievement, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
              }`}
            >
              {achievement.unlocked ? (
                <Check className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
              ) : (
                <Lock className="w-6 h-6 text-gray-400 mb-2" />
              )}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

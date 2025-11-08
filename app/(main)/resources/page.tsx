'use client'

import { motion } from 'framer-motion'
import { Download, FileText, BookOpen, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Resources & Downloads
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Free and premium resources to help you navigate Swiss immigration
          </p>
        </motion.div>

        {/* Free Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            🆓 Free Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Basic Immigration Guide', type: 'PDF Guide', downloads: '12.5k' },
              { title: 'Swiss Salary Benchmarks', type: 'Infographic', downloads: '8.3k' },
              { title: 'Visa Types Overview', type: 'PDF Checklist', downloads: '15.1k' },
            ].map((resource, idx) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6"
              >
                <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {resource.type}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    📥 {resource.downloads} downloads
                  </span>
                  <button className="btn-secondary text-sm">
                    <Download className="w-4 h-4 inline-block mr-1" />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium Resources */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              ⭐ Premium Resources
            </h2>
            <Link href="/pricing" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
              Unlock All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '20+ CV Templates',
                icon: FileText,
                pack: 'Immigration',
                badge: '20+ Templates',
              },
              {
                title: 'Comprehensive Guides',
                icon: BookOpen,
                pack: 'Advanced',
                badge: '10 Modules',
              },
              {
                title: 'Citizenship Roadmap',
                icon: CheckCircle,
                pack: 'Citizenship Pro',
                badge: '10-Year Plan',
              },
            ].map((resource, idx) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 border-2 border-blue-200 dark:border-blue-800 relative"
              >
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {resource.pack}
                </div>
                <resource.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {resource.badge}
                </p>
                <Link
                  href="/pricing"
                  className="btn-primary w-full text-center text-sm"
                >
                  Upgrade to Access
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 dark:bg-blue-900 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Visa Guide', link: '/visas' },
              { title: 'Employment Hub', link: '/employment' },
              { title: 'Citizenship Paths', link: '/citizenship' },
              { title: 'My Content', link: '/dashboard' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="block text-center bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-800 p-6 rounded-lg transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.title} →
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}


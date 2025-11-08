'use client'

import { motion } from 'framer-motion'
import { Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react'

export default function EmploymentPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Swiss Employment Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Navigate Swiss job market, quotas, and employment requirements
          </p>
        </motion.div>

        {/* Live Quota Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900 border-l-4 border-red-600 dark:border-red-400 p-6 rounded-lg mb-12"
        >
          <div className="flex items-center mb-3">
            <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
              2025 Non-EU Work Quotas
            </h3>
          </div>
          <p className="text-red-800 dark:text-red-200 text-lg">
            <strong>Permits are subject to annual federal quotas</strong> (4,000 L + 4,500 B permits in recent years)
          </p>
          <p className="text-red-700 dark:text-red-300 mt-2">
            Updated: November 2025 • Source: SEM
          </p>
        </motion.div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: Briefcase,
              title: 'Salary Expectations',
              content: 'Professional roles in Switzerland typically start at CHF 80,000+. Tech, finance, and pharma sectors offer CHF 120k+ for senior roles. Check salary benchmarks by canton and industry.',
            },
            {
              icon: Users,
              title: 'CV Templates',
              content: '20+ ATS-optimized Swiss CV templates. Tech, finance, medicine, engineering, and general formats. Customizable with drag-drop editor. Export PDF/Word.',
            },
            {
              icon: DollarSign,
              title: 'Tax & Benefits',
              content: 'Swiss tax is relatively low with excellent social benefits. Health insurance mandatory, pension system (BVG), and unemployment insurance included.',
            },
            {
              icon: TrendingUp,
              title: 'Embassy Process',
              content: 'Step-by-step embassy submission guides. Document checklists, appointment booking, timeline expectations per canton and embassy location.',
            },
          ].map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card p-8"
            >
              <section.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Unlock All Employment Resources
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get CV templates, embassy guides, checklists, and personalized AI assistance
          </p>
          <a href="/pricing" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all">
            View Packs →
          </a>
        </motion.div>
      </div>
    </div>
  )
}


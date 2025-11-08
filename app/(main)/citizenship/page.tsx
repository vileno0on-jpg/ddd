'use client'

import { motion } from 'framer-motion'
import { Calendar, Globe, BookOpen, CheckCircle } from 'lucide-react'

export default function CitizenshipPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Swiss Citizenship Paths
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your roadmap to Swiss citizenship - timelines, requirements, and shortcuts
          </p>
        </motion.div>

        {/* Citizenship Paths Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-16 overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Path</th>
                <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Residency</th>
                <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Language</th>
                <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Other Requirements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                {
                  path: 'Ordinary Naturalization',
                  residency: '10 years (C permit)',
                  language: 'B1 German/FR/IT',
                  other: 'Integration test, no criminal record',
                },
                {
                  path: 'Simplified (Spouse)',
                  residency: '5 years marriage + 3 in CH',
                  language: 'A2+ (conversational)',
                  other: 'Visits proof, close ties to Switzerland',
                },
                {
                  path: 'Simplified (3rd Gen)',
                  residency: 'Born in CH, 5 years residence',
                  language: 'B1',
                  other: 'Good conduct, integration',
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{row.path}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{row.residency}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{row.language}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Calendar,
              title: 'Residency',
              items: ['C permit holder', '10 consecutive years', 'Valid documents'],
            },
            {
              icon: BookOpen,
              title: 'Language',
              items: ['B1 certification', 'German/French/Italian', 'Speaking + writing'],
            },
            {
              icon: Globe,
              title: 'Integration',
              items: ['Integration test', 'Cultural knowledge', 'Swiss values'],
            },
            {
              icon: CheckCircle,
              title: 'Conduct',
              items: ['No criminal record', 'Good reputation', 'Financial stability'],
            },
          ].map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="card p-6"
            >
              <section.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, iidx) => (
                  <li key={iidx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Roadmap CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-2xl p-12 border border-purple-200 dark:border-purple-800"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            🎯 Get Your Citizenship Roadmap
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center">
            Citizenship Pro Pack includes step-by-step 10-year roadmap, shortcuts, language prep, and personalized timeline
          </p>
          <div className="text-center">
            <a href="/pricing" className="inline-block btn-primary">
              View Citizenship Pro Pack →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


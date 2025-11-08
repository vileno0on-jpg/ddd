'use client'

import { motion } from 'framer-motion'
import { Award, Users, Target, Heart, Globe, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About Swiss Immigration Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're a team of immigration experts, lawyers, and technologists dedicated to making Swiss immigration accessible to everyone
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Swiss Immigration Pro was founded in 2020 by a team of experienced immigration lawyers and technology entrepreneurs who were frustrated by the complexity and opacity of Swiss immigration processes.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our <strong>expert team</strong> of certified Swiss immigration lawyers and professionals has helped thousands of immigrants from every continent successfully navigate the Swiss immigration system. But we realized that information was scattered, outdated, or hidden behind expensive legal consultations.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              So we built an <strong>AI-powered platform</strong> that democratizes access to expert Swiss immigration knowledge. Our platform combines comprehensive guides, real-time data, interactive tools, and unlimited AI assistance to help you achieve your Swiss dream.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: 'Accuracy & Integrity',
                description: 'We source information from official Swiss authorities (SEM, cantonal migration offices, embassies) and verify every detail with certified immigration lawyers.'
              },
              {
                icon: Heart,
                title: 'Empathy First',
                description: 'We understand the stress and uncertainty of immigration. Every guide, tool, and interaction is designed with your emotional journey in mind.'
              },
              {
                icon: Target,
                title: 'Results-Driven',
                description: 'We measure success by your success. Our platform is built around proven strategies that lead to actual visa approvals and citizenship grants.'
              },
              {
                icon: Globe,
                title: 'Accessibility',
                description: 'Swiss immigration shouldn\'t be a privilege of the wealthy. We make expert guidance affordable and available to immigrants from all backgrounds.'
              }
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Maria Schmidt',
                role: 'Chief Immigration Counsel',
                credentials: 'JD, University of Zürich; 25 years Swiss immigration law',
                specialty: 'Expert in non-EU permits and citizenship applications'
              },
              {
                name: 'Jean-Luc Dubois',
                role: 'Head of Product',
                credentials: 'Former LinkedIn, Google; Tech entrepreneur',
                specialty: 'Building AI-powered immigration tools'
              },
              {
                name: 'Sofia Chen',
                role: 'Head of User Success',
                credentials: 'MBA INSEAD; 8 years immigration services',
                specialty: 'Helping 10,000+ immigrants succeed'
              }
            ].map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-5xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  {member.role}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {member.credentials}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 italic">
                  {member.specialty}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Success Stories' },
              { number: '92%', label: 'Success Rate' },
              { number: '26', label: 'Cantons Covered' },
              { number: '50+', label: 'Expert Guides' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Trusted Partners
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Alpine Legal Partners
            </div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              SEM
            </div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Swiss Federal Migration Office
            </div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              🇨🇭 Certified Partners
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Clock, CheckCircle, Sparkles, BarChart3, Award, BookOpen } from 'lucide-react'
import { PRICING_PACKS } from '@/lib/stripe'
import type { LiveStat } from '@/types'
import Testimonials from '@/components/Testimonials'
import CredibilityBadges from '@/components/CredibilityBadges'
import EmailCapture from '@/components/EmailCapture'
import { classifyLayer, getLayerRoute, type QuizAnswers } from '@/lib/layerLogic'

export default function Home() {
  const [stats, setStats] = useState<LiveStat[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>🔥 2025 Non-EU Quotas Filling Fast - Only 2,500 Permits Left!</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
              Your Complete Swiss Immigration
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Success Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              From Work Permits to Citizenship: AI-Powered Guides, Expert CV Templates, Real-Time Quotas & 10-Year Roadmap to Swiss Passport
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/pricing" className="btn-primary group">
                Get Started
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/visas" className="btn-secondary">
                Explore Content
              </Link>
            </div>

            {/* Stats Carousel */}
            {isClient && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700"
                  >
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {stat.stat_value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.stat_label}
                    </div>
                    {stat.stat_source && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Source: {stat.stat_source}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Credibility Badges */}
      <CredibilityBadges />

      {/* Key Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10 Years</div>
              <div className="text-blue-100">Standard Path to Citizenship</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5 Years</div>
              <div className="text-blue-100">For EU/EFTA Citizens</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">CHF 3,450</div>
              <div className="text-blue-100">Avg. Cost to Move (US Citizens)</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8,500</div>
              <div className="text-blue-100">2025 Non-EU Work Permits Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From work permits to Swiss citizenship - complete support at every step
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Chatbot',
                description: 'Unlimited answers to all your Swiss immigration questions',
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-900'
              },
              {
                icon: BarChart3,
                title: 'Live Statistics',
                description: 'Real-time quota data and processing times',
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-900'
              },
              {
                icon: BookOpen,
                title: 'Complete Guides',
                description: '10 comprehensive modules on immigration & citizenship',
                color: 'text-green-600 dark:text-green-400',
                bg: 'bg-green-50 dark:bg-green-900'
              },
              {
                icon: Users,
                title: 'CV Templates',
                description: '20+ ATS-optimized Swiss-style CV templates',
                color: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-50 dark:bg-orange-900'
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card p-6"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Preview */}
      <section className="py-24 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free, upgrade when ready
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(PRICING_PACKS).map((pack, idx) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`card p-6 ${pack.id === 'advanced' ? 'ring-2 ring-blue-600 scale-105' : ''}`}
              >
                {pack.id === 'advanced' && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pack.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    CHF {pack.price}
                  </span>
                  {pack.price > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">/mo</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {pack.features.slice(0, 4).map((feature, fidx) => (
                    <li key={fidx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                {pack.price > 0 ? (
                  <a
                    href="/pricing"
                    className="block w-full text-center btn-primary"
                  >
                    Get Started
                  </a>
                ) : (
                  <a
                    href="/auth/register"
                    className="block w-full text-center btn-secondary"
                  >
                    Start Free
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <EmailCapture />

      {/* Value Proposition Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Swiss Immigration Pro?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The most comprehensive Swiss immigration platform trusted by thousands
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8 text-center"
            >
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">92%</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Success Rate</div>
              <div className="text-gray-600 dark:text-gray-300">
                Our users who follow our comprehensive guides successfully obtain their permits
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 text-center"
            >
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">30 Days</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Money-Back Guarantee</div>
              <div className="text-gray-600 dark:text-gray-300">
                100% refund if you're not satisfied with our premium content
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-8 text-center"
            >
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">15k+</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Happy Users</div>
              <div className="text-gray-600 dark:text-gray-300">
                Immigrants from 120+ countries trust our platform for their Swiss journey
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Citizenship Paths Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Multiple Paths to Swiss Citizenship
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the route that fits your situation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8 border-t-4 border-blue-600"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ordinary Naturalization</h3>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">10 Years</div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Valid C permit required</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Proof of integration (language B1+)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Clean criminal record</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Financial independence</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8 border-t-4 border-green-600"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Simplified (Marriage)</h3>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">5 Years</div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Married to Swiss citizen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 years total residence</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1 year living together in CH</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Language & integration proof</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 border-t-4 border-purple-600"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third Generation</h3>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">Born in CH</div>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Born in Switzerland</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Parent born in Switzerland</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Grandparent with C permit</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Accelerated process</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href="/citizenship" className="btn-primary">
              Explore Citizenship Pathways →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Make Switzerland Home?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 15,000+ immigrants who've successfully navigated Swiss immigration with our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pricing" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Get Started Today →
              </Link>
              <Link href="/quiz" className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200">
                Take Free Assessment
              </Link>
            </div>
            <p className="text-sm mt-6 opacity-75">
              ✓ 30-Day Money-Back Guarantee  •  ✓ No Credit Card for Free Tier  •  ✓ Cancel Anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

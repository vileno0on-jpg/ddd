'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Sparkles, Crown } from 'lucide-react'
import { PRICING_PACKS } from '@/lib/stripe'
import { PricingPack } from '@/types'

export default function Pricing() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)

  const handleCheckout = async (packId: string) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })

      const data = await response.json()

      if (response.status === 401) {
        // User not logged in, redirect to login
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to initiate checkout. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ✓ 30-Day Money-Back Guarantee on All Plans
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Path to Success
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Start free and upgrade anytime. All plans include our comprehensive resources and expert guidance.
          </p>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
            Save CHF 5,000+ on immigration consultants • Get lifetime access to guides • Cancel anytime
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {Object.values(PRICING_PACKS).map((pack: PricingPack, idx) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`card p-8 relative ${
                pack.id === 'advanced' ? 'ring-2 ring-blue-600 scale-105 shadow-2xl' : ''
              }`}
            >
              {pack.id === 'advanced' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold px-4 py-1 rounded-full inline-flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pack.name}
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    CHF {typeof pack.price === 'number' ? pack.price.toFixed(2) : pack.price}
                  </span>
                  {pack.price > 0 && (
                    <span className="text-gray-600 dark:text-gray-400 text-lg">/mo</span>
                  )}
                </div>
                {pack.price === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Free forever
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {pack.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {pack.price === 0 ? (
                <Link
                  href="/auth/register"
                  className="block w-full text-center btn-secondary"
                >
                  Get Started Free
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(pack.id)}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    pack.id === 'advanced'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transform hover:scale-105`}
                >
                  Get Started →
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">Free</th>
                  <th className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">Immigration</th>
                  <th className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">Advanced</th>
                  <th className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">Citizenship Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: 'AI Chatbot Messages', free: '3/day', immigration: 'Unlimited', advanced: 'Unlimited', citizenship: 'Unlimited' },
                  { feature: 'CV Templates', free: '-', immigration: '20+', advanced: '20+', citizenship: '20+' },
                  { feature: 'Comprehensive Guides', free: '-', immigration: '-', advanced: '10 modules', citizenship: '10 modules' },
                  { feature: 'Citizenship Roadmap', free: '-', immigration: '-', advanced: '-', citizenship: '✓' },
                  { feature: 'Dashboard Access', free: 'Basic', immigration: 'Full', advanced: 'Full', citizenship: 'Full' },
                  { feature: 'Support', free: 'Community', immigration: 'Email', advanced: 'Email + Priority', citizenship: 'Email + Priority' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{row.free}</td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{row.immigration}</td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{row.advanced}</td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{row.citizenship}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes! You can upgrade or downgrade anytime from your dashboard. Changes take effect immediately.',
              },
              {
                q: 'What happens if I hit my free message limit?',
                a: 'You\'ll be prompted to upgrade to continue chatting. Or wait until the next day for your limit to reset.',
              },
              {
                q: 'Do I get lifetime access to the guides?',
                a: 'Yes, if you purchase the Advanced Pack or Citizenship Pro, you get lifetime access to all content.',
              },
              {
                q: 'Is there a money-back guarantee?',
                a: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund - no questions asked.',
              },
              {
                q: 'How much money can I save compared to immigration consultants?',
                a: 'Traditional Swiss immigration consultants charge CHF 5,000-15,000. Our Advanced Pack at CHF 69/month provides the same comprehensive guidance at a fraction of the cost.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Absolutely! You can cancel your subscription at any time from your dashboard. You\'ll retain access until the end of your billing period.',
              },
              {
                q: 'Do you offer discounts for annual subscriptions?',
                a: 'Yes! Contact us for annual pricing options. Annual subscribers save 20% and get priority support access.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who've successfully immigrated to Switzerland
            </p>
            <Link
              href="/auth/register"
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started Free →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


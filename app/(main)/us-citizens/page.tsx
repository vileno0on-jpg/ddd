'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { DollarSign, FileText, Heart, Clock, MapPin, CheckCircle, AlertCircle, Plane, Home, Briefcase, Users, Shield } from 'lucide-react'

export default function USCitizensPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="text-6xl mb-4">🇺🇸 ➡️ 🇨🇭</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Moving to Switzerland from the USA
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete guide for American citizens: costs, visas, health insurance, and everything you need to know
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 text-center"
          >
            <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              CHF 3,450
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Moving Cost
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 text-center"
          >
            <Clock className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              90 Days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Visa-Free Stay
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 text-center"
          >
            <Users className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ~5%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Of Foreign Population
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 text-center"
          >
            <Heart className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              3 Months
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Health Insurance Deadline
            </div>
          </motion.div>
        </div>

        {/* Visa Requirements for US Citizens */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Visa Requirements for Americans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Short Stay */}
              <div className="card p-8">
                <div className="flex items-center mb-4">
                  <Plane className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Short Stay (Tourist)
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">No visa required</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Up to 90 days within 180-day period</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Valid passport</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Must be valid for duration of stay</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Return ticket</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Proof of onward travel</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long Stay */}
              <div className="card p-8 border-2 border-blue-600 dark:border-blue-400">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Long Stay (Work/Residence)
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Long-stay visa required</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Must apply before entering Switzerland</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Job offer required</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Swiss employer must sponsor application</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Subject to quotas</strong>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Limited permits for non-EU citizens (8,500/year)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Cost Breakdown */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Complete Cost Breakdown
          </h2>

          <div className="card p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Initial Moving Costs (Average CHF 3,450)
            </h3>
            <div className="space-y-4">
              {[
                { item: 'Visa Application Fee', cost: 'CHF 47-94', note: 'Long-stay visa' },
                { item: 'Flight Tickets', cost: 'CHF 800-1,500', note: 'One-way from US' },
                { item: 'Shipping/Moving', cost: 'CHF 1,500-3,000', note: 'Personal belongings' },
                { item: 'First Month Rent', cost: 'CHF 1,500-3,500', note: 'Varies by canton' },
                { item: 'Security Deposit', cost: 'CHF 3,000-7,000', note: '2-3 months rent' },
                { item: 'Initial Setup', cost: 'CHF 500-1,000', note: 'Utilities, internet, phone' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{item.item}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.note}</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {item.cost}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Monthly Living Costs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { category: 'Rent (1-bedroom, city center)', amount: 'CHF 1,500-2,500' },
                { category: 'Health Insurance (Mandatory)', amount: 'CHF 300-600' },
                { category: 'Food & Groceries', amount: 'CHF 400-700' },
                { category: 'Public Transport', amount: 'CHF 70-150' },
                { category: 'Utilities', amount: 'CHF 150-250' },
                { category: 'Internet & Phone', amount: 'CHF 80-150' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{item.category}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{item.amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Monthly (Average)</span>
                <span className="text-3xl font-bold">CHF 3,000-4,500</span>
              </div>
            </div>
          </div>
        </section>

        {/* Health Insurance - CRITICAL */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 border-l-4 border-red-600 dark:border-red-400 rounded-lg p-8"
          >
            <div className="flex items-start">
              <Heart className="w-12 h-12 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-red-900 dark:text-red-100 mb-4">
                  ⚠️ CRITICAL: Health Insurance Requirement
                </h2>
                <div className="space-y-3 text-red-800 dark:text-red-200">
                  <p className="text-lg">
                    <strong>US citizens MUST enroll in Swiss health insurance within 3 months of arrival.</strong> This is mandatory by law.
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>US health insurance does NOT work in Switzerland</li>
                    <li>Swiss insurance is private but mandatory</li>
                    <li>Cost: CHF 300-600/month depending on canton and coverage</li>
                    <li>Late enrollment penalties can be severe</li>
                    <li>No pre-existing condition exclusions (unlike US)</li>
                  </ul>
                  <div className="mt-4 p-4 bg-red-600 dark:bg-red-700 text-white rounded-lg">
                    <strong>Action Required:</strong> Register with a Swiss health insurance provider within 90 days of receiving your residence permit.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Work Permit Process */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Work Permit Application Process
          </h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Secure Job Offer',
                description: 'Find US company with Swiss presence or Swiss employer willing to sponsor. Employer must prove no Swiss/EU candidate is available.',
                duration: '3-6 months',
                tips: ['LinkedIn is most effective', 'Zurich & Geneva have most opportunities', 'Tech/Finance sectors most open to Americans']
              },
              {
                step: 2,
                title: 'Employer Files Permit Application',
                description: 'Your employer submits application to cantonal migration office. They handle most paperwork.',
                duration: '4-8 weeks',
                tips: ['Salary must be competitive (CHF 90k+ recommended)', 'Educational credentials must be verified', 'Contract must be long-term']
              },
              {
                step: 3,
                title: 'Federal SEM Approval',
                description: 'State Secretariat for Migration reviews application against quota availability.',
                duration: '2-4 weeks',
                tips: ['Non-EU quota: 8,500 permits/year', 'Apply early in year for best chances', 'Highly skilled workers prioritized']
              },
              {
                step: 4,
                title: 'Visa Application at Swiss Embassy',
                description: 'Apply for D visa (long-stay) at Swiss Embassy in Washington DC, San Francisco, or NYC.',
                duration: '1-3 weeks',
                tips: ['Schedule appointment early', 'Bring all original documents', 'Processing faster in off-season']
              },
              {
                step: 5,
                title: 'Entry & Registration',
                description: 'Enter Switzerland, register with local municipality within 14 days, collect residence permit.',
                duration: '1-2 weeks',
                tips: ['Bring visa, passport, job contract', 'Register at Einwohnerkontrolle/Contrôle des habitants', 'Open Swiss bank account immediately']
              }
            ].map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mr-6">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded-full">
                        ⏱️ {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                      <div className="font-semibold text-green-900 dark:text-green-100 mb-2">💡 Pro Tips:</div>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tidx) => (
                          <li key={tidx} className="text-sm text-green-800 dark:text-green-200 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Key Differences: US vs Switzerland */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Key Differences: USA vs Switzerland
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                category: 'Healthcare',
                us: 'Employer-provided or private market',
                ch: 'Mandatory private insurance (government-regulated prices)',
                impact: 'Lower costs, universal coverage'
              },
              {
                category: 'Taxes',
                us: 'Federal + State (varies)',
                ch: 'Federal + Cantonal + Municipal (varies by location)',
                impact: 'Generally lower taxes, especially for high earners'
              },
              {
                category: 'Work Culture',
                us: '40-50+ hour weeks, limited vacation',
                ch: '42 hour weeks max, 4+ weeks vacation minimum',
                impact: 'Better work-life balance'
              },
              {
                category: 'Public Transport',
                us: 'Car-dependent in most areas',
                ch: 'Excellent trains/buses, punctual',
                impact: 'Many expats live car-free'
              },
              {
                category: 'Cost of Living',
                us: 'High in major cities',
                ch: 'Very high everywhere',
                impact: 'Offset by higher salaries (adjust expectations)'
              },
              {
                category: 'Banking',
                us: 'Easy account opening',
                ch: 'Requires residence permit, more documentation',
                impact: 'Plan for initial challenges'
              }
            ].map((diff, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + idx * 0.1 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{diff.category}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">🇺🇸 USA:</div>
                    <div className="text-gray-900 dark:text-white">{diff.us}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">🇨🇭 Switzerland:</div>
                    <div className="text-gray-900 dark:text-white">{diff.ch}</div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Impact:</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{diff.impact}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Swiss Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get personalized guidance, CV templates, and step-by-step checklists
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
              View Pricing Plans →
            </Link>
            <Link href="/quiz" className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200">
              Take Eligibility Quiz
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">
            ✓ Save CHF 5,000+ vs immigration consultants  •  ✓ 30-Day Money-Back Guarantee
          </p>
        </motion.div>
      </div>
    </div>
  )
}


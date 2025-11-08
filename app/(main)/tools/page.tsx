'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calculator, Clock, MapPin, TrendingUp, CheckCircle, DollarSign } from 'lucide-react'

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'cost' | 'timeline' | 'canton'>('cost')
  
  // Cost Calculator State
  const [salary, setSalary] = useState(100000)
  const [canton, setCanton] = useState('zurich')
  const [familySize, setFamilySize] = useState(1)
  const [housing, setHousing] = useState('apartment')

  // Timeline Calculator State
  const [currentStatus, setCurrentStatus] = useState('no_permit')
  const [hasJobOffer, setHasJobOffer] = useState(false)
  const [nationality, setNationality] = useState('non-eu')

  const cantons = [
    { id: 'zurich', name: 'Zürich', rent: 2200, tax: 22, approval: 85 },
    { id: 'geneva', name: 'Geneva', rent: 2500, tax: 25, approval: 70 },
    { id: 'basel', name: 'Basel', rent: 1900, tax: 21, approval: 88 },
    { id: 'bern', name: 'Bern', rent: 1800, tax: 20, approval: 82 },
    { id: 'zug', name: 'Zug', rent: 2800, tax: 15, approval: 75 },
    { id: 'vaud', name: 'Vaud', rent: 1700, tax: 23, approval: 80 },
  ]

  const calculateCosts = () => {
    const selectedCanton = cantons.find(c => c.id === canton) || cantons[0]
    const baseRent = selectedCanton.rent
    const rentMultiplier = housing === 'house' ? 1.5 : 1
    const familyMultiplier = 1 + (familySize - 1) * 0.3
    
    const monthlyRent = baseRent * rentMultiplier * familyMultiplier
    const healthInsurance = 400 * familySize
    const food = 600 * familySize
    const transport = 150 * familySize
    const utilities = 200
    const misc = 300
    
    const monthlyTotal = monthlyRent + healthInsurance + food + transport + utilities + misc
    const monthlyTax = (salary / 12) * (selectedCanton.tax / 100)
    const takeHome = (salary / 12) - monthlyTax
    const netSavings = takeHome - monthlyTotal

    return {
      monthlyRent,
      healthInsurance,
      food,
      transport,
      utilities,
      misc,
      monthlyTotal,
      monthlyTax,
      takeHome,
      netSavings,
      savingsRate: ((netSavings / takeHome) * 100).toFixed(1)
    }
  }

  const calculateTimeline = () => {
    let totalWeeks = 0
    const steps: Array<{phase: string, weeks: number, description: string}> = []

    if (!hasJobOffer) {
      steps.push({
        phase: 'Job Search',
        weeks: nationality === 'eu' ? 12 : 20,
        description: 'Finding and securing employment in Switzerland'
      })
      totalWeeks += nationality === 'eu' ? 12 : 20
    }

    steps.push({
      phase: 'Work Permit Application',
      weeks: nationality === 'eu' ? 6 : 10,
      description: 'Employer submits permit application to cantonal authorities'
    })
    totalWeeks += nationality === 'eu' ? 6 : 10

    if (nationality === 'non-eu') {
      steps.push({
        phase: 'Federal SEM Review',
        weeks: 3,
        description: 'Federal review and quota allocation'
      })
      totalWeeks += 3
    }

    steps.push({
      phase: 'Visa Application',
      weeks: nationality === 'eu' ? 2 : 3,
      description: 'Embassy/consulate visa processing'
    })
    totalWeeks += nationality === 'eu' ? 2 : 3

    steps.push({
      phase: 'Moving & Setup',
      weeks: 4,
      description: 'Relocation, registration, and settling in'
    })
    totalWeeks += 4

    return { steps, totalWeeks, totalMonths: Math.ceil(totalWeeks / 4) }
  }

  const costs = calculateCosts()
  const timeline = calculateTimeline()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Swiss Immigration Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interactive calculators to plan your move to Switzerland
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'cost'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-5 h-5 inline-block mr-2" />
              Cost Calculator
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-5 h-5 inline-block mr-2" />
              Timeline Planner
            </button>
            <button
              onClick={() => setActiveTab('canton')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'canton'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              Canton Comparison
            </button>
          </div>
        </div>

        {/* Cost Calculator */}
        {activeTab === 'cost' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Input Panel */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Annual Salary (CHF)
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="200000"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    CHF {salary.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Canton
                  </label>
                  <select
                    value={canton}
                    onChange={(e) => setCanton(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {cantons.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Family Size
                  </label>
                  <select
                    value={familySize}
                    onChange={(e) => setFamilySize(Number(e.target.value))}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="1">Single</option>
                    <option value="2">Couple</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Housing Type
                  </label>
                  <select
                    value={housing}
                    onChange={(e) => setHousing(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <div className="card p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Monthly Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Rent', value: costs.monthlyRent },
                    { label: 'Health Insurance', value: costs.healthInsurance },
                    { label: 'Food & Groceries', value: costs.food },
                    { label: 'Transport', value: costs.transport },
                    { label: 'Utilities', value: costs.utilities },
                    { label: 'Other', value: costs.misc },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        CHF {Math.round(item.value).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <h3 className="text-2xl font-bold mb-6">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>Gross Monthly Salary</span>
                    <span className="text-2xl font-bold">CHF {Math.round(salary / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>Monthly Tax</span>
                    <span className="text-2xl font-bold">-CHF {Math.round(costs.monthlyTax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>Take-Home Pay</span>
                    <span className="text-2xl font-bold">CHF {Math.round(costs.takeHome).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                    <span>Monthly Expenses</span>
                    <span className="text-2xl font-bold">-CHF {Math.round(costs.monthlyTotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-xl font-semibold">Net Savings</span>
                    <span className={`text-3xl font-bold ${costs.netSavings > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      CHF {Math.round(costs.netSavings).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-sm opacity-90">Savings Rate</div>
                    <div className="text-4xl font-bold">{costs.savingsRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Timeline Planner */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Input Panel */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Situation
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nationality
                  </label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="non-eu">Non-EU/EFTA (USA, India, China, etc.)</option>
                    <option value="eu">EU/EFTA Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Do you have a job offer?
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setHasJobOffer(true)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        hasJobOffer
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                      Yes
                    </button>
                    <button
                      onClick={() => setHasJobOffer(false)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        !hasJobOffer
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Results */}
            <div className="space-y-6">
              <div className="card p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <h3 className="text-2xl font-bold mb-4">Estimated Timeline</h3>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{timeline.totalMonths}</div>
                  <div className="text-xl">Months</div>
                  <div className="text-sm opacity-75 mt-2">({timeline.totalWeeks} weeks total)</div>
                </div>
              </div>

              <div className="card p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Phase Breakdown
                </h3>
                <div className="space-y-4">
                  {timeline.steps.map((step, idx) => (
                    <div key={idx} className="border-l-4 border-blue-600 pl-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-900 dark:text-white">{step.phase}</div>
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded-full">
                          {step.weeks} weeks
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{step.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Canton Comparison */}
        {activeTab === 'canton' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Canton Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-bold">Canton</th>
                      <th className="text-center py-4 px-4 text-gray-900 dark:text-white font-bold">Avg. Rent (1BR)</th>
                      <th className="text-center py-4 px-4 text-gray-900 dark:text-white font-bold">Tax Rate</th>
                      <th className="text-center py-4 px-4 text-gray-900 dark:text-white font-bold">Approval Rate</th>
                      <th className="text-center py-4 px-4 text-gray-900 dark:text-white font-bold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ...cantons[0], bestFor: 'Tech & Finance' },
                      { ...cantons[1], bestFor: 'International Orgs' },
                      { ...cantons[2], bestFor: 'Pharma & Life Sciences' },
                      { ...cantons[3], bestFor: 'Government & NGOs' },
                      { ...cantons[4], bestFor: 'Low Taxes & Trading' },
                      { ...cantons[5], bestFor: 'Quality of Life' },
                    ].map((canton, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">{canton.name}</td>
                        <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">CHF {canton.rent}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${canton.tax < 20 ? 'text-green-600 dark:text-green-400' : canton.tax > 23 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {canton.tax}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${canton.approval > 85 ? 'text-green-600 dark:text-green-400' : canton.approval < 75 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {canton.approval}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-blue-600 dark:text-blue-400 font-medium">{canton.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Need More Detailed Guidance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get access to comprehensive guides, CV templates, and personalized support
          </p>
          <Link href="/pricing" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
            View Pricing Plans →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}


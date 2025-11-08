'use client'

import { useState } from 'react'
import { Calculator, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PermitCalculator() {
  const [nationality, setNationality] = useState<'eu' | 'us' | 'other'>('other')
  const [salary, setSalary] = useState('')
  const [canton, setCanton] = useState('')
  const [industry, setIndustry] = useState('')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const salaryNum = parseInt(salary)
    if (!salaryNum || !canton || !industry) {
      alert('Please fill in all fields')
      return
    }

    let successRate = 0
    let permitType = ''
    let timeline = ''
    let recommendations: string[] = []

    if (nationality === 'eu') {
      successRate = 95
      permitType = 'B Permit (EU/EFTA)'
      timeline = '2-4 weeks'
      recommendations = [
        'No quota restrictions - you can apply anytime',
        'Fast processing under FMPA',
        'Simplified documentation required',
        '5-year path to citizenship'
      ]
    } else {
      // Non-EU calculation
      const cantonMultipliers: Record<string, number> = {
        'basel': 1.5,
        'ticino': 1.3,
        'st-gallen': 1.2,
        'zurich': 0.5,
        'geneva': 0.4,
      }

      const baseRate = 20
      const cantonMultiplier = cantonMultipliers[canton.toLowerCase()] || 1.0
      const salaryBonus = salaryNum >= 120000 ? 1.3 : salaryNum >= 100000 ? 1.1 : 0.9
      
      successRate = Math.min(95, Math.round(baseRate * cantonMultiplier * salaryBonus))
      
      permitType = salaryNum >= 100000 ? 'B Permit' : 'L Permit'
      timeline = '8-12 weeks'
      
      recommendations = [
        salaryNum < 100000 ? 'Consider negotiating for CHF 100k+ salary' : 'Salary is competitive',
        cantonMultiplier < 1 ? 'Consider applying to less competitive cantons' : 'Canton choice is good',
        'Ensure perfect documentation',
        'Apply early (January-March) for best quota access',
        'Highlight unique skills and qualifications'
      ]
    }

    setResult({
      successRate,
      permitType,
      timeline,
      recommendations,
      needsQuota: nationality !== 'eu'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Calculator className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Permit Eligibility Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Calculate your chances of getting a Swiss work permit based on your profile
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nationality / Origin
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setNationality('eu')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    nationality === 'eu'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold">EU/EFTA</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">No quota</div>
                </button>
                <button
                  onClick={() => setNationality('us')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    nationality === 'us'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold">US/Canada</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quota applies</div>
                </button>
                <button
                  onClick={() => setNationality('other')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    nationality === 'other'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold">Other</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quota applies</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Annual Salary (CHF)
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g., 100000"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Recommended: CHF 100k+ for competitive applications
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Canton
              </label>
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select canton...</option>
                <option value="basel">Basel-Stadt (Best for tech/pharma)</option>
                <option value="ticino">Ticino (Best for IT/engineering)</option>
                <option value="st-gallen">St. Gallen (Best for finance)</option>
                <option value="zurich">Zurich (Most competitive)</option>
                <option value="geneva">Geneva (Diplomatic priority)</option>
                <option value="other">Other canton</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select industry...</option>
                <option value="tech">Technology & IT</option>
                <option value="finance">Finance & Banking</option>
                <option value="pharma">Pharmaceuticals</option>
                <option value="healthcare">Healthcare</option>
                <option value="engineering">Engineering</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate My Chances</span>
            </button>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                result.successRate >= 70 ? 'bg-green-100 dark:bg-green-900' :
                result.successRate >= 40 ? 'bg-yellow-100 dark:bg-yellow-900' :
                'bg-red-100 dark:bg-red-900'
              }`}>
                <span className={`text-3xl font-bold ${
                  result.successRate >= 70 ? 'text-green-600 dark:text-green-400' :
                  result.successRate >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {result.successRate}%
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Estimated Success Rate
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Based on your profile and current market conditions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Permit Type</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.permitType}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Processing Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.timeline}</div>
              </div>
            </div>

            {result.needsQuota && (
              <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      Quota System Applies
                    </div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      As of November 2025, approximately 2,500 permits remain out of 8,500 total. Apply strategically and early.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex gap-4">
              <Link
                href="/pricing"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-center transition-all"
              >
                Get Expert Guidance
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold text-center transition-all"
              >
                View Modules
              </Link>
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            This calculator provides estimates based on 2025 data. Actual results may vary.
            Legal basis: AuG (SR 142.20), VZAE (SR 142.201). 
            Official source: <a href="https://www.sem.admin.ch" target="_blank" rel="noopener noreferrer" className="underline">SEM.admin.ch</a>
          </p>
        </div>
      </div>
    </div>
  )
}


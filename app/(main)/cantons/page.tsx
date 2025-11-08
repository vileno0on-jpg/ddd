'use client'

import { motion } from 'framer-motion'
import { MapPin, Globe, Building2, Users } from 'lucide-react'
import { CANTONS } from '@/lib/constants'

export default function CantonsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Cantonal Immigration Variations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Each canton has unique immigration policies, quotas, and requirements
          </p>
        </motion.div>

        {/* Canton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {CANTONS.map((canton, idx) => (
            <motion.div
              key={canton.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {canton.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {canton.code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{canton.language}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{canton.capital}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{canton.population}</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Immigration Priority:
                </p>
                {canton.code === 'ZH' && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    IT, Finance, Engineering (Quota x1.2)
                  </p>
                )}
                {canton.code === 'GE' && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Finance, Diplomacy, Medicine (Quota x1.5)
                  </p>
                )}
                {canton.code === 'BS' && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Pharma, Chemistry, Biotech (Quota x1.1)
                  </p>
                )}
                {canton.code === 'TI' && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tourism, Finance, IT (Quota x0.9)
                  </p>
                )}
                {!['ZH', 'GE', 'BS', 'TI'].includes(canton.code) && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Standard quotas apply
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Canton Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Key Variations by Canton
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Canton</th>
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Language</th>
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Avg Processing</th>
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-semibold">Citizenship Req</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  ['Zurich (ZH)', 'German', '8-12 weeks', 'Strict German B2+'],
                  ['Geneva (GE)', 'French', '8-10 weeks', 'French B2 required'],
                  ['Basel (BS)', 'German', '10-12 weeks', 'German B2'],
                  ['Vaud (VD)', 'French', '8-10 weeks', 'French B1+'],
                  ['Bern (BE)', 'German', '10-14 weeks', 'German B1+'],
                  ['Ticino (TI)', 'Italian', '9-11 weeks', 'Italian B1+'],
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{row[0]}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{row[1]}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{row[2]}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            Master Cantonal Immigration Variations
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get detailed cantonal guides, embassy contacts, and language requirements in Advanced Pack
          </p>
          <a href="/pricing" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105">
            Unlock Advanced Pack →
          </a>
        </motion.div>
      </div>
    </div>
  )
}


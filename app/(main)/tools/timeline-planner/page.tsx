'use client'

import { useState } from 'react'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TimelinePlanner() {
  const [targetDate, setTargetDate] = useState('')
  const [nationality, setNationality] = useState<'eu' | 'non-eu'>('non-eu')
  const [hasJobOffer, setHasJobOffer] = useState(false)
  const [timeline, setTimeline] = useState<any>(null)

  const calculateTimeline = () => {
    if (!targetDate) {
      alert('Please select your target start date')
      return
    }

    const target = new Date(targetDate)
    const now = new Date()
    const monthsDiff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))

    const milestones = []

    if (nationality === 'eu') {
      milestones.push(
        { date: new Date(target.getTime() - 60 * 24 * 60 * 60 * 1000), task: 'Register with commune', status: 'pending' },
        { date: new Date(target.getTime() - 30 * 24 * 60 * 60 * 1000), task: 'Apply for permit via commune', status: 'pending' },
        { date: new Date(target.getTime() - 14 * 24 * 60 * 60 * 1000), task: 'Receive permit approval', status: 'pending' },
        { date: target, task: 'Start work in Switzerland', status: 'pending' }
      )
    } else {
      // Non-EU timeline
      if (!hasJobOffer) {
        milestones.push(
          { date: new Date(target.getTime() - 6 * 30 * 24 * 60 * 60 * 1000), task: 'Find job and secure offer', status: 'pending' },
          { date: new Date(target.getTime() - 4 * 30 * 24 * 60 * 60 * 1000), task: 'Prepare documentation (apostille, translations)', status: 'pending' },
          { date: new Date(target.getTime() - 3 * 30 * 24 * 60 * 60 * 1000), task: 'Employer files application', status: 'pending' },
          { date: new Date(target.getTime() - 1 * 30 * 24 * 60 * 60 * 1000), task: 'Receive permit approval', status: 'pending' },
          { date: target, task: 'Start work in Switzerland', status: 'pending' }
        )
      } else {
        milestones.push(
          { date: new Date(target.getTime() - 4 * 30 * 24 * 60 * 60 * 1000), task: 'Prepare documentation (apostille, translations)', status: 'pending' },
          { date: new Date(target.getTime() - 3 * 30 * 24 * 60 * 60 * 1000), task: 'Employer files application', status: 'pending' },
          { date: new Date(target.getTime() - 1 * 30 * 24 * 60 * 60 * 1000), task: 'Receive permit approval', status: 'pending' },
          { date: target, task: 'Start work in Switzerland', status: 'pending' }
        )
      }
    }

    setTimeline({
      targetDate: target,
      totalMonths: monthsDiff,
      milestones,
      isFeasible: monthsDiff >= (nationality === 'eu' ? 1 : hasJobOffer ? 4 : 6)
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
          <Calendar className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Immigration Timeline Planner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Plan your Swiss immigration journey with personalized milestones
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Start Date in Switzerland
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nationality
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setNationality('eu')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    nationality === 'eu'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold">EU/EFTA</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2-4 weeks processing</div>
                </button>
                <button
                  onClick={() => setNationality('non-eu')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    nationality === 'non-eu'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold">Non-EU</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">8-12 weeks processing</div>
                </button>
              </div>
            </div>

            {nationality === 'non-eu' && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasJobOffer}
                    onChange={(e) => setHasJobOffer(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    I already have a job offer
                  </span>
                </label>
              </div>
            )}

            <button
              onClick={calculateTimeline}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Generate Timeline</span>
            </button>
          </div>
        </div>

        {timeline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            {!timeline.isFeasible && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      Timeline May Be Too Short
                    </div>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Your target date may not allow enough time. Consider pushing back by {nationality === 'eu' ? '1-2' : '2-4'} months.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Immigration Timeline
            </h2>

            <div className="space-y-4">
              {timeline.milestones.map((milestone: any, idx: number) => {
                const isPast = milestone.date < new Date()
                return (
                  <div
                    key={idx}
                    className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${
                      isPast
                        ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isPast ? 'bg-green-600 dark:bg-green-700' : 'bg-blue-600 dark:bg-blue-700'
                    }`}>
                      {isPast ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Clock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        {milestone.task}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {milestone.date.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {idx < timeline.milestones.length - 1 && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {Math.ceil((timeline.milestones[idx + 1].date.getTime() - milestone.date.getTime()) / (1000 * 60 * 60 * 24))} days until next step
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Legal References
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Processing times based on AuG Art. 24-25 (permits), VZAE Art. 10-15 (procedures). 
                Official source: <a href="https://www.sem.admin.ch" target="_blank" rel="noopener noreferrer" className="underline">SEM.admin.ch</a>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}


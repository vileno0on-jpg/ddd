'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Flag, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface QuizQuestion {
  id: number
  question: string
  options: { value: string; label: string; points: number }[]
  category: 'residency' | 'language' | 'integration' | 'profile'
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'How long have you been a legal resident in Switzerland?',
    options: [
      { value: '0', label: 'Not yet residing', points: 0 },
      { value: '1-3', label: '1-3 years', points: 10 },
      { value: '4-7', label: '4-7 years', points: 25 },
      { value: '8-9', label: '8-9 years', points: 40 },
      { value: '10+', label: '10+ years', points: 50 }
    ],
    category: 'residency'
  },
  {
    id: 2,
    question: 'What is your current residence permit type?',
    options: [
      { value: 'L', label: 'L Permit (short-term)', points: 5 },
      { value: 'B', label: 'B Permit (residence)', points: 20 },
      { value: 'C', label: 'C Permit (settlement)', points: 35 },
      { value: 'F', label: 'F Permit (temporary)', points: 0 },
      { value: 'spouse', label: 'Spouse/family permit', points: 30 }
    ],
    category: 'residency'
  },
  {
    id: 3,
    question: 'What is your proficiency in Swiss German/French/Italian?',
    options: [
      { value: 'none', label: 'None or beginner', points: 0 },
      { value: 'a1', label: 'A1 (basic)', points: 10 },
      { value: 'a2', label: 'A2 (elementary)', points: 20 },
      { value: 'b1', label: 'B1 (intermediate - required)', points: 40 },
      { value: 'b2', label: 'B2 (upper-intermediate)', points: 50 },
      { value: 'native', label: 'B2+ or native-level', points: 60 }
    ],
    category: 'language'
  },
  {
    id: 4,
    question: 'Do you have a certified language test result?',
    options: [
      { value: 'no', label: 'No', points: 0 },
      { value: 'pending', label: 'Pending or studying', points: 15 },
      { value: 'yes', label: 'Yes, certified B1 or higher', points: 35 }
    ],
    category: 'language'
  },
  {
    id: 5,
    question: 'What is your employment status?',
    options: [
      { value: 'unemployed', label: 'Unemployed', points: 0 },
      { value: 'temporary', label: 'Temporary/contract', points: 15 },
      { value: 'employed', label: 'Permanent employment', points: 30 },
      { value: 'self-employed', label: 'Self-employed/business owner', points: 25 },
      { value: 'student', label: 'Student', points: 5 }
    ],
    category: 'profile'
  },
  {
    id: 6,
    question: 'Have you lived in Switzerland continuously (without gaps)?',
    options: [
      { value: 'no', label: 'No, with gaps', points: 0 },
      { value: 'mostly', label: 'Mostly continuous', points: 15 },
      { value: 'yes', label: 'Fully continuous', points: 35 }
    ],
    category: 'residency'
  },
  {
    id: 7,
    question: 'What is your level of integration into Swiss society?',
    options: [
      { value: 'none', label: 'Little to no integration', points: 0 },
      { value: 'some', label: 'Some involvement', points: 15 },
      { value: 'moderate', label: 'Moderate (know customs, taxes, etc.)', points: 30 },
      { value: 'high', label: 'High (Swiss friends, local activities)', points: 45 },
      { value: 'very-high', label: 'Very high (fully integrated)', points: 60 }
    ],
    category: 'integration'
  },
  {
    id: 8,
    question: 'Do you have any criminal record or legal issues?',
    options: [
      { value: 'issues', label: 'Yes, criminal record or issues', points: -100 },
      { value: 'minor', label: 'Minor violations/traffic tickets', points: 10 },
      { value: 'none', label: 'Clean record', points: 30 }
    ],
    category: 'profile'
  },
  {
    id: 9,
    question: 'Are you married to a Swiss citizen?',
    options: [
      { value: 'no', label: 'No', points: 0 },
      { value: 'yes-5', label: 'Yes, married 5+ years', points: 40 },
      { value: 'yes-3', label: 'Yes, married 3-4 years', points: 25 }
    ],
    category: 'profile'
  },
  {
    id: 10,
    question: 'Have you taken Swiss history/civics courses or integration test prep?',
    options: [
      { value: 'no', label: 'No', points: 0 },
      { value: 'some', label: 'Some knowledge', points: 15 },
      { value: 'yes', label: 'Yes, formal courses', points: 35 }
    ],
    category: 'integration'
  },
  {
    id: 11,
    question: 'What is your tax and social security contribution record?',
    options: [
      { value: 'none', label: 'No contributions', points: 0 },
      { value: 'partial', label: 'Partial/inconsistent', points: 10 },
      { value: 'complete', label: 'Complete records', points: 30 }
    ],
    category: 'profile'
  },
  {
    id: 12,
    question: 'Do you have financial stability (savings, employment, etc.)?',
    options: [
      { value: 'unstable', label: 'Financial instability', points: 0 },
      { value: 'moderate', label: 'Moderate stability', points: 20 },
      { value: 'stable', label: 'Financially stable', points: 35 }
    ],
    category: 'profile'
  }
]

export default function CitizenshipQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = async (points: number) => {
    const newAnswers = { ...answers, [currentQuestion]: points }
    setAnswers(newAnswers)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore(newAnswers)
      setShowResult(true)
      
      // Save quiz results to database
      try {
        await fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quiz_type: 'citizenship',
            score: 0, // Will be calculated
            total_questions: quizQuestions.length,
            answers: newAnswers,
            completedAt: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error('Failed to save quiz results:', error)
        // Don't block UI if save fails
      }
    }
  }

  const calculateScore = (answers: Record<number, number>) => {
    const totalPoints = Object.values(answers).reduce((sum, points) => sum + points, 0)
    const maxPoints = quizQuestions.reduce((sum, q) => {
      const maxPointsForQ = Math.max(...q.options.map(opt => opt.points))
      return sum + maxPointsForQ
    }, 0)
    
    const percentage = Math.round((totalPoints / maxPoints) * 100)
    setScore(Math.max(0, percentage)) // Ensure non-negative
  }

  const getRecommendation = (score: number): { title: string; message: string; color: string } => {
    if (score >= 75) {
      return {
        title: 'Excellent Prospects! 🎉',
        message: 'You have strong chances of Swiss citizenship. Continue your integration efforts and prepare for application.',
        color: 'text-green-600 dark:text-green-400'
      }
    } else if (score >= 60) {
      return {
        title: 'Good Prospects! ✅',
        message: 'You have good chances with continued effort. Focus on remaining requirements and integration.',
        color: 'text-blue-600 dark:text-blue-400'
      }
    } else if (score >= 45) {
      return {
        title: 'Possible with Work ⚠️',
        message: 'You have moderate chances. Significant improvements needed in key areas to succeed.',
        color: 'text-orange-600 dark:text-orange-400'
      }
    } else if (score >= 25) {
      return {
        title: 'Needs Significant Progress 📈',
        message: 'Your chances are low currently. Major improvements required in residency, language, and integration.',
        color: 'text-red-600 dark:text-red-400'
      }
    } else {
      return {
        title: 'Consider Alternatives 💡',
        message: 'Swiss citizenship may not be realistic at this time. Consider permanent residence or other options.',
        color: 'text-gray-600 dark:text-gray-400'
      }
    }
  }

  if (showResult) {
    const recommendation = getRecommendation(score)
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center"
          >
            <Flag className="w-20 h-20 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {recommendation.title}
            </h1>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {score}%
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Swiss Citizenship Plausibility Score
              </p>
            </div>

            <div className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-8 mb-8`}>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
                {recommendation.message}
              </p>
              
              {score < 60 && (
                <div className="space-y-3 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">To improve your score:</p>
                  <ul className="space-y-2">
                    {score < 50 && <li className="text-gray-700 dark:text-gray-200">📅 Complete residency requirements (10 years or 5 via marriage)</li>}
                    {score < 50 && <li className="text-gray-700 dark:text-gray-200">🗣️ Achieve B1+ language certification</li>}
                    <li className="text-gray-700 dark:text-gray-200">🎓 Take integration courses</li>
                    <li className="text-gray-700 dark:text-gray-200">🤝 Increase community involvement</li>
                    <li className="text-gray-700 dark:text-gray-200">📄 Maintain clean legal and tax records</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Conversion-focused CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 mb-8 border-2 border-blue-200 dark:border-blue-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🎯 Get Your Complete Swiss Citizenship Roadmap
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                Based on your score, unlock personalized strategies, step-by-step checklists, and expert guidance to maximize your chances of success.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Personalized Action Plan</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Step-by-Step Checklists</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Expert Strategies & Tips</span>
                </div>
              </div>
              <a
                href="/pricing"
                className="btn-primary inline-block w-full text-center mb-3"
              >
                Unlock Complete Roadmap - CHF 9.99/month →
              </a>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                ✓ 30-Day Money-Back Guarantee • ✓ Cancel Anytime
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setShowResult(false)
                  setScore(0)
                }}
                className="btn-secondary"
              >
                Retake Quiz
              </button>
              <a
                href="/citizenship"
                className="btn-secondary"
              >
                Learn More About Citizenship
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-blue-600 h-3 rounded-full transition-all"
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleAnswer(option.points)}
                  className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-sm text-orange-900 dark:text-orange-200">
              ⚠️ This is a general assessment tool. Actual citizenship decisions depend on individual circumstances. Consult Dr. Alpine Esq. for personalized advice.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


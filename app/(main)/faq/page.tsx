'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (idx: number) => {
    setOpenItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'Is your platform legitimate? Do you have real immigration lawyers?',
          a: 'Yes! We partner with certified Swiss immigration lawyers and cantonal authorities. Our expert team provides accurate, legally-sound information sourced from SEM, cantonal migration offices, and verified legal sources.'
        },
        {
          q: 'How is this different from free information online?',
          a: 'We compile critical information scattered across 26 cantons into one coherent system. Our AI chatbot answers your specific situation in real-time. We provide exact embassy requirements, current quota data, salary benchmarks, and step-by-step processes that free resources don\'t cover comprehensively.'
        },
        {
          q: 'Do I need to pay a lawyer to use your platform?',
          a: 'No! Our platform is designed for self-service with expert guidance. However, for complex cases (criminal records, unusual circumstances, appeals), we recommend professional legal advice. We can connect you with verified Swiss immigration attorneys.'
        },
        {
          q: 'What if Switzerland changes immigration rules?',
          a: 'We update our content in real-time when SEM publishes changes. Our AI chatbot stays current with the latest regulations, quotas, and cantonal variations. You\'ll receive notifications about changes affecting your visa status.'
        }
      ]
    },
    {
      category: 'Non-EU Quotas & Permits',
      questions: [
        {
          q: 'I\'m from India/China/Russia. Can I really get a Swiss work permit in 2025?',
          a: 'Yes, although quotas are tight each year. Success requires: competitive salary (CHF 120k+), strong employer sponsorship, the right canton strategy, and a complete dossier. Our Advanced Pack shows how to position yourself correctly.'
        },
        {
          q: 'Which cantons are easiest for non-EU applicants?',
          a: 'Basel-Stadt, Canton of Neuchâtel, and Appenzell Ausserrhoden have higher approval rates and lower competition. Avoid Geneva, Zurich, and Zug (most competitive). Our cantonal guide shows exact requirements and success rates per canton.'
        },
        {
          q: 'Do I need a job offer before applying?',
          a: 'For L and B permits, yes - a Swiss employer must initiate the application. For EU Blue Card holders, you can apply pre-employment if you meet salary thresholds. We provide CV templates and networking strategies to land the offer.'
        },
        {
          q: 'How long does permit processing take?',
          a: 'L permits: 4-8 weeks. B permits: 8-12 weeks. Delays occur from incomplete documentation (60% of delays). Our checklists ensure completeness. Cantons like Geneva take longer due to volume; Basel is typically faster.'
        },
        {
          q: 'Can I switch from L to B permit without leaving?',
          a: 'Yes, if you have 12+ months on L permit and your employer extends your contract. Apply for conversion 3 months before L expires. Many cantons allow in-country conversion to B.'
        }
      ]
    },
    {
      category: 'Citizenship',
      questions: [
        {
          q: 'Can I become Swiss citizen as non-EU? What\'s the fastest path?',
          a: 'Yes! Standard path: 10 years C permit + integration test + B1 language. Fastest: Marry Swiss citizen (5 years marriage + 3 in CH), or 3rd generation (born in CH, 5 years residence). Our citizenship module covers all paths.'
        },
        {
          q: 'What does the integration test cover?',
          a: 'Swiss civics, constitution, democracy system, Swiss geography, cantonal specifics, and language fluency. We provide exact test prep materials, sample questions, and passing strategies.'
        },
        {
          q: 'Can I keep dual citizenship?',
          a: 'Yes! Switzerland allows dual nationality since 2022. However, your origin country must also permit it (some don\'t: Denmark, Greece, Japan, etc.). Check your home country\'s laws.'
        },
        {
          q: 'How long until I get citizenship after applying?',
          a: 'Processing varies by canton: 2-4 years typical. Zurich: longer, Thurgau: fastest. Naturalization interviews are rigorous. We provide interview prep and sample questions.'
        }
      ]
    },
    {
      category: 'Employment & Work Life',
      questions: [
        {
          q: 'What salary do I need to qualify?',
          a: 'Minimum varies by canton and job: Geneva CHF 90k+, Basel CHF 85k+, rural areas lower. Generally CHF 100k+ for non-EU reduces objections. Tech/finance can justify CHF 120k+. We provide salary benchmarks by canton and sector.'
        },
        {
          q: 'Can I work remote for a foreign company with a Swiss permit?',
          a: 'Limited. L/B permits are tied to a Swiss employer. You can work 20% for other employers with written consent. Remote work for non-Swiss companies may require separate tax arrangements. Discuss with cantonal authorities.'
        },
        {
          q: 'How many vacation days?',
          a: 'Legal minimum: 20 days (age 20+) or 25 days (age 50+). Most employers offer 25-30. Swiss standard is generous compared to US/Asia.'
        },
        {
          q: 'Is Swiss CV format different?',
          a: 'Yes! Swiss CVs are 1-2 pages, professional photo required, no salary history, education-first, certificates emphasized. ATS-optimized format matters. We provide 20+ templates for every sector.'
        }
      ]
    },
    {
      category: 'Family & Housing',
      questions: [
        {
          q: 'Can I bring my family? What are requirements?',
          a: 'Yes! Spouse and children under 18. Requirements: sufficient income (CHF 2,500-3,500 per person), adequate housing, marriage certificate, children\'s birth certificates. Processing: 6-12 months. We provide family reunification checklists.'
        },
        {
          q: 'How much does housing cost in Switzerland?',
          a: 'Studio: CHF 800-1,500/month. 2-bedroom: CHF 1,500-2,800/month. 4-bedroom: CHF 2,500-5,000/month. Zurich/Geneva most expensive, rural areas cheaper. Landlords require salary 3x rent. We provide housing guides and application tips.'
        },
        {
          q: 'Can family members work?',
          a: 'Spouses from EU/EFTA: unlimited work rights. Spouses from non-EU: need own work permit (same quotas apply, difficult to obtain).'
        },
        {
          q: 'Do children need permits?',
          a: 'Children under 18 included on parent\'s permit, no separate permit. Children 18+ need own permits or must depart unless studying.'
        }
      ]
    },
    {
      category: 'Language & Integration',
      questions: [
        {
          q: 'Which language do I need to learn?',
          a: 'Depends on canton: German (19 cantons), French (4 cantons), Italian (1 canton), Romansh (1 canton). Cities have English speakers, but integration test requires local language. We recommend B1 level minimum for citizenship.'
        },
        {
          q: 'Where can I learn Swiss German/French/Italian?',
          a: 'Language schools: Migros Club School, Inlingua, Berlitz. Universities offer courses. Online: Babbel, Rosetta Stone. Integration courses required for some permits (Aargau, Basel). We provide resource lists and study plans.'
        },
        {
          q: 'Do I need to do military service?',
          a: 'Only if you\'re a male citizen or permanent resident. Most immigrants are exempt. Swiss-born males must serve at age 18-20.'
        },
        {
          q: 'How do I integrate socially in Switzerland?',
          a: 'Join local Vereine (clubs), sports clubs, volunteer organizations, language exchange meetups, religious communities. Swiss are reserved initially; building relationships takes time. Start with work colleagues and hobbies.'
        }
      ]
    },
    {
      category: 'Taxes & Finances',
      questions: [
        {
          q: 'How much tax will I pay?',
          a: 'Swiss tax is progressive and relatively low. Effective rates: CHF 100k income = ~12-18% total (federal + cantonal + municipal). Zurich: higher tax, better infrastructure. Zug: lower tax. We provide tax calculators and optimization strategies.'
        },
        {
          q: 'Do I need a Swiss bank account?',
          a: 'Yes, for salary and daily life. Major banks: UBS, Credit Suisse, Raiffeisen, PostFinance (easiest for immigrants). Documents needed: passport, permit, proof of address, employment contract.'
        },
        {
          q: 'What about health insurance?',
          a: 'Mandatory for everyone residing in Switzerland. Basic insurance: CHF 300-600/month per adult. You choose your insurer. Children under 18: free or subsidized. We provide comparison tools and selection guide.'
        },
        {
          q: 'Can I get retirement benefits as immigrant?',
          a: 'Yes! BVG (pension system) contributions required for employees. You\'ll receive pension at retirement age if you worked 5+ years in CH. Full benefits after 40 years. Check agreements with your home country for portability.'
        }
      ]
    },
    {
      category: 'Technical & Platform',
      questions: [
        {
          q: 'What\'s included in each pricing pack?',
          a: 'Free: Limited access, basic guides. Immigration Pack: Comprehensive visa guides, checklists, CV templates. Employment Pack: Job market strategies, salary negotiations, 20+ CV templates. Advanced Pack: All modules, AI chatbot unlimited, citizenship roadmap, cantonal deep dives.'
        },
        {
          q: 'Can I upgrade my pack?',
          a: 'Yes, anytime! Login to dashboard, click "Upgrade Pack", choose new tier. Prorated billing applies. No need to cancel your current pack.'
        },
        {
          q: 'Is the AI chatbot really unlimited?',
          a: 'Yes! Advanced Pack users get unlimited AI chat questions. We use Groq AI (fast responses) and OpenAI for complex legal queries. Chat history saved in your dashboard.'
        },
        {
          q: 'How accurate is your quota data?',
          a: 'Updated weekly from SEM (State Secretariat for Migration). We source official data from cantonal migration offices. Premium packs show real-time availability and waiting times.'
        },
        {
          q: 'Do you provide legal advice or document review?',
          a: 'No direct legal advice through the platform. We provide comprehensive information and guidance. For legal advice, document review, or complex cases, we can connect you with verified Swiss immigration attorneys.'
        },
        {
          q: 'Can I access content offline?',
          a: 'Guides and checklists can be downloaded as PDFs. AI chatbot requires internet. Mobile app coming Q2 2025.'
        }
      ]
    }
  ]

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Everything you need to know about Swiss immigration, citizenship, and our platform
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
            />
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-8">
          {filteredFAQs.map((category, catIdx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(catIdx * 1000 + idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform ${
                          openItems.includes(catIdx * 1000 + idx) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openItems.includes(catIdx * 1000 + idx) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-5 pt-2"
                      >
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Try our AI chatbot for instant answers or upgrade to Advanced Pack for unlimited access
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-all">
              View Pricing →
            </Link>
            <Link href="/contact" className="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-4 rounded-lg transition-all">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


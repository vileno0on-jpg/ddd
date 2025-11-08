'use client'

import { useEffect } from 'react'
import { StackAuthProvider } from './StackProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'
import { classifyLayer } from '@/lib/layerLogic'
import { InitialQuizGate } from '@/components/quiz/InitialQuizGate'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const cookieHasLayer = document.cookie.includes('userLayer=')
    let localLayer: string | null = null
    try {
      localLayer = localStorage.getItem('userLayer')
    } catch (error) {
      console.warn('Unable to access localStorage for userLayer detection', error)
    }

    if (cookieHasLayer && localLayer) {
      return
    }

    const oneYear = 60 * 60 * 24 * 365

    const ensureCookie = (layer: string) => {
      document.cookie = `userLayer=${layer}; path=/; max-age=${oneYear}`
    }

    if (localLayer && !cookieHasLayer) {
      ensureCookie(localLayer)
      return
    }

    let aborted = false
    const controller = new AbortController()

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || aborted) return
        const countryCode: string | undefined = data.country_code
        if (!countryCode) return

        const layer = classifyLayer(countryCode)
        try {
          localStorage.setItem('userLayer', layer)
        } catch (error) {
          console.warn('Unable to persist userLayer to localStorage', error)
        }
        ensureCookie(layer)
      })
      .catch(() => {
        // Silent fallback when geo lookup fails
      })

    return () => {
      aborted = true
      controller.abort()
    }
  }, [])

  useEffect(() => {
    // Auto-detect language on first visit and translate immediately
    const autoDetectAndTranslate = () => {
      // Check if language was already set by user
      const savedLang = localStorage.getItem('preferredLanguage') || localStorage.getItem('language')
      if (savedLang) {
        // Language already set, don't auto-detect
        return
      }

      // Auto-detect language based on browser/location
      const detectUserLanguage = (): string => {
        if (typeof window === 'undefined') return 'en'
        
        // Check browser language
        const browserLang = navigator.language.toLowerCase()
        const langMap: Record<string, string> = {
          'de': 'de',
          'de-de': 'de',
          'de-ch': 'de',
          'de-at': 'de',
          'fr': 'fr',
          'fr-fr': 'fr',
          'fr-ch': 'fr',
          'it': 'it',
          'it-it': 'it',
          'it-ch': 'it',
          'es': 'es',
          'pt': 'pt',
          'zh': 'zh',
          'ar': 'ar',
          'hi': 'hi',
          'ru': 'ru',
          'ja': 'ja',
          'ko': 'ko',
        }
        
        // Check full locale first
        if (langMap[browserLang]) {
          return langMap[browserLang]
        }
        
        // Check language code only
        const langCode = browserLang.split('-')[0]
        if (langMap[langCode]) {
          return langMap[langCode]
        }
        
        // Try to detect from timezone (Swiss regions)
        try {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
          if (timeZone.includes('Zurich') || timeZone.includes('Bern')) {
            return 'de'
          }
          if (timeZone.includes('Geneva')) {
            return 'fr'
          }
        } catch (e) {
          // Ignore errors
        }
        
        // Default to English
        return 'en'
      }

      const detectedLang = detectUserLanguage()
      
      // Save detected language
      localStorage.setItem('preferredLanguage', detectedLang)
      localStorage.setItem('language', detectedLang)
      
      // Auto-translate if not English
      if (detectedLang !== 'en') {
        // Load Google Translate script
        const loadGoogleTranslate = () => {
          if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script')
            script.id = 'google-translate-script'
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.async = true
            document.head.appendChild(script)

            ;(window as any).googleTranslateElementInit = function() {
              try {
                new (window as any).google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,de,fr,it,es,pt,zh,ar,hi,ru,ja,ko',
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                  },
                  'google_translate_element'
                )
                
                // Create hidden element if it doesn't exist
                if (!document.getElementById('google_translate_element')) {
                  const element = document.createElement('div')
                  element.id = 'google_translate_element'
                  element.style.position = 'absolute'
                  element.style.visibility = 'hidden'
                  element.style.width = '0'
                  element.style.height = '0'
                  document.body.appendChild(element)
                }
                
                // Wait a bit then trigger translation
                setTimeout(() => {
                  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
                  if (selectElement) {
                    selectElement.value = detectedLang
                    selectElement.dispatchEvent(new Event('change'))
                  } else {
                    // Fallback: use cookies and reload
                    document.cookie = `googtrans=/en/${detectedLang}; path=/`
                    document.cookie = `googtrans=/en/${detectedLang}; path=/; domain=${window.location.hostname}`
                    setTimeout(() => {
                      window.location.reload()
                    }, 500)
                  }
                }, 1000)
              } catch (error) {
                console.error('Google Translate initialization failed:', error)
                // Fallback: use cookies and reload
                document.cookie = `googtrans=/en/${detectedLang}; path=/`
                document.cookie = `googtrans=/en/${detectedLang}; path=/; domain=${window.location.hostname}`
                setTimeout(() => {
                  window.location.reload()
                }, 500)
              }
            }
          } else {
            // Script already loaded, use cookie fallback
            document.cookie = `googtrans=/en/${detectedLang}; path=/`
            document.cookie = `googtrans=/en/${detectedLang}; path=/; domain=${window.location.hostname}`
            setTimeout(() => {
              window.location.reload()
            }, 500)
          }
        }

        loadGoogleTranslate()
      }
    }

    // Run auto-detection after a short delay to ensure page is loaded
    const timer = setTimeout(() => {
      autoDetectAndTranslate()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Register service worker for PWA functionality
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  return (
    <StackAuthProvider>
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <InitialQuizGate />
        <Header />
        <main className="flex-1 bg-white dark:bg-gray-900">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </StackAuthProvider>
  )
}


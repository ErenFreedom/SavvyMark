'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      // If user is logged in → go to dashboard
      if (data.session) {
        router.push('/dashboard')
      }
    }

    checkSession()

    // Also listen for login events (important for OAuth)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <main className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Check session on load
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Google Login
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }


  // Logout + Redirect
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="w-full border-b border-neutral-800 h-20 flex items-center">
      <div className="w-full px-10 flex items-center justify-between">

        {/* Left - Brand */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          SavvyMark
        </h1>

        {/* Right */}
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-neutral-300 hover:text-yellow-500 transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white text-black font-semibold px-8 py-4 rounded-2xl shadow-sm hover:bg-neutral-800 hover:text-white transition"
          >
            Login
          </button>
        )}

      </div>
    </header>
  )
}

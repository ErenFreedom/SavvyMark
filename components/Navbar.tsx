'use client'

import { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  // 🔥 Check session on load
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔥 Google Login
  const handleLogin = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/dashboard',
    },
  })
}



  // 🔥 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="w-full border-b border-neutral-800 h-20 flex items-center">
      <div className="w-full px-10 flex items-center justify-between">

        {/* Left - Brand */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          SavvyMark
        </h1>

        {/* Right - Conditional */}
        {user ? (
          <div className="flex items-center gap-6">
            <FaUserCircle
              className="text-3xl cursor-pointer transition-all duration-200 hover:text-yellow-500"
            />
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-400 hover:text-yellow-500 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button
              onClick={handleLogin}
              className="bg-white text-black font-semibold px-8 py-4 rounded-2xl shadow-sm transition-all duration-150 hover:bg-neutral-800 hover:text-white"
            >
              Login
            </button>

            <button
              onClick={handleLogin}
              className="bg-white text-black font-semibold px-8 py-4 rounded-2xl shadow-sm transition-all duration-150 hover:bg-neutral-800 hover:text-white"
            >
              Try It
            </button>
          </div>
        )}

      </div>
    </header>
  )
}

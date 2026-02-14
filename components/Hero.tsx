'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const slides = [
  {
    image: '/bookmark.png',
    title: 'Save What Matters',
    text: 'Organize your favorite websites effortlessly. Keep every important link just one click away — simple, fast, and beautifully structured.'
  },
  {
    image: '/network.png',
    title: 'Everything Connected',
    text: 'Your bookmarks update in real-time. Open multiple tabs and stay perfectly synced — your data follows you instantly.'
  },
  {
    image: '/security.png',
    title: 'Private & Secure',
    text: 'Your bookmarks are visible only to you. Powered by secure authentication and row-level security — your data stays yours.'
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setFade(true)
      }, 300)

    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="flex-1 flex items-center px-16">

      <div className="grid md:grid-cols-2 items-center gap-32 w-full">

        {/* Fixed Image Container */}
        <div className="flex justify-start w-[500px] h-[500px] items-center">
          <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              key={slides[current].image}
              src={slides[current].image}
              alt="feature"
              width={450}
              height={450}
              className="object-contain"
            />
          </div>
        </div>

        {/* Text */}
        <div className={`transition-opacity duration-500 max-w-2xl ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-6xl font-bold mb-10 leading-tight">
            {slides[current].title}
          </h2>
          <p className="text-neutral-400 text-2xl leading-relaxed">
            {slides[current].text}
          </p>
        </div>

      </div>

    </section>
  )
}

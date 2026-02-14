'use client'

import { FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 h-24 flex justify-center">

      <div className="flex flex-col items-center justify-center -mt-4 space-y-2">

        <h3 className="text-lg font-semibold tracking-wide">
          Follow us
        </h3>

        <div className="flex items-center gap-10 text-2xl">

          <a
            href="#"
            className="transition-all duration-300 hover:text-yellow-500 hover:scale-110"
          >
            <FaInstagram />
          </a>

          <a
            href="#"
            className="transition-all duration-300 hover:text-yellow-500 hover:scale-110"
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            className="transition-all duration-300 hover:text-yellow-500 hover:scale-110"
          >
            <FaXTwitter />
          </a>

        </div>

      </div>

    </footer>
  )
}

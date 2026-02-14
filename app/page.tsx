import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="h-screen bg-black text-white flex flex-col overflow-hidden">

      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}

import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
      <div className="bg-[#1e293b] px-4 py-2 text-center text-xs font-semibold tracking-wide text-[#fffdf5]">
        Complimentary shipping on orders over ₹75
      </div>

      <Navbar />

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:pt-16">
          <div className="max-w-xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#8b5cf6]">The everyday edit / 2026</p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-7xl">
              Good things,<br /><span className="text-[#8b5cf6]">well chosen.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#1e293b]/65">
              Considered pieces for your wardrobe, your home, and everywhere life takes you next.
            </p>
            <Link className="mt-8 inline-flex items-center rounded-full bg-[#8b5cf6] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#7c3aed]" to="/products">
              Explore the collection <span className="ml-3 text-lg" aria-hidden="true">-&gt;</span>
            </Link>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#fef3c7] sm:min-h-[540px]">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
              alt="A bright, curated clothing store interior"
            />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-[#fffdf5] px-5 py-4 sm:bottom-7 sm:left-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6]">ShopKart</p>
              <p className="mt-1 font-bold">Discover something considered</p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#1e293b]/10 bg-[#f1f5f9]" id="about">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">Why ShopKart</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-black leading-tight tracking-[-0.06em]">Less noise. More of the good stuff.</h2>
            </div>
            <p className="text-base leading-7 text-[#1e293b]/65">We look for useful, beautiful things from makers who care about the details. Browse the live collection and find your next favorite.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home

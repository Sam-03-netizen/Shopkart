import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

const highlights = [
  { number: '01', title: 'Find your favorites', description: 'Explore a thoughtful mix of products, with simple search and category filters.' },
  { number: '02', title: 'Save what you love', description: 'Keep a wishlist close and collect the things you want to come back to.' },
  { number: '03', title: 'Checkout with ease', description: 'Manage your cart, place an order, and keep track of it all in one place.' },
]

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf5] text-[#1e293b]">
      <div className="bg-[#1e293b] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-[#fffdf5]">
        A little something good for your everyday
      </div>

      <header className="border-b border-[#1e293b]/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link className="text-2xl font-black tracking-[-0.06em]" to="/" aria-label="ShopKart home">
            shop<span className="text-[#8b5cf6]">kart</span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-3 text-sm font-semibold sm:gap-5">
            <Link className="hidden rounded-full px-3 py-2 transition hover:bg-[#fef3c7] sm:inline-flex" to="/login">Log in</Link>
            <Link className="rounded-full border-2 border-[#1e293b] bg-[#8b5cf6] px-4 py-2.5 text-white shadow-[4px_4px_0_#1e293b] transition hover:-translate-y-0.5 hover:bg-[#7c3aed]" to="/register">Get started <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e293b]/10 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7c3aed] shadow-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#34d399]" /> A brighter way to shop
          </p>
          <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.07em] sm:text-7xl">
            Good things,<br /><span className="text-[#8b5cf6]">well chosen.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#1e293b]/65 sm:text-lg sm:leading-8">
            Meet ShopKart: an easy place to discover everyday finds, save your favorites, and get them on their way.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link className="inline-flex items-center rounded-full border-2 border-[#1e293b] bg-[#8b5cf6] px-6 py-3.5 text-sm font-extrabold text-white shadow-[5px_5px_0_#1e293b] transition hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-[7px_7px_0_#1e293b]" to="/register">
              Start exploring <span className="ml-3 text-lg" aria-hidden="true">→</span>
            </Link>
            <Link className="text-sm font-bold underline decoration-[#fbbf24] decoration-2 underline-offset-4 transition hover:text-[#7c3aed]" to="/login">Already have an account?</Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs font-semibold text-[#1e293b]/55">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffdf5] bg-[#fbbf24]">✦</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffdf5] bg-[#f472b6]">♡</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffdf5] bg-[#34d399]">✓</span>
            </span>
            Your next favorite is waiting
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mr-0">
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#fbbf24] sm:-right-7 sm:-top-7 sm:h-36 sm:w-36" />
          <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-[#f472b6] sm:-bottom-7 sm:-left-7 sm:h-32 sm:w-32" />
          <div className="relative aspect-[1.12/1] overflow-hidden rounded-[2rem] border-2 border-[#1e293b] bg-[#fef3c7] shadow-[9px_9px_0_#1e293b] sm:rounded-[2.5rem] sm:shadow-[12px_12px_0_#1e293b]">
            <img className="h-full w-full object-cover" src={heroImage} alt="A curated selection of products ready to discover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e293b]/70 to-transparent px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">The everyday edit</p>
              <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">Small finds. Big feel-good.</p>
            </div>
          </div>
          <div className="absolute -left-2 top-8 rotate-[-8deg] rounded-xl border-2 border-[#1e293b] bg-white px-4 py-2 text-sm font-extrabold shadow-[4px_4px_0_#8b5cf6] sm:-left-8 sm:top-12">Picked for you ✦</div>
        </div>
      </section>

      <section className="border-y border-[#1e293b]/10 bg-[#f8f5eb]" aria-labelledby="how-it-works">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8b5cf6]">Your kind of checkout</p>
              <h2 id="how-it-works" className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-[-0.06em] sm:text-5xl">A good find is just the beginning.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#1e293b]/60">Everything you need to make shopping feel a little more like you.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map(({ number, title, description }, index) => (
              <article className="bg-white p-6 sm:p-7" key={number}>
                <span className={`grid h-11 w-11 place-items-center rounded-full border-2 border-[#1e293b] text-sm font-black ${index === 0 ? 'bg-[#fbbf24]' : index === 1 ? 'bg-[#f472b6]' : 'bg-[#34d399]'}`}>{number}</span>
                <h3 className="mt-7 text-xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1e293b]/60">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-[#1e293b]/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link className="w-fit text-lg font-black tracking-[-0.06em] text-[#1e293b]" to="/">shop<span className="text-[#8b5cf6]">kart</span></Link>
        <p>Find something good for every day.</p>
        <div className="flex gap-5 font-semibold text-[#1e293b]/75"><Link to="/login">Log in</Link><Link to="/register">Create account</Link></div>
      </footer>
    </main>
  )
}

export default Landing

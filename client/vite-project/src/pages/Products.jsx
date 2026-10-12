import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { fetchProductCategories, fetchProducts } from '../services/productApi'

function Products() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [status, setStatus] = useState('loading')
  const [categoryStatus, setCategoryStatus] = useState('loading')
  const [categoryAttempt, setCategoryAttempt] = useState(0)
  const [productAttempt, setProductAttempt] = useState(0)

  useEffect(() => {
    let active = true

    fetchProductCategories()
      .then((items) => {
        if (!active) return
        setCategories(items)
        setCategoryStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setCategories([])
        setCategoryStatus('error')
      })

    return () => { active = false }
  }, [categoryAttempt])

  useEffect(() => {
    let active = true
    const timeout = setTimeout(() => {
      setStatus('loading')
      fetchProducts({ search: search.trim(), category, sort })
        .then(({ products: items, count }) => {
          if (!active) return
          setProducts(items)
          setProductCount(count)
          setStatus(items.length ? 'ready' : 'empty')
        })
        .catch(() => active && setStatus('error'))
    }, 250)

    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [search, category, sort, productAttempt])

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/home" className="inline-flex text-sm font-semibold text-[#7c3aed] transition hover:text-[#1e293b] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]">← Back home</Link>
        <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7c3aed]">ShopKart collection</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Find your next favorite.</h1>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[minmax(220px,1.2fr)_minmax(180px,0.85fr)_minmax(200px,1fr)]">
            <label className="sr-only" htmlFor="product-search">Search products</label>
            <input
              id="product-search"
              className="min-w-0 rounded-full border border-[#1e293b]/15 bg-white px-5 py-3 text-sm shadow-sm outline-none transition placeholder:text-[#1e293b]/45 hover:border-[#1e293b]/30 focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div>
              <label className="sr-only" htmlFor="product-category">Filter by category</label>
              <select
                id="product-category"
                className="w-full rounded-full border border-[#1e293b]/15 bg-white px-5 py-3 text-sm shadow-sm outline-none transition hover:border-[#1e293b]/30 focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10 disabled:cursor-wait disabled:opacity-60"
                value={category}
                disabled={categoryStatus !== 'ready'}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {categoryStatus === 'loading' && <p className="mt-1 text-xs text-[#1e293b]/60">Loading categories…</p>}
              {categoryStatus === 'error' && (
                <p className="mt-1 text-xs text-red-700" role="alert">
                  Categories unavailable.{' '}
                  <button
                    className="underline"
                    type="button"
                    onClick={() => {
                      setCategoryStatus('loading')
                      setCategoryAttempt((attempt) => attempt + 1)
                    }}
                  >
                    Retry
                  </button>
                </p>
              )}
            </div>
            <label className="sr-only" htmlFor="product-sort">Sort products by price</label>
            <select
              id="product-sort"
              className="w-full rounded-full border border-[#1e293b]/15 bg-white px-5 py-3 text-sm shadow-sm outline-none transition hover:border-[#1e293b]/30 focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {status === 'loading' && <p className="py-20 text-center" role="status">Loading products…</p>}
        {status === 'error' && (
          <div className="py-20 text-center text-red-700" role="alert">
            <p>Something went wrong while loading products.</p>
            <button className="mt-3 underline" type="button" onClick={() => setProductAttempt((attempt) => attempt + 1)}>
              Try again
            </button>
          </div>
        )}
        {status === 'empty' && <p className="py-20 text-center text-[#1e293b]/60">No products found.</p>}

        {status === 'ready' && (
          <div>
            <p className="mt-8 text-sm text-[#1e293b]/60">{productCount} {productCount === 1 ? 'product' : 'products'}</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Products

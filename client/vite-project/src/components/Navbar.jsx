import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { useCart } from '../context/CartContext'

function Navbar() {
  const navigate = useNavigate()
  const { cartCount } = useCart()

  const handleLogout = async () => {
    try {
      await axiosInstance.post('customers/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      navigate('/login')
    }
  }

  return (
    <header className="border-b border-[#1e293b]/10 bg-[#fffdf5]/95 px-5 py-5 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link className="text-2xl font-black tracking-[-0.06em]" to="/home">
          shop<span className="text-[#8b5cf6]">kart</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <Link className="transition hover:text-[#8b5cf6]" to="/products">Products</Link>
          <Link className="transition hover:text-[#8b5cf6]" to="/wishlist">Wishlist</Link>
          <Link className="transition hover:text-[#8b5cf6]" to="/orders">Orders</Link>
          <Link className="transition hover:text-[#8b5cf6]" to="/cart">Cart{cartCount > 0 ? ` (${cartCount})` : ''}</Link>
        </nav>
        <button
          className="rounded-full border border-[#1e293b]/20 bg-[#1e293b] px-4 py-2 text-sm font-semibold text-[#fffdf5] transition hover:bg-[#8b5cf6]"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar

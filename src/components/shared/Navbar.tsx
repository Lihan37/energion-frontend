import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navItems } from '../../constants/site'
import { prefetchRoute } from '../../app/routePrefetch'
import { useAuth } from '../../context/auth-store'
import { useDialogFocus } from '../../lib/useDialogFocus'
import logo from '../../assets/Energion Mobility logo-01.png'
import { Container } from '../ui/Container'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const reduced = useReducedMotion()
  const menuRef = useRef<HTMLDivElement>(null)
  useDialogFocus(open, menuRef, () => setOpen(false))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  async function signOut() {
    try {
      await logout()
      setOpen(false)
      setLogoutError('')
    } catch {
      setLogoutError('Could not sign out. Please try again.')
    }
  }

  const account =
    user?.role === 'admin'
      ? { href: '/admin/dashboard', label: 'Dashboard' }
      : { href: '/auth', label: user ? 'Account' : 'Login' }
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-4 focus:text-black"
      >
        Skip to content
      </a>
      <header className={`site-header ${pathname === '/' && !scrolled ? 'is-overlay' : ''}`}>
        <Container>
          <div className="header-inner">
            <Link to="/" aria-label="Energion home">
              <img
                src={logo}
                alt="Energion E-Mobility"
                className="official-logo rounded-sm bg-white px-2"
              />
            </Link>
            <nav className="header-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavLink
                  end={item.href === '/'}
                  key={item.href}
                  to={item.href}
                  onMouseEnter={() => prefetchRoute(item.href)}
                  onFocus={() => prefetchRoute(item.href)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="header-actions">
              <Link to={account.href}>{account.label}</Link>
              {user && <button onClick={() => void signOut()}>Logout</button>}
              <Link to="/contact" className="cta">
                Enquire now <ArrowUpRight size={15} />
              </Link>
            </div>
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
          {logoutError && (
            <p role="alert" className="pb-2 text-xs">
              {logoutError}
            </p>
          )}
        </Container>
      </header>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="mobile-menu"
              initial={{ opacity: 0, y: reduced ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mobile-menu-top">
                <img
                  src={logo}
                  alt="Energion E-Mobility"
                  className="official-logo rounded-sm bg-white px-2"
                />
                <button
                  className="icon-button"
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <nav aria-label="Mobile">
                {navItems.map((item) => (
                  <NavLink
                    end={item.href === '/'}
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mobile-menu-bottom">
                <Link to="/contact" className="cta" onClick={() => setOpen(false)}>
                  Enquire now <ArrowUpRight size={18} />
                </Link>
                <Link to={account.href} onClick={() => setOpen(false)}>
                  {account.label}
                </Link>
                {user && <button onClick={() => void signOut()}>Logout</button>}
                {logoutError && <p role="alert">{logoutError}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

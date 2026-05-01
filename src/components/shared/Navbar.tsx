import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { navItems } from '../../constants/site'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Energion Mobility logo-01.png'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-[rgba(248,251,255,0.78)] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Energion E-Mobility"
            className="h-11 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[rgba(16,27,45,0.06)] bg-white/80 px-2 py-2 lg:flex">
          {navItems.map((item) => (
            <motion.div key={item.href} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950',
                    isActive && 'bg-brand-gradient !text-white shadow-[0_10px_20px_rgba(49,94,230,0.18)]',
                  )
                }
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user?.role === 'admin' ? (
            <Link to="/admin/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button>{isLoading ? 'Loading...' : 'Login'}</Button>
            </Link>
          )}
          {user ? (
            <Button variant="ghost" onClick={() => void logout()}>
              Logout
            </Button>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-[rgba(16,27,45,0.08)] bg-white/85 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/28 backdrop-blur-[2px] lg:hidden"
          >
            <motion.div
              initial={{ y: -28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute inset-x-0 top-0 border-b border-[rgba(16,27,45,0.06)] bg-[rgba(248,251,255,0.98)] shadow-[0_24px_60px_rgba(8,17,31,0.16)]"
            >
              <Container className="flex h-20 items-center justify-between gap-6">
                <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                  <img
                    src={logo}
                    alt="Energion E-Mobility"
                    className="h-11 w-auto object-contain"
                  />
                </Link>

                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-[rgba(16,27,45,0.08)] bg-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </button>
              </Container>

              <Container className="flex flex-col gap-3 pb-6">
                {navItems.map((item) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition',
                          isActive && 'bg-[rgba(49,94,230,0.08)] text-[var(--brand-start)]',
                        )
                      }
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
                    <Button fullWidth>Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button fullWidth>{isLoading ? 'Loading...' : 'Login'}</Button>
                  </Link>
                )}
                {user ? (
                  <Button
                    fullWidth
                    variant="ghost"
                    onClick={async () => {
                      await logout()
                      setOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                ) : null}
              </Container>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

import {
  Bike,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPinned,
  MessageSquare,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../context/auth-store'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, live: true },
  { label: 'Products', href: '/admin/products', icon: Bike, live: true },
  { label: 'Blog and Media', href: '/admin/blogs', icon: FileText, live: true },
  { label: 'Dealers / Map Points', href: '/admin/dealers', icon: MapPinned, live: true },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, live: true },
  { label: 'Settings', href: '/admin/settings', icon: Settings, live: true },
  { label: 'Admins', href: '/admin/admins', icon: ShieldCheck, live: true },
] as const

export function AdminSidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="h-full rounded-[2rem] border border-white/10 bg-white/8 p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl xl:sticky xl:top-5">
      <div className="rounded-[1.7rem] bg-brand-gradient p-5 text-ink-950">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-950/75">
          Energion Control
        </div>
        <div className="mt-3 font-display text-2xl font-semibold">Admin Dashboard</div>
        <p className="mt-3 text-sm leading-7 text-ink-950/80">
          Secure access for backend-approved admin phone numbers.
        </p>
      </div>

      <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/30 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Signed in as
        </div>
        <div className="mt-3 text-lg font-semibold text-white">{user?.name ?? 'Admin'}</div>
        <div className="mt-1 text-sm text-slate-300">{user?.phone ?? 'No phone'}</div>
        <Badge tone="gradient" className="mt-4">
          Authorized Admin
        </Badge>
      </div>

      <nav className="mt-6 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === '/admin/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition no-underline',
                  isActive
                    ? 'bg-white shadow-[0_12px_30px_rgba(255,255,255,0.08)]'
                    : 'bg-white/6 text-slate-200 hover:bg-white/10',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex items-center gap-3',
                      isActive ? 'text-slate-950' : 'text-slate-200',
                    )}
                  >
                    <Icon
                      className={cn('size-4', isActive ? 'text-slate-950' : 'text-slate-200')}
                    />
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'text-[11px] uppercase tracking-[0.24em]',
                      isActive ? 'text-slate-500' : 'text-slate-300',
                    )}
                  >
                    Live
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 flex flex-col gap-3">
        <NavLink
          to="/products"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          View public products page
        </NavLink>
        <Button
          variant="ghost"
          className="w-full justify-center border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          onClick={() => void logout()}
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}

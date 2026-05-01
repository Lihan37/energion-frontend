export const siteConfig = {
  name: 'Energion E-Mobility',
  tagline: 'Premium electric bikes for fast, clean urban motion.',
  email: 'hello@energion-emobility.com',
  phone: '+880 1700-000000',
  address: 'Sector 7, Uttara, Dhaka 1230',
}

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Map', href: '/map' },
] as const

export const adminNavItems = [
  'Products',
  'Blogs',
  'Dealers / Map Points',
  'Messages',
  'Settings',
  'Admins',
] as const

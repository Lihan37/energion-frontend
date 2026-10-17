import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { navItems, siteConfig } from '../../constants/site'
import logo from '../../assets/Energion Mobility logo-01.png'
import { Container } from '../ui/Container'
import { CampaignHeading } from '../campaign/CampaignHeading'

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <CampaignHeading lines={['Move forward.', 'Leave less behind.']} />
          <Link to="/products" className="cta cta-outline">
            Explore our bikes <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="footer-columns">
          <div>
            <Link to="/" aria-label="Energion home">
              <img
                src={logo}
                alt="Energion E-Mobility"
                className="official-logo rounded-sm bg-white px-2"
              />
            </Link>
            <p className="mt-5 max-w-xs">
              Electric mobility for the everyday. A cleaner way to move through Bangladesh.
            </p>
          </div>
          <div>
            <h3>Discover</h3>
            <nav aria-label="Footer navigation">
              {navItems
                .filter((item) => item.href !== '/')
                .map((item) => (
                  <Link key={item.href} to={item.href}>
                    {item.label}
                  </Link>
                ))}
              <Link to="/auth">Account / Admin login</Link>
            </nav>
          </div>
          <div>
            <h3>Get in touch</h3>
            <address className="not-italic">
              <p>{siteConfig.address}</p>
              <a className="mt-4 block" href={`tel:${siteConfig.phone}`}>
                {siteConfig.phone}
              </a>
              <a className="block break-all" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </address>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          ENERGION
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Energion E-Mobility. All rights reserved.</span>
          <span>Electric by nature. Energion by choice.</span>
        </div>
      </Container>
    </footer>
  )
}

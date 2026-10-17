import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CampaignHeading } from '../campaign/CampaignHeading'

export function EnquiryCTA() {
  return (
    <div className="enquiry-band">
      <div>
        <CampaignHeading lines={['Your next chapter.', 'Make it electric.']} />
        <p>Find your Energion. Let our team help you choose.</p>
      </div>
      <Link className="cta" to="/contact">
        Let's talk <ArrowUpRight size={18} />
      </Link>
    </div>
  )
}

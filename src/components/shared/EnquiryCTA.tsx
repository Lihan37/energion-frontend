import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EnquiryCTA() {
  return (
    <div className="enquiry-band">
      <div>
        <h2>
          Your next chapter.
          <br />
          Make it electric.
        </h2>
        <p>Find your Energion. Let our team help you choose.</p>
      </div>
      <Link className="cta" to="/contact">
        Let's talk <ArrowUpRight size={18} />
      </Link>
    </div>
  )
}

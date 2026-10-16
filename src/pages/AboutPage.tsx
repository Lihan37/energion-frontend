import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { VehicleImage } from '../components/product/VehicleImage'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'
import { EnquiryCTA } from '../components/shared/EnquiryCTA'
import { getProducts } from '../services/productService'

const values = [
  [
    'Practical innovation',
    'We embrace technology to deliver electric mobility that is useful, reliable and suited to everyday journeys.',
  ],
  [
    'People come first',
    'Our customers and our team shape our direction. We value integrity, collaboration and a service experience built on trust.',
  ],
  [
    'A cleaner tomorrow',
    'Our vision is to make sustainable transportation accessible, reliable and environmentally responsible.',
  ],
]

export function AboutPage() {
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const model = query.data?.find((item) => item.slug === 'evox') ?? query.data?.[0]
  return (
    <>
      <Container>
        <div className="page-intro">
          <span className="eyebrow">We are Energion</span>
          <h1 className="display-title">
            New energy.
            <br />
            Shared ambition.
          </h1>
          <p className="body-copy">
            We believe the future of transportation should be cleaner, smarter and accessible to
            everyone.
          </p>
        </div>
      </Container>
      <section className="section-dark section-space">
        <Container>
          <div className="technology-layout">
            <Reveal>
              <span className="eyebrow">Our purpose</span>
              <h2 className="section-title mt-5">
                Change the way
                <br />
                we move.
              </h2>
              <p className="body-copy mt-6">
                Energion E-Mobility is committed to transforming transportation with eco-friendly
                electric vehicles. Our management team brings over a decade of industry experience
                to a new chapter in mobility.
              </p>
              <Link to="/products" className="text-link mt-6">
                Meet our electric lineup <ArrowUpRight size={17} />
              </Link>
            </Reveal>
            <Reveal>
              <div className="technology-visual">
                {model ? (
                  <VehicleImage src={model.image} name={model.name} />
                ) : (
                  <span className="section-title">
                    The future
                    <br />
                    rides electric.
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
      <Container>
        <Reveal>
          <section className="brand-story">
            <div>
              <span className="eyebrow">What drives us</span>
              <h2 className="section-title mt-5">
                Purpose in
                <br />
                every journey.
              </h2>
            </div>
            <div>
              <p>
                Our mission is to provide high-quality electric vehicles that reduce emissions and
                meet everyday mobility needs through innovation and customer focus.
              </p>
              <p>
                We are dedicated to meeting the evolving needs of our customers with reliable
                products and outstanding service. Our talented, diverse team works in an inclusive
                environment that encourages innovation, personal growth and collaboration.
              </p>
              <p>
                With integrity and a clear vision, we are shaping a cleaner, smarter transportation
                future.
              </p>
            </div>
          </section>
        </Reveal>
      </Container>
      <section className="section-dark section-space">
        <Container>
          <span className="eyebrow">Our principles</span>
          <h2 className="section-title mt-5">Progress with purpose.</h2>
          <div className="values-grid">
            {values.map(([title, description], index) => (
              <Reveal key={title} delay={index * 0.08}>
                <article className="value-item">
                  <span className="mb-6 block text-xs text-brand-500">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <Container>
        <div className="section-space">
          <EnquiryCTA />
        </div>
      </Container>
    </>
  )
}

import { team } from '../../data/team'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SmoothImage } from '../ui/SmoothImage'

export function TeamSection() {
  return (
    <section className="section-space about-team" aria-labelledby="team-heading">
      <Container>
        <div className="team-intro">
          <div>
            <span className="eyebrow">The people behind EZ GO</span>
            <h2 id="team-heading" className="section-title mt-5">Our team. Shared ambition.</h2>
          </div>
          <p className="body-copy">Meet the people bringing our homegrown electric brand to life.</p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <Reveal key={member.photo} delay={(index % 3) * 0.06}>
              <article className="team-member">
                <div className="team-portrait">
                  <SmoothImage
                    src={`/images/team/${member.photo}.jpeg`}
                    alt={member.name}
                    width={600}
                    height={750}
                  />
                </div>
                <div className="team-member-info">
                  <span className="team-member-index" aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

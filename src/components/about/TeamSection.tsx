import { team } from '../../data/team'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SmoothImage } from '../ui/SmoothImage'

export function TeamSection() {
  const [founder, ...members] = team
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
        <Reveal>
          <article className="team-founder" aria-labelledby="founder-name">
            <div className="team-portrait founder-portrait">
              <SmoothImage
                src={`/images/team/${founder.photo}.jpeg`}
                alt={founder.name}
                width={600}
                height={750}
              />
            </div>
            <div className="founder-profile">
              <span className="eyebrow">Our founder / EZ GO</span>
              <div>
                <h3 id="founder-name">{founder.name}</h3>
                <p className="founder-role">{founder.role}</p>
              </div>
              <div className="founder-purpose">
                <p>A homegrown brand.<br />A shared ambition.</p>
                <span>Bringing new energy to everyday mobility in Bangladesh.</span>
              </div>
            </div>
          </article>
        </Reveal>
        <div className="team-grid-label">
          <span>Our leadership team</span>
          <span aria-hidden="true">People. Purpose. Progress.</span>
        </div>
        <div className="team-grid">
          {members.map((member, index) => (
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
                  <span className="team-member-index" aria-hidden="true">0{index + 2}</span>
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

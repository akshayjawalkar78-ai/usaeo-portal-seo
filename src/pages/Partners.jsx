import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PARTNERS, PARTNER_BY_NAME } from '@/lib/partnersSeed';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const contributionSections = [
  {
    id: 'academic',
    eyebrow: 'Academic contribution',
    title: 'Raising the bar\non competition rigor',
    body: 'Our academic partners co-develop problem sets, review competition content, and bring postsecondary-level economics thinking into reach for every competitor.',
    stories: [
      { partner: 'Stellar', headline: 'Practice sets that scale', body: 'Stellar contributed adaptive practice modules aligned to the USAEO qualifier syllabus, used by 500+ students this season.' },
      { partner: 'Crackd', headline: 'Mock exams, full stack', body: 'Crackd built our first timed mock-qualifier and published difficulty analytics for every section of the USAEO.' },
      { partner: 'Youth Economics Lab', headline: 'Curriculum advisory', body: 'YEL reviewed the open curriculum units end-to-end and contributed additional problem sets on international trade.' },
      { partner: 'Think Finance', headline: 'Financial markets deep-dives', body: 'Think Finance authored a weekend workshop series on bond pricing and monetary policy that fed directly into finals prep.' },
      { partner: 'CFE', headline: 'Academic oversight', body: 'The Council for Financial Education reviewed judge rubrics and helped calibrate our essay scoring guide.' },
    ],
  },
  {
    id: 'awareness',
    eyebrow: 'Awareness',
    title: 'Bringing the competition\nto more students',
    body: 'These partners amplify the USAEO across their networks — clubs, classrooms, and regional communities — so every student hears about us on time.',
    stories: [
      { partner: 'Fintech Scholars', headline: 'Campus outreach', body: 'Fintech Scholars drove 200+ new registrations through their club network in a single month.' },
      { partner: 'FYC', headline: 'Local chapter activation', body: 'FYC activated five new city chapters to promote the Quiz Bowl and host study halls.' },
      { partner: 'A-Warded', headline: 'Credential surface', body: 'A-Warded surfaced the USAEO on every relevant student profile, widening the applicant funnel by 30%.' },
      { partner: 'Southeast Asian Economics Project', headline: 'Regional reach', body: 'SEAE organized info-sessions across their international network to extend USAEO visibility.' },
      { partner: 'CFE', headline: 'Newsletter features', body: 'CFE featured the USAEO in their nationwide educator newsletter — twice.' },
    ],
  },
  {
    id: 'research',
    eyebrow: 'Research & careers',
    title: 'Connecting research\nand career pipelines',
    body: 'Our research partners place students into mentored projects, internships, and long-term research programs that turn competition wins into real careers.',
    stories: [
      { partner: 'YRI', headline: 'Mentored research', body: 'YRI paired six USAEO finalists with PhD mentors on original economics research projects.' },
      { partner: 'Launchpoint', headline: 'Career placement', body: 'Launchpoint surfaced finance and policy internships to every registered USAEO student.' },
      { partner: 'Synthica', headline: 'Research tooling', body: 'Synthica granted USAEO research fellows free access to their AI-assisted analysis workbench.' },
      { partner: 'Youth Economics Lab', headline: 'Publication track', body: 'YEL offered top essay submissions a fast-track editorial review for publication.' },
      { partner: 'Southeast Asian Economics Project', headline: 'International research', body: 'SEAE connected USAEO researchers to field-work opportunities across Southeast Asia.' },
    ],
  },
];

function SectionLogos({ section }) {
  const logos = PARTNERS.filter(p => (p.tags || []).includes(section.id));
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {logos.map(p => (
        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
          title={p.name}
          className="h-9 w-9 rounded-lg border border-border bg-white flex items-center justify-center hover:border-primary/40 transition">
          {p.logo
            ? <img src={p.logo} alt={p.name} className="h-5 w-auto max-w-[24px] object-contain opacity-70 hover:opacity-100 transition" />
            : <span className="text-[9px] font-semibold text-muted-foreground">{p.shortName || p.name.split(' ').map(w => w[0]).join('').slice(0, 3)}</span>
          }
        </a>
      ))}
    </div>
  );
}

function ContributionSection({ section }) {
  return (
    <section className="py-20 px-5 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[minmax(0,1fr)_2fr] gap-10 md:gap-16 items-start">
          <div className="md:sticky md:top-24 self-start">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">{section.eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight whitespace-pre-line mb-5">{section.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            <SectionLogos section={section} />
          </div>
          <div className="-mx-5 md:mx-0 overflow-x-auto snap-x snap-mandatory pb-4 scroll-px-5 [scrollbar-width:thin]">
            <div className="flex gap-5 px-5 md:px-0">
              {section.stories.map((s, i) => {
                const p = PARTNER_BY_NAME[s.partner];
                return (
                  <motion.article
                    key={s.partner + i}
                    {...fadeUp(i * 0.05)}
                    className="snap-start flex-shrink-0 w-[280px] md:w-[360px] bg-white border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      {p?.logo
                        ? <img src={p.logo} alt={p.name} className="h-7 w-auto max-w-[64px] object-contain" />
                        : <span className="text-xs font-semibold text-muted-foreground">{p?.shortName || s.partner}</span>
                      }
                      <span className="text-xs font-medium text-muted-foreground">{s.partner}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg leading-tight mb-3">{s.headline}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Partners() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Partners</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Building the future<br /><em>together</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              We're proud to partner with education-driven organizations that share our mission of making economics education accessible and world-class.
            </p>
          </motion.div>
        </div>
      </section>

      {contributionSections.map(section => (
        <ContributionSection key={section.id} section={section} />
      ))}

      {/* Current Partners grid */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Current Partners</p>
            <h2 className="font-serif text-3xl text-foreground">Our partner network</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNERS.map((p, i) => (
              <motion.div key={p.name} {...fadeUp(i * 0.06)}>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 p-8 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="h-10 flex items-center gap-2">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} style={{ height: p.logoScale ? 40 * p.logoScale : 40 }} className="w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">{p.shortName || p.name.split(' ').map(w => w[0]).join('').slice(0, 3)}</span>
                    )}
                    {p.wordmark && (
                      <span style={{ fontFamily: p.wordmark.fontFamily, fontWeight: p.wordmark.fontWeight }} className="text-xl text-foreground/70 group-hover:text-foreground whitespace-nowrap">
                        {p.wordmark.text}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner — header only, tier cards intentionally removed. */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Become a Partner</p>
            <h2 className="font-serif text-4xl text-foreground">Partner with USAEO</h2>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PARTNERS, PARTNER_BY_NAME } from '@/lib/partnersSeed';
import Seo from '@/components/Seo';
import { PAGE_SEO } from '@/lib/seo-config';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
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
      { partner: 'Youth Economy Lab', headline: 'Curriculum advisory', body: 'YEL reviewed the open curriculum units end-to-end and contributed additional problem sets on international trade.' },
      { partner: 'Think Finance', headline: 'Financial markets deep-dives', body: 'Think Finance authored a weekend workshop series on bond pricing and monetary policy that fed directly into finals prep.' },
      { partner: 'CFE', headline: 'Academic oversight', body: 'The Council for Financial Education reviewed judge rubrics and helped calibrate our essay scoring guide.' },
      { partner: 'YIMO', headline: 'IMO-level problems for economics', body: 'YIMO contributors — including IMO participants and USAMO honorable mentions — review and author high-difficulty math problems aligned to economics, raising the technical ceiling of the USAEO.' },
      { partner: 'International Economics Post', headline: 'Essay competition sponsor', body: 'International Economics Post supports our essay competition by providing editorial guidance and amplifying student submissions to their readership of economics students and professionals.' },
    ],
  },
  {
    id: 'awareness',
    eyebrow: 'Awareness',
    title: 'Bringing the competition\nto more students',
    body: 'These partners amplify the USAEO across their networks, clubs, classrooms, and regional communities, so every student hears about us on time.',
    stories: [
      { partner: 'Fintech Scholars', headline: 'Campus outreach', body: 'Fintech Scholars drove 200+ new registrations through their club network in a single month.' },
      { partner: 'FYC', headline: 'Local chapter activation', body: 'FYC activated five new city chapters to promote the Quiz Bowl and host study halls.' },
      { partner: 'A-Warded', headline: 'Credential surface', body: 'A-Warded surfaced the USAEO on every relevant student profile, widening the applicant funnel by 30%.' },
      { partner: 'Southeast Asian Economics Project', headline: 'Regional reach', body: 'SEAE organized info-sessions across their international network to extend USAEO visibility.' },
      { partner: 'CFE', headline: 'Newsletter features', body: 'CFE featured the USAEO in their nationwide educator newsletter, twice.' },
      { partner: 'NXTHorizon', headline: 'Sponsorship that lowers the bar', body: 'NXTHorizon brings its sponsor network to the USAEO National Finals, reducing competition costs and making in-person participation accessible to more students.' },
      { partner: 'Financial Freedom Initiative', headline: 'Financial literacy events', body: 'FFI partners with USAEO to cross-promote financial literacy events, bringing targeted programming to student communities interested in personal finance and investing.' },
      { partner: 'BizEmpower', headline: 'Community outreach & fundraising', body: 'BizEmpower amplifies USAEO across their network, supports grant outreach, helps raise donations, and recruits volunteers to sustain our programs.' },
      { partner: 'Empiric Investing', headline: 'Financial literacy advocacy', body: 'Empiric Investing supports our financial literacy initiatives, helping communicate the value of economics education to aspiring investors and students.' },
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
      { partner: 'Youth Economy Lab', headline: 'Publication track', body: 'YEL offered top essay submissions a fast-track editorial review for publication.' },
      { partner: 'Southeast Asian Economics Project', headline: 'International research', body: 'SEAE connected USAEO researchers to field-work opportunities across Southeast Asia.' },
      { partner: 'International Economics Post', headline: 'Blog content partnership', body: 'IEP collaborates with USAEO to develop blog content that connects competition economics to real-world policy analysis and research.' },
      { partner: 'Empiric Investing', headline: 'Blog content & market analysis', body: 'Empiric Investing contributes to USAEO blog content, bringing market analysis and investing perspectives to our student research community.' },
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
            ? <img src={p.logo} alt={p.name} className="h-5 w-auto max-w-[24px] object-contain opacity-70 hover:opacity-100 transition"  loading="lazy" decoding="async" />
            : <span className="text-[9px] font-semibold text-muted-foreground">{p.shortName || p.name.split(' ').map(w => w[0]).join('').slice(0, 3)}</span>
          }
        </a>
      ))}
    </div>
  );
}

function ProgressDot({ scrollYProgress, i, count }) {
  const opacity = useTransform(
    scrollYProgress,
    [i / count - 0.1, i / count, (i + 1) / count],
    [0.3, 1, 0.3]
  );
  return <motion.span style={{ opacity }} className="h-1 w-6 rounded-full bg-primary" />;
}

function StoryCard({ story }) {
  const p = PARTNER_BY_NAME[story.partner];
  return (
    <article className="flex-shrink-0 w-[420px] md:w-[520px] h-[480px] bg-white border border-border rounded-3xl p-10 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center gap-3 mb-8 h-12">
          {p?.logo && (
            <img src={p.logo} alt={p.name} className="h-10 w-auto max-w-[96px] object-contain" style={p.logoFilter ? { filter: p.logoFilter } : undefined} onError={e => { e.currentTarget.style.display = 'none'; }} />
          )}
          {p?.wordmark && (
            <span style={{ fontFamily: p.wordmark.fontFamily, fontWeight: p.wordmark.fontWeight, fontSize: p.wordmark.fontSize, whiteSpace: p.wordmark.wrap ? 'pre-line' : 'nowrap', lineHeight: 1.2 }} className="text-2xl text-foreground/80">
              {p.wordmark.text}
            </span>
          )}
          {!p?.logo && !p?.wordmark && (
            <span className="text-lg font-semibold text-foreground">{story.partner}</span>
          )}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-4">{story.partner}</p>
        <h3 className="font-sans text-3xl text-foreground leading-tight mb-5">{story.headline}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{story.body}</p>
      </div>
    </article>
  );
}

function ContributionSection({ section, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Scroll distance: section is 3Ã— viewport tall; while sticky, horizontal track translates.
  // Cards total width â‰ˆ storyCount Ã— 540px. Viewport right-pane â‰ˆ 65vw.
  // Translate track from 0 to -(totalCards - viewportFit).
  const storyCount = section.stories.length;
  const cardW = 540; // card + gap approx
  const total = storyCount * cardW;
  const x = useTransform(scrollYProgress, [0, 1], [0, -(total - 600)]);
  const bg = index % 2 === 0 ? 'bg-white' : 'bg-muted/30';

  return (
    <section ref={ref} className={`relative ${bg}`} style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 grid md:grid-cols-[minmax(0,380px)_1fr] gap-10 md:gap-14 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">{section.eyebrow}</p>
            <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-[1.05] whitespace-pre-line mb-6">{section.title}</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">{section.body}</p>
            <SectionLogos section={section} />
          </div>
          <div className="relative overflow-hidden">
            <motion.div style={{ x }} className="flex gap-5 will-change-transform">
              {section.stories.map((s, i) => (
                <StoryCard key={s.partner + i} story={s} />
              ))}
            </motion.div>
            {/* Left-edge fade, masks clipped content on left */}
            <div className={`pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r ${index % 2 === 0 ? 'from-white' : 'from-[#f4f4f2]'} to-transparent`} />
            {/* Right-edge fade, indicates more cards available */}
            <div className={`pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l ${index % 2 === 0 ? 'from-white' : 'from-[#f4f4f2]'} to-transparent`} />
            <div className="absolute top-2 right-0 flex gap-1.5">
              {section.stories.map((_, i) => (
                <ProgressDot key={i} scrollYProgress={scrollYProgress} i={i} count={storyCount} />
              ))}
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
      <Seo title={PAGE_SEO['/partners']?.title} description={PAGE_SEO['/partners']?.description} canonical="/partners" />
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Partners</p>
            <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Building the future<br /><em>together</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              We're proud to partner with education-driven organizations that share our mission of making economics education accessible and world-class.
            </p>
          </motion.div>
        </div>
      </section>

      {contributionSections.map((section, i) => (
        <ContributionSection key={section.id} section={section} index={i} />
      ))}

      {/* Current Partners grid */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Current Partners</p>
            <h2 className="font-sans text-3xl text-foreground">Our partner network</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNERS.map((p, i) => (
              <motion.div key={p.name} {...fadeUp(i * 0.06)}>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 p-8 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center gap-1">
                    {p.logo ? (
                      p.logoCrop ? (
                        <div style={{ height: 40, width: 100, overflow: 'hidden', position: 'relative' }} className="flex items-center justify-center">
                          <img src={p.logo} alt={p.name}
                            style={{ height: 40 * (p.logoScale || 1.5), width: 'auto', position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', ...(p.logoFilter ? { filter: p.logoFilter } : {}) }}
                            className="grayscale group-hover:grayscale-0 transition-all duration-300"  loading="lazy" decoding="async" />
                        </div>
                      ) : (
                        <img src={p.logo} alt={p.name} style={{ height: p.logoScale ? 40 * p.logoScale : 40, ...(p.logoFilter ? { filter: p.logoFilter } : {}) }} className="w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"  loading="lazy" decoding="async" />
                      )
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">{p.shortName || p.name.split(' ').map(w => w[0]).join('').slice(0, 3)}</span>
                    )}
                    {p.wordmark && (
                      <span style={{ fontFamily: p.wordmark.fontFamily, fontWeight: p.wordmark.fontWeight, fontSize: p.wordmark.fontSize, whiteSpace: p.wordmark.wrap ? 'pre-line' : 'nowrap', lineHeight: 1.2 }} className="text-sm text-center text-foreground/70 group-hover:text-foreground">
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

      {/* Become a Partner, header only, tier cards intentionally removed. */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Become a Partner</p>
            <h2 className="font-sans text-4xl text-foreground mb-8">Partner with USAEO</h2>
            <a
              href="mailto:partnerships@usaeo.org?subject=Partnership%20inquiry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" /> Contact us
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

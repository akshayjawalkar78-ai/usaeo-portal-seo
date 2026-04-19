import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText, ExternalLink, ChevronDown, ChevronUp, User } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const papers = [
  {
    title: 'The Effects of Federal Reserve Quantitative Easing on Equity Market Volatility',
    author: 'Maya Chen', school: 'Stuyvesant High School', year: '2025',
    abstract: 'This paper examines the causal relationship between Federal Reserve asset purchase programs (QE1–QE4) and the CBOE Volatility Index (VIX), employing event-study methodology and difference-in-differences estimation. We find significant negative effects on short-run volatility during announcement windows, with diminishing returns across successive rounds.',
    tags: ['Monetary Policy', 'Financial Markets', 'Econometrics'], pages: 22,
  },
  {
    title: 'Minimum Wage and Employment: A Meta-Analysis of Recent US Studies',
    author: 'James Park', school: 'Thomas Jefferson High School', year: '2025',
    abstract: 'We conduct a systematic meta-analysis of 47 empirical studies on minimum wage effects in the United States published between 2010 and 2024. Correcting for publication bias via funnel asymmetry tests, our central estimate suggests a small but statistically significant employment elasticity of -0.11 for low-wage workers.',
    tags: ['Labor Economics', 'Policy Analysis', 'Meta-Analysis'], pages: 28,
  },
  {
    title: 'Carbon Pricing Mechanisms and Innovation: Evidence from European ETS',
    author: 'Sofia Rodriguez', school: 'Lowell High School', year: '2024',
    abstract: 'Using patent application data from the European Patent Office and firm-level panel data from EU ETS participating firms (2005–2022), we estimate the causal effect of carbon price exposure on green innovation. We find a 12% increase in clean technology patents per €10/tonne increase in carbon prices.',
    tags: ['Environmental Economics', 'Innovation', 'Climate Policy'], pages: 31,
  },
  {
    title: 'Algorithmic Pricing and Market Competition in Online Retail',
    author: 'Daniel Kim', school: 'Phillips Academy', year: '2024',
    abstract: 'This paper investigates whether the widespread adoption of algorithmic pricing software among online retailers facilitates tacit collusion. Using scraped price data from 200+ product categories over 18 months, we document systematic co-movement in prices consistent with algorithmic coordination.',
    tags: ['Industrial Organization', 'Digital Markets', 'Competition'], pages: 19,
  },
  {
    title: 'Remittances and Household Consumption Smoothing in Rural Mexico',
    author: 'Ana Lima', school: 'Basis Scottsdale', year: '2024',
    abstract: 'We use ENIGH household survey data matched with migration patterns to estimate how remittance receipts affect consumption smoothing in rural Mexican households. IV estimates using bilateral migration networks as instruments suggest remittances reduce consumption volatility by 18-24% for recipient households.',
    tags: ['Development Economics', 'Migration', 'Household Finance'], pages: 25,
  },
];

const topics = [
  { area: 'Monetary Economics', desc: 'Central banking, inflation, interest rate policy', count: 12 },
  { area: 'Labor Economics', desc: 'Employment, wages, inequality', count: 9 },
  { area: 'Environmental Economics', desc: 'Climate policy, carbon markets, sustainability', count: 8 },
  { area: 'Development Economics', desc: 'Poverty, migration, aid effectiveness', count: 11 },
  { area: 'Industrial Organization', desc: 'Market structure, competition, digital markets', count: 7 },
  { area: 'Behavioral Economics', desc: 'Decision-making, nudges, cognitive biases', count: 6 },
];

export default function Research() {
  const [expanded, setExpanded] = useState(null);

  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Research Program</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Original research,<br /><em>real mentorship</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Conduct original economics research under the guidance of professional economists and academics. Published work appears in the USAEO Research Journal — a peer-reviewed publication read by university admissions offices nationwide.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[['45+', 'Papers published'], ['30+', 'Faculty mentors'], ['15+', 'Research areas']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-serif text-primary">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <h2 className="font-serif text-4xl text-foreground leading-tight mb-8">How the program works</h2>
            <div className="space-y-6">
              {[
                { n: '1', title: 'Apply & Get Matched', desc: 'Submit your research interests and a brief statement of purpose. We review applications on a rolling basis and match you with a professional economist mentor whose expertise aligns with your area of focus.', time: '~2 weeks' },
                { n: '2', title: 'Develop Your Research', desc: 'Work one-on-one with your mentor over 3–4 months to develop a rigorous, original research paper. Regular check-ins, feedback sessions, and structured milestones keep your project on track.', time: '3–4 months' },
                { n: '3', title: 'Peer Review Process', desc: 'Your completed paper is submitted to our editorial board of student and faculty reviewers. You\'ll receive detailed, constructive feedback and an opportunity for revision.', time: '4–6 weeks' },
                { n: '4', title: 'Publication', desc: 'Accepted papers are published in the USAEO Research Journal — a formal academic publication with an ISSN that you can cite on college applications and your academic CV.', time: 'Rolling' },
              ].map((s, i) => (
                <div key={s.n} className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 mt-0.5">{s.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-2">{s.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="mailto:info@usaeo.org" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Apply to Research Program <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="space-y-4">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80" alt="Research" className="w-full rounded-2xl object-cover h-56 border border-border" />
            <div className="space-y-4">
              {[
                { title: 'Mentorship', desc: 'Direct 1:1 with professional economists' },
                { title: 'Published', desc: 'Real academic publication with ISSN' },
                { title: 'Network', desc: 'Join a community of student researchers' },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">{b.title}</div>
                    <div className="text-sm text-muted-foreground">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Topics */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Research Areas</p>
            <h2 className="font-serif text-3xl text-foreground">Active research topics</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t, i) => (
              <motion.div key={t.area} {...fadeUp(i * 0.07)} className="bg-white border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{t.area}</h3>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <span className="text-xs text-primary bg-orange-50 border border-orange-200 px-2 py-1 rounded-full flex-shrink-0">{t.count} papers</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Published Papers */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">USAEO Research Journal</p>
            <h2 className="font-serif text-3xl text-foreground">Featured published papers</h2>
          </motion.div>
          <div className="space-y-4">
            {papers.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(i * 0.07)} className="bg-white border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
                <button className="w-full text-left p-6 md:p-8" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-xs text-muted-foreground">{p.year}</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-base md:text-lg leading-snug mb-2">{p.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span>{p.author}</span>
                        <span>·</span>
                        <span>{p.school}</span>
                        <span>·</span>
                        <span>{p.pages} pages</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-muted-foreground mt-1">
                      {expanded === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 border-t border-border pt-5">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.abstract}</p>
                        <a href="mailto:info@usaeo.org" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                          Request full paper <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)} className="mt-8 text-center">
            <a href="mailto:info@usaeo.org" className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
              <FileText className="w-4 h-4" /> View full journal archive
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

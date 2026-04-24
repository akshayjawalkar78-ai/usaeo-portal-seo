import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const papers = [
  {
    title: 'Economics Olympiad Research',
    visibility: 'private',
    description: 'Internal research used to build the question-difficulty benchmark for the USAEO competition and support academia partnership teams.',
  },
];

const topics = [
  { area: 'Monetary Economics', desc: 'Central banking, inflation, interest rate policy' },
  { area: 'Labor Economics', desc: 'Employment, wages, inequality' },
  { area: 'Environmental Economics', desc: 'Climate policy, carbon markets, sustainability' },
  { area: 'Development Economics', desc: 'Poverty, migration, aid effectiveness' },
  { area: 'Industrial Organization', desc: 'Market structure, competition, digital markets' },
  { area: 'Behavioral Economics', desc: 'Decision-making, nudges, cognitive biases' },
];

export default function Research() {
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
              {[['Open', 'Applications'], ['30+', 'Faculty mentors'], [`${topics.length}+`, 'Research areas']].map(([v, l]) => (
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
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">How it works</p>
              <h2 className="font-serif text-4xl text-foreground leading-tight">From application<br /><em>to publication</em></h2>
            </div>
            <div className="flex items-start gap-3">
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80" alt="Research" className="w-full rounded-2xl object-cover h-52 border border-border" />
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden mb-10">
            {[
              { n: '01', title: 'Apply & Get Matched', desc: 'Submit your research interests and a brief statement of purpose. We review applications on a rolling basis and match you with a professional economist mentor whose expertise aligns with your area of focus.', time: '~2 weeks' },
              { n: '02', title: 'Develop Your Research', desc: 'Work one-on-one with your mentor over 3–4 months to develop a rigorous, original research paper. Regular check-ins, feedback sessions, and structured milestones keep your project on track.', time: '3–4 months' },
              { n: '03', title: 'Peer Review Process', desc: 'Your completed paper is submitted to our editorial board of student and faculty reviewers. You\'ll receive detailed, constructive feedback and an opportunity for revision before final acceptance.', time: '4–6 weeks' },
              { n: '04', title: 'Publication', desc: 'Accepted papers are published in the USAEO Research Journal — a formal academic publication with an ISSN that you can cite on college applications and your academic CV.', time: 'Rolling' },
            ].map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.08)} className="bg-white p-8 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="font-serif text-5xl text-orange-200 leading-none">{s.n}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full flex-shrink-0 mt-1">{s.time}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.2)}>
            <a href="mailto:info@usaeo.org" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Apply to Research Program <ArrowRight className="w-4 h-4" />
            </a>
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
                <h3 className="font-semibold text-foreground text-sm mb-1">{t.area}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
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
            {papers.map((p) => (
              <motion.div key={p.title} {...fadeUp()} className="bg-white border border-border rounded-2xl p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
                    <Lock className="w-3 h-3" /> Private · Internal
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-base md:text-lg leading-snug mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

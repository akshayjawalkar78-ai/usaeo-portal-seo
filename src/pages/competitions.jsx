import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const phases = [
  {
    n: '01', status: 'upcoming', badge: 'Feb 28, 2026 · Virtual',
    title: 'National Qualifiers',
    desc: 'A two-hour virtual exam with multiple-choice and short-answer questions. Students choose their session: 11 AM ET or 6 PM ET. Top scorers advance to the National Finals.',
    details: ['2-hour virtual exam', 'Multiple choice + short answer', 'Two session options', 'Top scorers advance'],
    cta: { label: 'Register Free', href: 'https://usaeo.org/register' },
  },
  {
    n: '02', status: 'future', badge: 'May 2026 · In-Person',
    title: 'National Finals',
    desc: 'An intensive in-person competition featuring a comprehensive written examination and real-world case study analysis. Top students form the USA national team.',
    details: ['In-person format', 'Written exam + case study', 'National team selection', 'Top students qualify for IEO'],
    cta: { label: 'Learn More', href: 'https://usaeo.org/register' },
  },
  {
    n: '03', status: 'future', badge: 'Summer 2026 · Global',
    title: 'International Economics Olympiad',
    desc: 'The national team represents the USA at the IEO, competing against the world\'s top young economists from 50+ countries on a global stage.',
    details: ['Represent the USA', '50+ countries compete', 'International recognition', 'Networking with global peers'],
    cta: { label: 'About the IEO', to: '/competitions/ieo' },
  },
];

export default function Competitions() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Competitions</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              From qualifiers<br /><em>to the world stage</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Three stages. One mission: find and develop America's next generation of economic thinkers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto space-y-6">
          {phases.map((phase, i) => (
            <motion.div key={phase.n} {...fadeUp(i * 0.1)} className="border border-border rounded-2xl overflow-hidden bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200">
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <span className="font-serif text-7xl text-orange-100 leading-none flex-shrink-0">{phase.n}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${phase.status === 'upcoming' ? 'bg-orange-50 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>
                        {phase.badge}
                      </span>
                      {phase.status === 'upcoming' && (
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Next Up
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-3xl text-foreground mb-3">{phase.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{phase.desc}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {phase.details.map((d) => (
                        <div key={d} className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">{d}</div>
                      ))}
                    </div>
                    {phase.cta.href ? (
                      <a href={phase.cta.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                        {phase.cta.label} <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link to={phase.cta.to} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                        {phase.cta.label} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-5 bg-foreground text-center">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl text-white mb-5">Ready to start your journey?</h2>
          <p className="text-white/70 mb-8">Registration is completely free for all high school students.</p>
          <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Register Now <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </PageLayout>
  );
}

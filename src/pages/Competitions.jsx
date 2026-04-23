import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const phases = [
  {
    n: '01', status: 'closed', badge: 'Feb 28, 2026 · Virtual',
    title: 'National Qualifiers',
    desc: 'A two-hour virtual exam with multiple-choice and short-answer questions. Registration is now closed. Top scorers have advanced to the next stage.',
    cta: null,
  },
  {
    n: '02', status: 'open', badge: 'Coming Soon · Virtual',
    title: 'Quiz Bowl',
    desc: 'Fast-paced timed quiz covering microeconomics, macroeconomics, and current events. Open to all registered students — register now to secure your spot.',
    cta: { label: 'Register for Quiz Bowl', to: '/register/quiz-bowl' },
  },
  {
    n: '03', status: 'open', badge: 'Coming Soon · Virtual',
    title: 'Essay Competition',
    desc: 'Submit a research essay on an economics topic of your choice. Judged on economic reasoning, quality of evidence, and clarity of argument. Open to all registered students.',
    cta: { label: 'Register for Essay', to: '/register/essay' },
  },
  {
    n: '04', status: 'future', badge: 'May 2026 · In-Person',
    title: 'National Finals',
    desc: 'An intensive in-person competition featuring a comprehensive written examination and real-world case study analysis. Invitation only — top scorers from qualifier rounds are selected.',
    cta: { label: 'Learn More', to: '/competitions/finals' },
  },
];

const statusStyle = {
  closed: { badge: 'bg-red-50 text-red-700 border-red-200', label: 'Closed' },
  open:   { badge: 'bg-green-50 text-green-700 border-green-200', label: 'Open' },
  future: { badge: 'bg-muted text-muted-foreground border-border', label: 'By Selection' },
};

export default function Competitions() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Competitions</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              From qualifiers<br /><em>to the national stage</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Four stages. One mission: find and develop America's next generation of economic thinkers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto space-y-6">
          {phases.map((phase, i) => (
            <motion.div key={phase.n} {...fadeUp(i * 0.1)} className={`border rounded-2xl overflow-hidden bg-white transition-all duration-200 ${phase.status === 'closed' ? 'border-border opacity-75' : phase.status === 'open' ? 'border-green-200 hover:shadow-md' : 'border-border hover:border-primary/30 hover:shadow-md'}`}>
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <span className="font-serif text-7xl text-orange-300 leading-none flex-shrink-0">{phase.n}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                        {phase.badge}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${statusStyle[phase.status].badge}`}>
                        {phase.status === 'closed' && <Lock className="w-3 h-3" />}
                        {statusStyle[phase.status].label}
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl text-foreground mb-3">{phase.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{phase.desc}</p>
                    {phase.cta && (
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

      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl text-foreground mb-5">Ready to compete?</h2>
          <p className="text-muted-foreground mb-8">Quiz Bowl and Essay Competition are now open. Registration is completely free.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register/quiz-bowl"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Register for Quiz Bowl <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register/essay"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
              Register for Essay
            </Link>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
}

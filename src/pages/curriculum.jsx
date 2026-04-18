import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const units = [
  { n: '01', title: 'Supply, Demand & Markets', topics: ['Law of supply & demand', 'Market equilibrium', 'Price elasticity', 'Market failures'], hrs: '4–6 hrs' },
  { n: '02', title: 'Consumer & Producer Theory', topics: ['Utility maximization', 'Budget constraints', 'Production functions', 'Cost curves'], hrs: '5–7 hrs' },
  { n: '03', title: 'Market Structures', topics: ['Perfect competition', 'Monopoly & oligopoly', 'Game theory basics', 'Pricing strategies'], hrs: '6–8 hrs' },
  { n: '04', title: 'Macroeconomic Foundations', topics: ['GDP & national accounts', 'Unemployment', 'Inflation', 'Business cycles'], hrs: '5–7 hrs' },
  { n: '05', title: 'Monetary & Fiscal Policy', topics: ['Central banking', 'Money supply', 'Fiscal multipliers', 'Stabilization policy'], hrs: '5–7 hrs' },
  { n: '06', title: 'International Trade & Finance', topics: ['Comparative advantage', 'Trade policy', 'Exchange rates', 'Balance of payments'], hrs: '5–7 hrs' },
];

export default function Curriculum() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Curriculum</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Free economics<br /><em>education for all</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              6 comprehensive units covering everything from introductory micro to international finance — designed specifically to prepare you for the USAEO competition.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="https://usaeo.org/curriculum" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Start Learning <ArrowRight className="w-4 h-4" />
              </a>
              <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
                Register to Compete
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-16">
            {[['100%', 'Free'], ['6', 'Units'], ['30+', 'Hours'], ['Self-paced', 'Learn anywhere'], ['Competition-aligned', 'USAEO syllabus'], ['Beginner-friendly', 'No prior knowledge']].map(([v, l], i) => (
              <motion.div key={l} {...fadeUp(i * 0.06)} className="text-center p-4 bg-muted/30 rounded-xl border border-border">
                <div className="font-serif text-2xl text-primary mb-1">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeUp()} className="mb-10">
            <h2 className="font-serif text-3xl text-foreground">Course units</h2>
          </motion.div>

          <div className="space-y-4">
            {units.map((unit, i) => (
              <motion.div key={unit.n} {...fadeUp(i * 0.07)} className="border border-border rounded-2xl bg-white overflow-hidden hover:border-primary/30 transition-colors">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-5 flex-1">
                      <span className="font-serif text-4xl text-orange-100 leading-none flex-shrink-0">{unit.n}</span>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{unit.title}</h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{unit.hrs}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {unit.topics.map((t) => (
                            <span key={t} className="text-xs text-muted-foreground bg-muted/50 border border-border px-2.5 py-1 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <a href="https://usaeo.org/curriculum" target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      <BookOpen className="w-4 h-4" /> Start Unit
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

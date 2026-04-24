import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const units = [
  {
    n: '01', title: 'Supply, Demand & Markets', hrs: '4–6 hrs',
    desc: 'The foundation of economic analysis. Learn how prices are determined through the interaction of buyers and sellers, why markets sometimes fail, and how elasticity measures responsiveness to price changes.',
    topics: ['Law of supply & demand', 'Market equilibrium', 'Price elasticity', 'Market failures'],
  },
  {
    n: '02', title: 'Consumer & Producer Theory', hrs: '5–7 hrs',
    desc: 'Explore the mathematical foundations of microeconomics. Understand how consumers maximize utility under budget constraints and how firms choose production levels to minimize cost.',
    topics: ['Utility maximization', 'Budget constraints', 'Production functions', 'Cost curves'],
  },
  {
    n: '03', title: 'Market Structures', hrs: '6–8 hrs',
    desc: 'From perfect competition to monopoly, this unit examines how market power shapes pricing and output decisions. Game theory fundamentals are introduced through oligopoly models.',
    topics: ['Perfect competition', 'Monopoly & oligopoly', 'Game theory basics', 'Pricing strategies'],
  },
  {
    n: '04', title: 'Macroeconomic Foundations', hrs: '5–7 hrs',
    desc: 'Shift from individual markets to the entire economy. Learn to measure economic output, understand the causes of unemployment and inflation, and analyze the business cycle.',
    topics: ['GDP & national accounts', 'Unemployment', 'Inflation', 'Business cycles'],
  },
  {
    n: '05', title: 'Monetary & Fiscal Policy', hrs: '5–7 hrs',
    desc: 'Examine the tools governments and central banks use to stabilize the economy. Understand how interest rates, money supply, and government spending affect output and inflation.',
    topics: ['Central banking', 'Money supply', 'Fiscal multipliers', 'Stabilization policy'],
  },
  {
    n: '06', title: 'International Trade & Finance', hrs: '5–7 hrs',
    desc: 'The final unit covers the global economy. From comparative advantage to exchange rate dynamics, this unit prepares you for the international economics questions at the National Qualifiers and Finals.',
    topics: ['Comparative advantage', 'Trade policy', 'Exchange rates', 'Balance of payments'],
  },
];

function CurriculumUnit({ unit, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...fadeUp(index * 0.05)} className="border border-border rounded-2xl bg-white overflow-hidden hover:border-primary/30 transition-colors">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full bg-orange-50/70 border-b border-border px-8 py-6 flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-5">
          <span className="font-serif text-5xl text-orange-200 leading-none flex-shrink-0">{unit.n}</span>
          <div>
            <h3 className="font-semibold text-foreground text-xl">{unit.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground">{unit.hrs}</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-wider">
                Releasing soon
              </span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-8 py-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{unit.desc}</p>
              <div className="grid grid-cols-2 gap-x-10 gap-y-2 mb-5">
                {unit.topics.map((t) => (
                  <div key={t} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />{t}
                  </div>
                ))}
              </div>
              <button disabled aria-disabled="true"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-muted text-muted-foreground rounded-full text-xs font-semibold cursor-not-allowed">
                Releasing soon
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
            <div className="inline-flex items-center gap-2 mt-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Releasing soon
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <button disabled aria-disabled="true"
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-full font-medium text-sm cursor-not-allowed">
                Start Learning <ArrowRight className="w-4 h-4" />
              </button>
              <a href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
                Register to Compete
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="flex flex-wrap gap-10 mb-16 pb-16 border-b border-border">
            {[['100%', 'Free to access'], ['6', 'Units'], ['30+', 'Hours of content'], ['0', 'Prerequisites']].map(([v, l]) => (
              <div key={l}>
                <div className="font-serif text-3xl text-primary mb-1">{v}</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp()} className="mb-10">
            <h2 className="font-serif text-3xl text-foreground">Course units</h2>
          </motion.div>

          <div className="space-y-4">
            {units.map((unit, i) => (
              <CurriculumUnit key={unit.n} unit={unit} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

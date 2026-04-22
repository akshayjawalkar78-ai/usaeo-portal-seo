import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const criteria = [
  { title: 'Economic Reasoning', desc: 'Clear application of economic theory and models to the chosen topic. Demonstrates understanding of core concepts and their real-world implications.' },
  { title: 'Evidence & Analysis', desc: 'Use of empirical data, research, and case studies to support arguments. Quality of sources and rigor of analysis.' },
  { title: 'Clarity & Structure', desc: 'Well-organized argument with a clear thesis, logical progression, and strong conclusion. Writing is precise and accessible.' },
];

export default function Essay() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 03 — Competition</p>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
                Essay Competition
              </h1>
              <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">Open</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Submit a research essay on an economics topic of your choice. Judged on economic reasoning, evidence quality, and clarity of argument. Open to all registered USAEO students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Event Details</p>
            <div className="divide-y divide-border mb-10">
              {[
                { label: 'Deadline', value: 'Coming Soon' },
                { label: 'Format', value: 'Written essay submission' },
                { label: 'Length', value: 'TBD' },
                { label: 'Topic', value: 'Any economics topic of your choice' },
                { label: 'Eligibility', value: 'All registered USAEO students' },
                { label: 'Cost', value: 'Free' },
              ].map((row) => (
                <div key={row.label} className="flex gap-8 py-4">
                  <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Judging Criteria</p>
            <div className="space-y-5">
              {criteria.map((c, i) => (
                <motion.div key={c.title} {...fadeUp(i * 0.08)} className="border-l-2 border-primary/20 pl-5 py-1">
                  <p className="font-semibold text-sm text-foreground mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-700" />
                <span className="font-semibold text-green-800">Registration is open</span>
              </div>
              <p className="text-sm text-green-700 leading-relaxed mb-5">
                Register now to enter the USAEO Essay Competition. The submission deadline will be announced by email.
              </p>
              <Link to="/register/essay"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Register Now — Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-3">Tips for success</h3>
              <div className="space-y-3">
                {[
                  'Choose a specific, arguable economics topic',
                  'Ground your argument in economic theory from the USAEO curriculum',
                  'Use real-world data and research to support claims',
                  'Structure: introduction, analysis, evidence, conclusion',
                  'Proofread for clarity and precision',
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />{tip}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl text-foreground mb-5">Ready to write?</h2>
          <p className="text-muted-foreground mb-8">Registration is free and takes under two minutes.</p>
          <Link to="/register/essay"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
            Register for Essay Competition <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
}

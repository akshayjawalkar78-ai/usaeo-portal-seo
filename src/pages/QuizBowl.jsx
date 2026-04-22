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

const topics = [
  'Microeconomics fundamentals', 'Macroeconomic theory', 'Market structures',
  'Game theory basics', 'International trade', 'Monetary & fiscal policy',
  'Behavioral economics', 'Data interpretation', 'Current events',
];

export default function QuizBowl() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 02 — Competition</p>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
                Quiz Bowl
              </h1>
              <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">Open</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Fast-paced timed quiz covering microeconomics, macroeconomics, and current events. Open to all registered USAEO students — completely free.
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
                { label: 'Date', value: 'Coming Soon' },
                { label: 'Format', value: 'Virtual — timed online quiz' },
                { label: 'Eligibility', value: 'All registered USAEO students' },
                { label: 'Duration', value: 'TBD' },
                { label: 'Cost', value: 'Free' },
                { label: 'Registration', value: 'Open now' },
              ].map((row) => (
                <div key={row.label} className="flex gap-8 py-4">
                  <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Topics Covered</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {topics.map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{t}
                </div>
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
                Register now to secure your spot in the USAEO Quiz Bowl. The event date will be announced by email.
              </p>
              <Link to="/register/quiz-bowl"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Register Now — Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-3">How to prepare</h3>
              <div className="space-y-3">
                {[
                  'Complete the free USAEO curriculum (6 units)',
                  'Attend live workshops — recordings available',
                  'Practice with past USAEO exam questions',
                  'Review economic news and current events',
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
          <h2 className="font-serif text-4xl text-foreground mb-5">Ready to compete?</h2>
          <p className="text-muted-foreground mb-8">Registration is free and takes under two minutes.</p>
          <Link to="/register/quiz-bowl"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
            Register for Quiz Bowl <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
}

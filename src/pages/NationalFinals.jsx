import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

export default function NationalFinals() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-5 border-b border-border bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 02 — Competition</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
              National Finals
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-3">
              The second stage of the USAEO competition. An intensive in-person event bringing together the nation's top high school economists to compete for a place on Team USA.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Invitation only — qualified students are notified by email following the National Qualifiers.
            </p>
            <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-full font-medium text-sm hover:bg-foreground/85 transition-colors">
              Register for Qualifiers to advance <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Event Details</p>
            <div className="divide-y divide-border">
              {[
                { label: 'Date', value: 'May 2026 (exact date TBA)' },
                { label: 'Format', value: 'In-person — location TBA' },
                { label: 'Eligibility', value: 'Invitation only (top Qualifiers scorers)' },
                { label: 'Sections', value: 'Written exam + case study analysis' },
                { label: 'Duration', value: 'Full day event' },
                { label: 'Cost', value: 'Free for qualified students' },
                { label: 'Outcome', value: 'Top students selected for Team USA (IEO)' },
              ].map((row) => (
                <div key={row.label} className="flex gap-8 py-4">
                  <span className="text-sm text-muted-foreground w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Structure</p>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Written Examination', body: 'A comprehensive exam covering the full USAEO syllabus at advanced depth. Tests application and analysis rather than memorization — students are expected to reason through complex economic scenarios.' },
                  { step: '02', title: 'Case Study Analysis', body: 'Students are presented with a real-world economic policy challenge and must produce a structured written analysis within a time limit. Evaluated on economic reasoning, use of evidence, and policy recommendations.' },
                  { step: '03', title: 'Team USA Selection', body: 'Combined scores from both sections determine the National Finals ranking. The highest-ranked students are invited to represent the United States at the International Economics Olympiad.' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-5">
                    <span className="font-serif text-3xl text-orange-100 leading-none flex-shrink-0 w-8 text-center">{s.step}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">{s.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preparation */}
      <section className="py-20 px-5 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">How to Prepare</p>
              <h2 className="font-serif text-4xl text-foreground leading-tight mb-6">
                What separates finalists<br /><em>from qualifiers</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The National Finals demands a deeper command of economic reasoning than the Qualifiers. Top performers demonstrate the ability to apply theory to novel scenarios, synthesize evidence, and communicate policy analysis clearly under pressure.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                USAEO provides a dedicated Finals preparation workshop series in April and May, covering advanced topics and case study methodology. All recordings are available to qualified students.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Advanced syllabus mastery', desc: 'Go beyond textbook definitions. Practice applying concepts to real economic data, policy debates, and historical case studies.' },
                { title: 'Case study practice', desc: 'Practice structured economic writing. Use the USAEO practice materials and past IEO case study prompts to develop your analytical voice.' },
                { title: 'Workshop attendance', desc: 'The April and May workshop series is specifically designed for Finals prep. Past participants report these sessions as the single most valuable preparation resource.' },
                { title: 'Past exam review', desc: 'Review released practice exams available through the student portal after registration. Focus on the applied question formats.' },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-primary/20 pl-5 py-1">
                  <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 bg-foreground">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-white mb-4">The path to Finals starts at Qualifiers</h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Register for the National Qualifiers on February 28. Top scorers advance automatically — and registration is completely free.
          </p>
          <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Register for Qualifiers <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </PageLayout>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

export default function NationalQualifiers() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 01 â€” Competition</p>
            <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight mb-6">
              National Qualifiers
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              The first stage of the USAEO competition. A two-hour virtual exam open to all US high school students â€” the entry point to the national stage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About + Image */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">About the Qualifiers</p>
            <h2 className="font-sans text-4xl text-foreground leading-tight mb-6">
              A virtual exam<br /><em>open to all</em>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The National Qualifiers is a two-hour virtual exam open to any US high school student â€” no prior economics experience required. Students choose between an 11:00 AM or 6:00 PM ET session on February 28, 2026.</p>
              <p>Top-scoring students across both sessions receive an invitation to the in-person National Finals. All participants receive a detailed score report and access to complete answer explanations after the exam.</p>
              <p>The exam draws on the full USAEO curriculum, covering microeconomics, macroeconomics, international trade, and data analysis. Students who complete our free curriculum are fully prepared to compete.</p>
            </div>
            <div className="mt-8">
              <a href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Register â€” Free <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80" alt="Student taking virtual exam" className="w-full rounded-2xl object-cover h-80 border border-border" />
          </motion.div>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <h2 className="font-sans text-4xl text-foreground">Exam at a glance</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 'Feb 28', label: 'Exam date' },
              { value: '2 hrs', label: 'Duration' },
              { value: '2', label: 'Session options' },
              { value: 'Free', label: 'No registration fee' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="bg-white border border-border rounded-2xl p-6 text-center">
                <div className="font-sans text-4xl text-primary mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam details + Topics */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Exam Details</p>
            <div className="divide-y divide-border">
              {[
                { label: 'Date', value: 'February 28, 2026' },
                { label: 'Format', value: 'Virtual â€” taken from home' },
                { label: 'Duration', value: '2 hours' },
                { label: 'Session options', value: '11:00 AM ET or 6:00 PM ET' },
                { label: 'Question types', value: 'Multiple choice and short answer' },
                { label: 'Topics', value: 'Micro, macro, international trade, data analysis' },
                { label: 'Cost', value: 'Free for all students' },
                { label: 'Who can participate', value: 'Any US high school student' },
              ].map((row) => (
                <div key={row.label} className="flex gap-8 py-4">
                  <span className="text-sm text-muted-foreground w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Topics Covered</p>
            <div className="grid grid-cols-1 gap-px bg-border rounded-2xl overflow-hidden">
              {[
                { title: 'Microeconomics', items: ['Supply and demand', 'Elasticity and consumer theory', 'Market structures and competition', 'Externalities and public goods', 'Game theory basics'] },
                { title: 'Macroeconomics', items: ['National income accounting (GDP)', 'Unemployment and inflation', 'Aggregate demand and supply', 'Business cycle analysis', 'Monetary and fiscal policy'] },
                { title: 'International Economics', items: ['Comparative and absolute advantage', 'Trade policy and protectionism', 'Exchange rate determination', 'Balance of payments'] },
                { title: 'Data & Quantitative Analysis', items: ['Reading economic data tables', 'Graph interpretation', 'Index numbers and price levels', 'Applied problem solving'] },
              ].map((section) => (
                <div key={section.title} className="bg-white p-6">
                  <h3 className="font-semibold text-foreground text-sm mb-3">{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-sans text-4xl text-foreground mb-5">Register before February 28</h2>
          <p className="text-muted-foreground mb-8">
            The National Qualifiers is completely free. No economics background required â€” our curriculum provides everything you need to compete.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Register Now â€” Free <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://usaeo.org/curriculum" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
              Study with Free Curriculum
            </a>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
}

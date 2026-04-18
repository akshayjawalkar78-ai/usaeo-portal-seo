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

export default function NationalQualifiers() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-5 border-b border-border bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 01 — Competition</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
              National Qualifiers
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              The first stage of the USAEO competition. A two-hour virtual exam open to all US high school students — the entry point to the national stage.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-full font-medium text-sm hover:bg-foreground/85 transition-colors">
                Register — Free <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key details */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Exam Details</p>
            <div className="divide-y divide-border">
              {[
                { label: 'Date', value: 'February 28, 2026' },
                { label: 'Format', value: 'Virtual — taken from home' },
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

          <motion.div {...fadeUp(0.1)} className="space-y-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">How it works</p>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Register', body: 'Create a free account at usaeo.org. Registration is open to all US high school students regardless of grade, school type, or prior economics experience.' },
                  { step: '02', title: 'Choose your session', body: 'Select the 11:00 AM or 6:00 PM ET session when you register. Both sessions cover identical material and are graded on the same scale.' },
                  { step: '03', title: 'Prepare', body: 'Use the USAEO free curriculum — 6 units covering the full exam syllabus. Practice exams and workshops are also available to registered students.' },
                  { step: '04', title: 'Take the exam', body: 'Log in on February 28 through the testing portal. The exam is proctored online and consists of multiple-choice and short-answer questions.' },
                  { step: '05', title: 'Advance', body: 'Top-scoring students receive an invitation to the National Finals. All participants receive a detailed score report.' },
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

      {/* Topics */}
      <section className="py-20 px-5 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Topics Covered</p>
            <h2 className="font-serif text-4xl text-foreground max-w-xl leading-tight">
              What's on the exam
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden">
            {[
              { title: 'Microeconomics', items: ['Supply and demand', 'Elasticity and consumer theory', 'Market structures and competition', 'Externalities and public goods', 'Game theory basics'] },
              { title: 'Macroeconomics', items: ['National income accounting (GDP)', 'Unemployment and inflation', 'Aggregate demand and supply', 'Business cycle analysis', 'Monetary and fiscal policy'] },
              { title: 'International Economics', items: ['Comparative and absolute advantage', 'Trade policy and protectionism', 'Exchange rate determination', 'Balance of payments', 'International financial markets'] },
              { title: 'Data & Quantitative Analysis', items: ['Reading economic data tables', 'Graph interpretation', 'Index numbers and price levels', 'Basic econometric reasoning', 'Applied problem solving'] },
            ].map((section, i) => (
              <motion.div key={section.title} {...fadeUp(i * 0.08)} className="bg-white p-8">
                <h3 className="font-semibold text-foreground text-base mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 bg-foreground">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-white mb-4">Register before February 28</h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            The National Qualifiers is completely free. No economics background required — our curriculum provides everything you need to compete.
          </p>
          <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Register Now — Free <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </PageLayout>
  );
}

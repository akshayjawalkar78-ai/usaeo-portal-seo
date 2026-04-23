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

export default function NationalFinals() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 02 — Competition</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
              National Finals
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              The second stage of the USAEO competition. An intensive in-person event bringing together the nation's top high school economists to compete for a place on Team USA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About + Image */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">About the Finals</p>
            <h2 className="font-serif text-4xl text-foreground leading-tight mb-6">
              The national stage<br /><em>for America's best</em>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The National Finals is an invitation-only in-person event held at a US university campus in May 2026. Qualified students — top scorers from the Quiz Bowl and Essay rounds — are notified by email and invited to attend at no cost.</p>
              <p>The Finals combines a comprehensive written examination with a structured case study analysis. Top performers across both sections are named National Champions of the USA Economics Olympiad.</p>
              <p>USAEO provides a dedicated Finals preparation workshop series in April and May, covering advanced topics and case study methodology. All recordings are available to qualified students through the student portal.</p>
            </div>
            <div className="mt-8">
              <a href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Register for Qualifiers to advance <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" alt="In-person competition" className="w-full rounded-2xl object-cover h-80 border border-border" />
          </motion.div>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <h2 className="font-serif text-4xl text-foreground">Finals at a glance</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 'May', label: 'Event month, 2026' },
              { value: 'In-Person', label: 'University campus' },
              { value: '2', label: 'Competition sections' },
              { value: 'Free', label: 'For qualified students' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="bg-white border border-border rounded-2xl p-6 text-center">
                <div className="font-serif text-4xl text-primary mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure + Preparation */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Event Details</p>
            <div className="divide-y divide-border mb-10">
              {[
                { label: 'Date', value: 'May 2026 (exact date TBA)' },
                { label: 'Format', value: 'In-person — location TBA' },
                { label: 'Eligibility', value: 'Invitation only (top Quiz Bowl & Essay scorers)' },
                { label: 'Sections', value: 'Written exam + case study analysis' },
                { label: 'Duration', value: 'Full day event' },
                { label: 'Cost', value: 'Free for qualified students' },
                { label: 'Outcome', value: 'Top students named National Champions' },
              ].map((row) => (
                <div key={row.label} className="flex gap-8 py-4">
                  <span className="text-sm text-muted-foreground w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Competition Structure</p>
            <div className="space-y-8">
              {[
                { step: '01', title: 'Written Examination', body: 'A comprehensive exam covering the full USAEO syllabus at advanced depth. Tests application and analysis rather than memorization — students are expected to reason through complex economic scenarios.' },
                { step: '02', title: 'Case Study Analysis', body: 'Students are presented with a real-world economic policy challenge and must produce a structured written analysis within a time limit. Evaluated on economic reasoning, use of evidence, and policy recommendations.' },
                { step: '03', title: 'National Champion Selection', body: 'Combined scores from both sections determine the National Finals ranking. The highest-ranked students are named National Champions of the USA Economics Olympiad.' },
              ].map((s) => (
                <div key={s.step} className="flex gap-5">
                  <span className="font-serif text-3xl text-orange-200 leading-none flex-shrink-0 w-8 text-center">{s.step}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-2">{s.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">How to Prepare</p>
            <h2 className="font-serif text-3xl text-foreground leading-tight mb-6">
              What separates finalists<br /><em>from qualifiers</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The National Finals demands a deeper command of economic reasoning than the Qualifiers. Top performers demonstrate the ability to apply theory to novel scenarios, synthesize evidence, and communicate policy analysis clearly under pressure.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Advanced syllabus mastery', desc: 'Go beyond textbook definitions. Practice applying concepts to real economic data, policy debates, and historical case studies.' },
                { title: 'Case study practice', desc: 'Practice structured economic writing. Use the USAEO practice materials and past Finals case study prompts to develop your analytical voice.' },
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
      <section className="py-20 px-5 text-center">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl text-foreground mb-5">Compete now — Quiz Bowl & Essay are open</h2>
          <p className="text-muted-foreground mb-8">
            Register for Quiz Bowl or Essay Competition — both are free and open to all high school students.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register/quiz-bowl"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Register for Quiz Bowl <ArrowRight className="w-4 h-4" />
            </Link>
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

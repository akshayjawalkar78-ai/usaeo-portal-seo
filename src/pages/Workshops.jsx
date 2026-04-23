import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, GraduationCap, FileText, User } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const upcoming = [];

const past = [
  { title: 'Introduction to Microeconomics', date: 'Mar 14, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Supply & demand, elasticity, market equilibrium' },
  { title: 'Macroeconomics Fundamentals', date: 'Mar 18, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'GDP, inflation, unemployment, fiscal & monetary policy' },
  { title: 'Game Theory & Strategic Thinking', date: 'Mar 21, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Nash equilibria, prisoner\'s dilemma, dominant strategies' },
  { title: 'Market Structures Deep Dive', date: 'Mar 25, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Perfect competition, monopoly, oligopoly, pricing power' },
  { title: 'Behavioral Economics', date: 'Mar 28, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Cognitive biases, nudges, prospect theory' },
  { title: 'International Trade & Finance', date: 'Apr 1, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Comparative advantage, trade policy, exchange rates' },
  { title: 'Data Analysis & Interpretation', date: 'Apr 5, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Economic data, graphs, regression basics, policy analysis' },
  { title: 'Economic Policy & Current Events', date: 'Apr 11, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Central banking, fiscal policy, global economic trends' },
  { title: 'Competition Prep: Essay & Quiz Bowl', date: 'Apr 15, 2026', time: '4 PM ET', instructor: 'USAEO Academic Committee', role: 'Academic Team', topic: 'Exam strategy, essay writing, practice problems' },
];

export default function Workshops() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Workshops</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Expert-led sessions,<br /><em>completely free</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Live workshops covering macroeconomics, game theory, data analysis, and competition prep — all on Zoom, all free for registered students.
            </p>
            <div className="flex flex-wrap gap-10 mt-10">
              {[['9', 'Sessions hosted'], ['Free', 'For all registered students'], ['Live Q&A', 'Every session'], ['Recording', 'Available after']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-serif text-primary">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Upcoming Sessions</p>
            <h2 className="font-serif text-3xl text-foreground">Register for a free workshop</h2>
          </motion.div>
          {upcoming.length === 0 ? (
            <motion.div {...fadeUp(0.1)} className="bg-white border border-border rounded-2xl p-12 text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-foreground mb-2">No upcoming sessions scheduled</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">New workshops will be announced via email. Register for an event to receive notifications when new sessions are scheduled.</p>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {upcoming.map((w, i) => (
                <motion.div key={w.title} {...fadeUp(i * 0.08)} className="grid md:grid-cols-5 border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors bg-white">
                  <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{w.date} · {w.time}</span>
                      </div>
                      <h3 className="font-serif text-2xl text-foreground mb-3">{w.title}</h3>
                      <p className="text-xs text-muted-foreground mb-4"><span className="font-medium text-foreground">Instructor:</span> {w.instructor}</p>
                    </div>
                    <a href="/register" className="self-start inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                      Register Free <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Sessions */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Past Sessions</p>
            <h2 className="font-serif text-3xl text-foreground">Previous workshops</h2>
          </motion.div>
          <div className="space-y-3">
            {past.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(i * 0.05)} className="flex items-start justify-between bg-white border border-border rounded-xl px-6 py-4 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{w.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 flex-shrink-0" />{w.instructor}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 italic">{w.topic}</div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{w.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover / Why attend */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <h2 className="font-serif text-3xl text-foreground mb-8">What we cover</h2>
            <div className="space-y-3">
              {['Microeconomics', 'Macroeconomics', 'International Trade', 'Game Theory', 'Data Analysis', 'Competition Prep', 'Behavioral Economics', 'Economic Policy'].map((topic) => (
                <div key={topic} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{topic}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <h2 className="font-serif text-3xl text-foreground mb-8">Why attend?</h2>
            <div className="space-y-6">
              {[
                { icon: BookOpen, title: 'Competition-aligned content', desc: 'Every session is specifically designed to build skills tested in USAEO competitions.' },
                { icon: GraduationCap, title: 'Expert instructors', desc: 'Led by professional economists, PhD students, and academic researchers.' },
                { icon: FileText, title: 'Practice materials', desc: 'All attendees receive problem sets, slide decks, and additional reading recommendations.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

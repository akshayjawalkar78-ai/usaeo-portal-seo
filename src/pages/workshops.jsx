import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Users, ChevronDown, ChevronUp, Video, BookOpen } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const upcoming = [
  {
    date: 'Apr 19, 2026', time: '4 PM ET', title: 'Game Theory Deep-Dive',
    desc: 'Nash equilibria, strategic interaction, and how game theory applies to real-world economics.',
    fullDesc: `In this session, we will cover the fundamentals of non-cooperative game theory and its applications to real economic scenarios. Topics include: normal-form and extensive-form games, pure and mixed strategy Nash equilibria, dominant strategies, the prisoner's dilemma, repeated games, and signaling games. We'll work through applied examples from oligopoly pricing, auctions, and international trade negotiations. Competition-relevant problem sets will be distributed to all attendees.`,
    tag: 'Theory', instructor: 'Dr. Sarah Williams, Princeton Economics', attendees: 94, duration: '2 hrs',
    topics: ['Nash Equilibria', 'Prisoner\'s Dilemma', 'Signaling Games', 'Auction Theory', 'Repeated Games'],
  },
  {
    date: 'May 3, 2026', time: '4 PM ET', title: 'Competition Prep: National Finals',
    desc: 'Full-length practice exam walkthrough with detailed explanations and scoring breakdown.',
    fullDesc: `A rigorous 2-hour prep session structured identically to the National Finals format. We'll work through a complete practice exam covering micro, macro, and international economics, followed by an in-depth answer review session. Special focus on case study methodology, how to structure written responses under time pressure, and common mistakes made by finalists. Students who attended the Qualifiers session scored 22% higher on Finals problems on average.`,
    tag: 'Exam Prep', instructor: 'USAEO Academic Committee', attendees: 132, duration: '3 hrs',
    topics: ['Full Practice Exam', 'Case Study Methods', 'Written Response Strategy', 'Time Management', 'Score Optimization'],
  },
  {
    date: 'May 17, 2026', time: '4 PM ET', title: 'International Trade & Finance',
    desc: 'Comparative advantage, trade policy, exchange rates, and balance of payments — IEO-level depth.',
    fullDesc: `This advanced session covers the international economics section of the IEO syllabus in depth. We'll derive Ricardian comparative advantage, explore the Heckscher-Ohlin model, analyze trade policy instruments (tariffs, quotas, subsidies), and examine exchange rate determination under both fixed and flexible regimes. Students will work through IEO-style quantitative problems and multi-part essay prompts. Prerequisite: basic micro and macro knowledge.`,
    tag: 'International', instructor: 'Prof. Marcus Jones, Georgetown MSFS', attendees: 78, duration: '2 hrs',
    topics: ['Comparative Advantage', 'Heckscher-Ohlin', 'Trade Policy', 'Exchange Rates', 'BOP Accounting'],
  },
];

const past = [
  { title: 'Macroeconomics Crash Course', date: 'Mar 22, 2026', tag: 'Macro', attendees: 187, rating: '4.9' },
  { title: 'Data Analysis & Interpretation', date: 'Apr 5, 2026', tag: 'Data Skills', attendees: 143, rating: '4.8' },
  { title: 'Microeconomics Foundations', date: 'Mar 8, 2026', tag: 'Micro', attendees: 165, rating: '4.9' },
  { title: 'Supply, Demand & Markets', date: 'Feb 8, 2026', tag: 'Foundations', attendees: 201, rating: '4.7' },
  { title: 'Behavioral Economics', date: 'Jan 25, 2026', tag: 'Behavioral', attendees: 119, rating: '4.8' },
  { title: 'Monetary Policy & Central Banking', date: 'Jan 11, 2026', tag: 'Macro', attendees: 156, rating: '4.9' },
];

export default function Workshops() {
  const [expanded, setExpanded] = useState(null);

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
              Live workshops every month covering macroeconomics, game theory, data analysis, and competition prep — all on Zoom, all free for registered students. Led by economists from Princeton, Georgetown, and beyond.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[['1,200+', 'Total attendees'], ['4.85', 'Average rating'], ['20+', 'Sessions hosted'], ['Free', 'For all registered students']].map(([v, l]) => (
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
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Upcoming Sessions</p>
            <h2 className="font-serif text-3xl text-foreground">Click to see full details & topics</h2>
          </motion.div>
          <div className="space-y-4">
            {upcoming.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(i * 0.08)} className="bg-white border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
                <button className="w-full text-left p-6 md:p-8" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0 bg-orange-50 border border-orange-100 rounded-xl px-5 py-3 text-center min-w-[120px]">
                      <div className="text-xs font-semibold text-primary">{w.date.split(',')[0]}</div>
                      <div className="text-lg font-serif text-foreground">{w.date.split(' ')[1].replace(',', '')}</div>
                      <div className="text-xs text-muted-foreground">{w.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{w.tag}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{w.attendees} registered</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{w.title}</h3>
                      <p className="text-sm text-muted-foreground">{w.desc}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-3">
                      <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
                        Register <ArrowRight className="w-3 h-3" />
                      </a>
                      <div className="text-muted-foreground">
                        {expanded === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-8 border-t border-border pt-6 grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">About this session</p>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{w.fullDesc}</p>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Video className="w-4 h-4 text-primary" />
                            <span className="font-medium">Instructor:</span>
                            <span className="text-muted-foreground">{w.instructor}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Topics covered</p>
                          <div className="space-y-2">
                            {w.topics.map((t) => (
                              <div key={t} className="flex items-center gap-2.5 text-sm text-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                {t}
                              </div>
                            ))}
                          </div>
                          <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <p className="text-xs font-semibold text-primary mb-1">What to bring</p>
                            <p className="text-xs text-muted-foreground">A calculator, scratch paper, and willingness to participate. Practice problems will be sent 48 hours before the session.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Sessions */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Past Sessions</p>
            <h2 className="font-serif text-3xl text-foreground">Previous workshops</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {past.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(i * 0.07)} className="flex items-center justify-between bg-white border border-border rounded-xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full flex-shrink-0">{w.tag}</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{w.title}</div>
                    <div className="text-xs text-muted-foreground">{w.attendees} attended · ⭐ {w.rating}</div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">{w.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <h2 className="font-serif text-3xl text-foreground mb-6">What we cover</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { topic: 'Microeconomics', icon: '📊' }, { topic: 'Macroeconomics', icon: '🏛️' },
                { topic: 'International Trade', icon: '🌍' }, { topic: 'Game Theory', icon: '♟️' },
                { topic: 'Data Analysis', icon: '📈' }, { topic: 'Competition Prep', icon: '🏆' },
                { topic: 'Behavioral Econ', icon: '🧠' }, { topic: 'Economic Policy', icon: '⚖️' },
              ].map((t) => (
                <div key={t.topic} className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4 py-3">
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-sm font-medium text-foreground">{t.topic}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <h2 className="font-serif text-3xl text-foreground mb-6">Why attend?</h2>
            <div className="space-y-4">
              {[
                { emoji: '📚', title: 'Competition-aligned content', desc: 'Every session is specifically designed to build skills tested in USAEO and IEO competitions.' },
                { emoji: '🎓', title: 'Expert instructors', desc: 'Led by professional economists, PhD students, and former Olympiad competitors from top universities.' },
                { emoji: '🤝', title: 'Interactive format', desc: 'Live Q&A, problem-solving breakouts, and real-time polls keep sessions engaging and effective.' },
                { emoji: '📝', title: 'Practice materials', desc: 'All attendees receive problem sets, slide decks, and additional reading recommendations.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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

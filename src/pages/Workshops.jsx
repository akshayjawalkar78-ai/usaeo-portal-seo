import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Star, BookOpen, GraduationCap, FileText } from 'lucide-react';
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
    desc: 'In this session, we cover the fundamentals of non-cooperative game theory and its applications to real economic scenarios. Topics include normal-form and extensive-form games, pure and mixed strategy Nash equilibria, dominant strategies, the prisoner\'s dilemma, repeated games, and signaling games. We\'ll work through applied examples from oligopoly pricing, auctions, and international trade negotiations.',
    instructor: 'Dr. Sarah Williams, Princeton Economics', attendees: 94, duration: '2 hrs',
    topics: ['Nash Equilibria', 'Prisoner\'s Dilemma', 'Signaling Games', 'Auction Theory', 'Repeated Games'],
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  {
    date: 'May 3, 2026', time: '4 PM ET', title: 'Competition Prep: National Finals',
    desc: 'A rigorous 2-hour prep session structured identically to the National Finals format. We\'ll work through a complete practice exam covering micro, macro, and international economics, followed by an in-depth answer review session. Special focus on case study methodology, how to structure written responses under time pressure, and common mistakes made by finalists.',
    instructor: 'USAEO Academic Committee', attendees: 132, duration: '3 hrs',
    topics: ['Full Practice Exam', 'Case Study Methods', 'Written Response Strategy', 'Time Management', 'Score Optimization'],
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  },
  {
    date: 'May 17, 2026', time: '4 PM ET', title: 'International Trade & Finance',
    desc: 'This advanced session covers the international economics section of the IEO syllabus in depth. We\'ll derive Ricardian comparative advantage, explore the Heckscher-Ohlin model, analyze trade policy instruments, and examine exchange rate determination under both fixed and flexible regimes. Students will work through IEO-style quantitative problems and multi-part essay prompts.',
    instructor: 'Prof. Marcus Jones, Georgetown MSFS', attendees: 78, duration: '2 hrs',
    topics: ['Comparative Advantage', 'Heckscher-Ohlin', 'Trade Policy', 'Exchange Rates', 'BOP Accounting'],
    img: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=800&q=80',
  },
];

const past = [
  { title: 'Macroeconomics Crash Course', date: 'Mar 22, 2026', attendees: 187, rating: '4.9' },
  { title: 'Data Analysis & Interpretation', date: 'Apr 5, 2026', attendees: 143, rating: '4.8' },
  { title: 'Microeconomics Foundations', date: 'Mar 8, 2026', attendees: 165, rating: '4.9' },
  { title: 'Supply, Demand & Markets', date: 'Feb 8, 2026', attendees: 201, rating: '4.7' },
  { title: 'Behavioral Economics', date: 'Jan 25, 2026', attendees: 119, rating: '4.8' },
  { title: 'Monetary Policy & Central Banking', date: 'Jan 11, 2026', attendees: 156, rating: '4.9' },
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
              Live workshops every month covering macroeconomics, game theory, data analysis, and competition prep — all on Zoom, all free for registered students. Led by economists from Princeton, Georgetown, and beyond.
            </p>
            <div className="flex flex-wrap gap-10 mt-10">
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
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Upcoming Sessions</p>
            <h2 className="font-serif text-3xl text-foreground">Register for a free workshop</h2>
          </motion.div>
          <div className="space-y-10">
            {upcoming.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(i * 0.08)} className="grid md:grid-cols-5 border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors bg-white">
                {/* Left: image with date overlay */}
                <div className="md:col-span-2 relative min-h-[240px]">
                  <img src={w.img} alt={w.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-white font-semibold text-lg leading-tight">{w.date}</p>
                    <p className="text-white/70 text-sm mt-0.5">{w.time}</p>
                  </div>
                </div>
                {/* Right: details */}
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{w.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{w.attendees} registered</span>
                    </div>
                    <h3 className="font-serif text-2xl text-foreground mb-4">{w.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{w.desc}</p>
                    <div className="mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Topics covered</p>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                        {w.topics.map((t) => (
                          <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />{t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-6">
                      <span className="font-medium text-foreground">Instructor:</span> {w.instructor}
                    </p>
                  </div>
                  <a href="https://usaeo.org/register" target="_blank" rel="noopener noreferrer"
                    className="self-start inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Register Free <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
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
                <div>
                  <div className="text-sm font-medium text-foreground">{w.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">{w.attendees} attended · <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {w.rating}</div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">{w.date}</span>
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
                { icon: BookOpen, title: 'Competition-aligned content', desc: 'Every session is specifically designed to build skills tested in USAEO and IEO competitions.' },
                { icon: GraduationCap, title: 'Expert instructors', desc: 'Led by professional economists, PhD students, and former Olympiad competitors from top universities.' },
                { icon: Users, title: 'Interactive format', desc: 'Live Q&A, problem-solving breakouts, and real-time polls keep sessions engaging and effective.' },
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

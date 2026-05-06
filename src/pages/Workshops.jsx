import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, GraduationCap, FileText, User, ExternalLink } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { UPCOMING_PARTNER_WORKSHOPS, PAST_PARTNER_WORKSHOPS } from '@/lib/partnerEventsSeed';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

const upcoming = [];

const past = [
  { title: 'Economics Careers & the PhD Journey', date: 'Mar 14, 2026', time: '6 PM ET', instructor: 'Atta Gyasi-Domson', role: 'PhD Student in Economics, Emory University', topic: 'Economic careers, academic pathways, PhD experience' },
  { title: 'The Labor Market', date: 'Mar 15, 2026', time: '6 PM ET', instructor: 'Noah Yosif', role: 'Chief Economist, American Staffing Association', topic: 'Labor market trends, employment dynamics, workforce economics' },
  { title: 'Public Policy & Academic Careers', date: 'Mar 21, 2026', time: '6 PM ET', instructor: 'Lauren Spits', role: 'Public Policy Researcher', topic: 'Academic career pathways, public policy, economics in government' },
  { title: 'Game Theory & Applied Economics', date: 'Mar 27, 2026', time: '7 PM ET', instructor: 'Juan Sagredo', role: 'PhD (Operations Research & Financial Engineering), Princeton University', topic: 'Game theory, mechanism design, information economics' },
  { title: 'Game Theory in Strategy', date: 'Mar 28, 2026', time: '5 PM ET', instructor: 'William Putsis', role: 'Professor of Marketing, Economics & Business Strategy, Yale SOM / UNC Kenan-Flagler', topic: 'Game theory, competitive strategy, strategic thinking' },
  { title: 'Economics Workshop', date: 'Apr 4, 2026', time: '9 PM ET', instructor: 'Yi David Wang', role: 'Affiliate Professor, Virginia Tech; Senior Financial Sector Expert, IMF', topic: '' },
  { title: 'Finance & Economics Research', date: 'Apr 5, 2026', time: '10 AM ET', instructor: 'Gilles Chemla', role: 'Professor of Finance, Imperial College Business School; Research Fellow, CEPR', topic: '' },
  { title: 'Economics Workshop', date: 'Apr 11, 2026', time: '7 PM ET', instructor: 'Mohamed Ashour', role: 'Special Appointee, International Monetary Fund', topic: '' },
  { title: 'Economics Workshop', date: 'Apr 15, 2026', time: '6 PM ET', instructor: 'Joe Tracy', role: 'Distinguished Fellow, Purdue Daniels School of Business; Former EVP, Federal Reserve Bank of Dallas', topic: '' },
];

export default function Workshops() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Workshops</p>
            <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Expert-led sessions,<br /><em>completely free</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Live workshops covering macroeconomics, game theory, data analysis, and competition prep, all on Zoom, all free for registered students.
            </p>
            <div className="flex flex-wrap gap-10 mt-10">
              {[['9', 'Sessions hosted'], ['$0', 'Cost to attend'], ['9', 'Expert instructors'], ['60+', 'Min of content each']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-sans text-primary">{v}</div>
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
            <h2 className="font-sans text-3xl text-foreground">Register for a free workshop</h2>
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
                      <h3 className="font-sans text-2xl text-foreground mb-3">{w.title}</h3>
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
            <h2 className="font-sans text-3xl text-foreground">Previous workshops</h2>
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

      {/* Partner Workshops — Upcoming */}
      {UPCOMING_PARTNER_WORKSHOPS.length > 0 && (
        <section className="py-20 px-5 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Partner Sessions</p>
              <h2 className="font-sans text-3xl text-foreground">Upcoming partner workshops</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">Free sessions hosted by our partner organizations, open to all students.</p>
            </motion.div>
            <div className="space-y-6">
              {UPCOMING_PARTNER_WORKSHOPS.map((w, i) => (
                <motion.div key={w.id} {...fadeUp(i * 0.08)} className="grid md:grid-cols-5 border border-green-200 rounded-2xl overflow-hidden hover:shadow-md transition-colors bg-white">
                  <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        {w.partnerLogo && (
                          <img src={w.partnerLogo} alt={w.partnerShort} className="h-8 w-auto max-w-[40px] object-contain opacity-80" />
                        )}
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{w.partner}</span>
                        {w.free && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success/10 text-success border border-green-200">Free</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{w.date} · {w.time}</span>
                      </div>
                      <h3 className="font-sans text-2xl text-foreground mb-3">{w.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2"><span className="font-medium text-foreground">Speaker:</span> {w.instructor}</p>
                      {w.role && <p className="text-xs text-muted-foreground mb-2">{w.role}</p>}
                      {w.desc && <p className="text-sm text-muted-foreground leading-relaxed mb-2">{w.desc}</p>}
                      {w.openTo && <p className="text-xs text-muted-foreground italic">Open to: {w.openTo}</p>}
                    </div>
                    <a href={w.zoomUrl || w.partnerUrl} target="_blank" rel="noopener noreferrer"
                      className="self-start mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                      {w.zoomUrl ? 'Register on Zoom' : 'Learn More'} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="md:col-span-2 bg-muted/30 p-8 md:p-10 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-border">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">What to expect</p>
                    {(w.topic || '').split(', ').filter(Boolean).map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        {t}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partner Workshops — Past */}
      {PAST_PARTNER_WORKSHOPS.length > 0 && (
        <section className="py-20 px-5 border-t border-border bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Partner Sessions · Past</p>
              <h2 className="font-sans text-3xl text-foreground">Previous partner workshops</h2>
            </motion.div>
            <div className="space-y-3">
              {PAST_PARTNER_WORKSHOPS.map((w, i) => (
                <motion.div key={w.id} {...fadeUp(i * 0.05)} className="flex items-start justify-between bg-white border border-border rounded-xl px-6 py-4 gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {w.partnerLogo && (
                      <img src={w.partnerLogo} alt={w.partnerShort} className="h-7 w-auto max-w-[32px] object-contain flex-shrink-0 mt-0.5 opacity-70" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{w.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3 flex-shrink-0" />{w.instructor} · {w.partner}
                      </div>
                      {w.topic && <div className="text-xs text-muted-foreground mt-0.5 italic">{w.topic}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{w.date}</span>
                    <a href={w.partnerUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      Visit {w.partnerShort} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What we cover / Why attend */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <h2 className="font-sans text-3xl text-foreground mb-8">What we cover</h2>
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
            <h2 className="font-sans text-3xl text-foreground mb-8">Why attend?</h2>
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

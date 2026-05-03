import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Trophy, Users, Monitor, Zap, Shield, BookOpen } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

const categories = [
  { title: 'Microeconomics', desc: 'Market structures, consumer behavior, supply & demand, price theory' },
  { title: 'Macroeconomics', desc: 'GDP, inflation, unemployment, fiscal & monetary policy' },
  { title: 'International Economics', desc: 'Trade policy, exchange rates, balance of payments, globalization' },
  { title: 'Economic History', desc: 'Historical economic events, policy developments, economic thought' },
  { title: 'Current Economic Events', desc: 'Recent policy developments and global data releases' },
];

const software = [
  { name: 'Kahoot', role: 'Regular question delivery', icon: Monitor, desc: 'Questions displayed on the host screen; participants answer on their devices.' },
  { name: 'Multibuzzer', role: 'Toss-up questions', icon: Zap, desc: 'Online buzzer platform â€” first team to buzz in earns the right to answer.' },
  { name: 'Google Meet', role: 'Live competition sessions', icon: BookOpen, desc: 'All matches run live via Google Meet, limited to 60 minutes per session.' },
];

export default function QuizBowl() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 02 â€” Competition</p>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight">
                Quiz Bowl
              </h1>
              <span className="text-xs font-semibold bg-success/10 text-success border border-green-200 px-3 py-1 rounded-full">Open</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Fast-paced live team competition covering microeconomics, macroeconomics, and current events. Teams of 3â€“5 compete in round-robin matches leading to a single-elimination playoff.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Event Details</p>
            <div className="divide-y divide-border mb-10">
              {[
                { label: 'Date', value: 'Coming Soon' },
                { label: 'Format', value: 'Virtual â€” live Google Meet + Kahoot / Multibuzzer' },
                { label: 'Team Size', value: '3â€“5 players per team (captain required)' },
                { label: 'Duration', value: '60 minutes per match' },
                { label: 'Eligibility', value: 'All registered USAEO students (grades 9â€“12)' },
                { label: 'Cost', value: 'Free' },
                { label: 'Registration', value: 'Open now' },
              ].map((row) => (
                <div key={row.label} className="flex gap-8 py-4">
                  <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div className="bg-success/10 border border-green-200 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-semibold text-green-800">Registration is open</span>
              </div>
              <p className="text-sm text-success leading-relaxed mb-5">
                Register now to secure your spot in the USAEO Quiz Bowl. The event date will be announced by email.
              </p>
              <Link to="/register/quiz-bowl"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Register Now â€” Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-3">How to prepare</h3>
              <div className="space-y-3">
                {[
                  'Complete the free USAEO curriculum (6 units)',
                  'Attend live workshops â€” recordings available',
                  'Practice with past USAEO exam questions',
                  'Review economic news and current events',
                  'Form your team early and select a captain',
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

      {/* Tournament Structure */}
      <section className="py-20 px-5 border-t border-border bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Tournament Structure</p>
            <h2 className="font-sans text-4xl text-foreground">How the competition works</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Team Composition */}
            <motion.div {...fadeUp(0.05)}>
              <div className="bg-white border border-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Team Composition</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Players', value: '3â€“5 per team (minimum 3 to compete)' },
                    { label: 'Alternates', value: 'Up to 2 â€” substitutions between rounds only' },
                    { label: 'Captain', value: 'Required â€” must be selected before start' },
                    { label: 'Minimum teams', value: '16 teams required for the event to run' },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-6">
                      <span className="text-sm text-muted-foreground w-32 flex-shrink-0">{row.label}</span>
                      <span className="text-sm text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tournament Phases */}
            <motion.div {...fadeUp(0.1)}>
              <div className="space-y-4">
                {[
                  {
                    phase: '01',
                    title: 'Round-Robin Preliminaries',
                    desc: 'Teams are split into groups of 4 and play 3â€“5 matches each. Top finishers from each bracket earn guaranteed playoff spots; remaining spots are filled by wildcards based on cumulative scores.',
                  },
                  {
                    phase: '02',
                    title: 'Single-Elimination Playoffs',
                    desc: 'The top 8 or 16 teams (depending on registration size) advance to a single-elimination bracket. One loss and you\'re out.',
                  },
                  {
                    phase: '03',
                    title: 'Championship Round',
                    desc: 'The final two teams compete in a best-of-three series to determine the Quiz Bowl champion.',
                  },
                ].map((step) => (
                  <div key={step.phase} className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{step.phase}</span>
                    </div>
                    <div className="pt-1.5">
                      <p className="font-semibold text-foreground text-sm mb-1">{step.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Match Format & Scoring */}
      <section className="py-20 px-5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Gameplay</p>
            <h2 className="font-sans text-4xl text-foreground">Match format & scoring</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Match Overview */}
            <motion.div {...fadeUp(0.05)} className="bg-white border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-5">Each Match</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">20</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Regular Questions (Kahoot)</p>
                    <p className="text-sm text-muted-foreground">Displayed on host screen; all participants answer simultaneously.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">5</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Toss-Up Questions (Multibuzzer)</p>
                    <p className="text-sm text-muted-foreground">Read aloud by the moderator. First to buzz in must answer alone â€” no consulting teammates.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scoring */}
            <motion.div {...fadeUp(0.1)} className="bg-white border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-5">Scoring Rules</h3>
              <div className="space-y-3">
                {[
                  { rule: 'Correct toss-up answer', points: '+1,000 pts' },
                  { rule: 'Correct bonus answer', points: '+1,000 pts' },
                  { rule: 'Incorrect answer', points: 'Point reduction' },
                  { rule: 'Tie-break', points: 'Sudden-death toss-up' },
                ].map((item) => (
                  <div key={item.rule} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{item.rule}</span>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{item.points}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bonus Questions */}
          <motion.div {...fadeUp(0.12)} className="bg-white border border-border rounded-2xl p-8">
            <h3 className="font-semibold text-foreground mb-4">Bonus Questions</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              A correct toss-up answer unlocks a bonus question for that team. During bonus questions, team members may confer before the captain delivers the final answer â€” no buzzing required. Incorrect answers incur a point reduction. Scores are tracked and displayed in real time throughout the match.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Question Categories */}
      <section className="py-20 px-5 border-t border-border bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Curriculum</p>
            <h2 className="font-sans text-4xl text-foreground">Question categories</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div key={cat.title} {...fadeUp(i * 0.06)}
                className="bg-white border border-border rounded-2xl p-6">
                <p className="font-semibold text-foreground mb-2">{cat.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Software & Technology */}
      <section className="py-20 px-5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Technology</p>
            <h2 className="font-sans text-4xl text-foreground">Approved software</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {software.map((s, i) => (
              <motion.div key={s.name} {...fadeUp(i * 0.07)}
                className="bg-white border border-border rounded-2xl p-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground mb-1">{s.name}</p>
                <p className="text-xs text-primary font-medium uppercase tracking-wider mb-3">{s.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-5 border-t border-border bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Prizes</p>
            <h2 className="font-sans text-4xl text-foreground">Awards & recognition</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { place: '1st Place', prize: '$100', icon: 'ðŸ¥‡' },
              { place: '2nd Place', prize: '$75', icon: 'ðŸ¥ˆ' },
              { place: '3rd Place', prize: '$50', icon: 'ðŸ¥‰' },
            ].map((award, i) => (
              <motion.div key={award.place} {...fadeUp(i * 0.07)}
                className="bg-white border border-border rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">{award.icon}</div>
                <p className="font-semibold text-foreground mb-1">{award.place}</p>
                <p className="text-3xl font-sans text-primary">{award.prize}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} className="bg-white border border-border rounded-2xl p-8 flex items-start gap-5">
              <Trophy className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">National Finals Qualification</p>
                <p className="text-sm text-muted-foreground">The top 10 competitors advance to the USAEO National Finals round.</p>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.14)} className="bg-white border border-border rounded-2xl p-8 flex items-start gap-5">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Certificates of Participation</p>
                <p className="text-sm text-muted-foreground">All participants receive an official certificate of participation.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Academic Integrity */}
      <section className="py-20 px-5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Conduct</p>
            <h2 className="font-sans text-4xl text-foreground">Academic integrity</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp(0.05)}>
              <div className="flex items-center gap-3 mb-5">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Prohibited Actions</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  'Accessing external materials (websites, notes, textbooks, calculators) during active questions',
                  'Receiving assistance from coaches, parents, or spectators',
                  'Any communication with individuals outside the competing team during toss-ups',
                  'Recording or sharing competition questions with teams that have not yet competed',
                  'Manipulating the buzzer system or muting cameras without permission',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />{item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.1)}>
              <h3 className="font-semibold text-foreground mb-5">Consequences</h3>
              <div className="space-y-4">
                {[
                  { tier: 'Minor Violation', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', desc: 'Formal warning, incident documented, point deduction of 500â€“1,000 pts or removal from current round.' },
                  { tier: 'Clear Cheating', color: 'text-orange-700 bg-primary/5 border-orange-200', desc: 'Team disqualified from the round, score of zero, placed on probation, possible school notification.' },
                  { tier: 'Severe or Repeated', color: 'text-destructive bg-destructive/10 border-red-200', desc: 'Immediate permanent disqualification, forfeiture of all points, ban from future competitions.' },
                ].map((c) => (
                  <div key={c.tier} className={`border rounded-xl p-4 ${c.color}`}>
                    <p className="font-semibold text-sm mb-1">{c.tier}</p>
                    <p className="text-sm leading-relaxed opacity-90">{c.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Appeals must be submitted by the team captain or coach within 24 hours of the incident. All committee decisions are final unless overturned on appeal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-sans text-4xl text-foreground mb-5">Ready to compete?</h2>
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

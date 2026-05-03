import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Trophy, FileText, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

const promptCategories = [
  { title: 'Microeconomics', desc: 'Market structures, consumer behavior, price theory' },
  { title: 'Macroeconomics', desc: 'GDP, fiscal & monetary policy, inflation, unemployment' },
  { title: 'International Economics', desc: 'Trade policy, exchange rates, globalization' },
  { title: 'Economic Development', desc: 'Growth theory, poverty, inequality' },
  { title: 'Current Economic Issues', desc: 'Recent policy debates, data trends, global events' },
];

const rubric = [
  { criterion: 'Thesis & Argumentation', weight: 30, desc: 'Clear thesis, logical structure, evidence-based claims' },
  { criterion: 'Economic Analysis', weight: 30, desc: 'Accurate use of economic concepts, models, and data' },
  { criterion: 'Research & Sources', weight: 20, desc: 'Quality and relevance of sources, proper citation' },
  { criterion: 'Writing Quality', weight: 15, desc: 'Grammar, clarity, organization' },
  { criterion: 'Originality', weight: 5, desc: 'Novel insights or perspectives' },
];

export default function Essay() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Stage 03 â€” Competition</p>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight">
                Essay Competition
              </h1>
              <span className="text-xs font-semibold bg-success/10 text-success border border-green-200 px-3 py-1 rounded-full">Open</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Submit a research essay on an economics topic of your choice. Judged on economic reasoning, evidence quality, and clarity of argument. Individual competition open to all registered USAEO students.
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
                { label: 'Deadline', value: 'TBD â€” announced by email' },
                { label: 'Format', value: 'Written essay submission via Google Forms' },
                { label: 'Length', value: '1,500â€“2,000 words (excl. title page & references)' },
                { label: 'Eligibility', value: 'Individual â€” grades 9â€“12' },
                { label: 'Citation Style', value: 'APA, MLA, or Chicago (must be consistent)' },
                { label: 'Cost', value: 'Free' },
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
                Register now to enter the USAEO Essay Competition. The submission deadline will be announced by email.
              </p>
              <Link to="/register/essay"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                Register Now â€” Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-3">Tips for success</h3>
              <div className="space-y-3">
                {[
                  'Choose a specific, arguable economics topic from the prompt categories',
                  'Ground your argument in economic theory and real-world data',
                  'Use quality academic sources and cite them consistently',
                  'Structure clearly: title page, body, references',
                  'Proofread for grammar, clarity, and precision',
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

      {/* Essay Requirements & Specifications */}
      <section className="py-20 px-5 border-t border-border bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Requirements</p>
            <h2 className="font-sans text-4xl text-foreground">Essay specifications</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp(0.05)} className="bg-white border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Formatting</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Word count', value: '1,500â€“2,000 words' },
                  { label: 'Spacing', value: 'Double-spaced' },
                  { label: 'Font', value: '12-point Times New Roman or Arial' },
                  { label: 'Margins', value: '1 inch on all sides' },
                  { label: 'Citation style', value: 'APA, MLA, or Chicago (consistent)' },
                  { label: 'Required sections', value: 'Title page, body, references / works cited' },
                ].map((row) => (
                  <div key={row.label} className="flex gap-6 py-1.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="bg-white border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">File Submission</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Accepted formats</p>
                  <p className="text-sm text-foreground">PDF or Microsoft Word (.docx) â€” maximum 10 MB</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">File naming convention</p>
                  <div className="bg-neutral-50 border border-border rounded-lg px-4 py-3">
                    <code className="text-sm font-mono text-foreground">LastName_FirstName_Essay_2026.pdf</code>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Submission platform</p>
                  <p className="text-sm text-foreground">Official Google Forms portal â€” submissions are time-stamped automatically. Late submissions will not be accepted.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Confirmation</p>
                  <p className="text-sm text-foreground">You will receive an automated confirmation email. If not received within 24 hours, contact the administration committee.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prompt Categories */}
      <section className="py-20 px-5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Topics</p>
            <h2 className="font-sans text-4xl text-foreground">Prompt categories</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Choose one of the following economic themes. Your essay must address the selected theme directly with a clear, arguable thesis.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promptCategories.map((cat, i) => (
              <motion.div key={cat.title} {...fadeUp(i * 0.06)}
                className="bg-white border border-border rounded-2xl p-6">
                <p className="font-semibold text-foreground mb-2">{cat.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="py-20 px-5 border-t border-border bg-neutral-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Judging</p>
            <h2 className="font-sans text-4xl text-foreground">Evaluation criteria</h2>
          </motion.div>

          <div className="space-y-4 max-w-3xl">
            {rubric.map((item, i) => (
              <motion.div key={item.criterion} {...fadeUp(i * 0.07)}
                className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.criterion}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-2xl font-sans text-primary flex-shrink-0">{item.weight}%</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full"
                    style={{ width: `${item.weight * 3.33}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Procedures */}
      <section className="py-20 px-5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Process</p>
            <h2 className="font-sans text-4xl text-foreground">Submission steps</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Write your essay', desc: 'Follow the formatting requirements â€” double-spaced, correct font, 1,500â€“2,000 words.' },
              { step: '02', title: 'Name your file', desc: 'Use the exact format: LastName_FirstName_Essay_2026.pdf (or .docx, max 10 MB).' },
              { step: '03', title: 'Submit via Google Forms', desc: 'Upload through the official portal before the deadline at 11:59 PM EST. No late submissions accepted.' },
              { step: '04', title: 'Receive confirmation', desc: 'An automated email confirms receipt. Contact the committee if you don\'t receive it within 24 hours.' },
            ].map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.07)}
                className="bg-white border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center mb-5">
                  <span className="text-xs font-bold text-primary">{s.step}</span>
                </div>
                <p className="font-semibold text-foreground mb-2">{s.title}</p>
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
                  'Using AI writing tools (ChatGPT, Claude, etc.) to generate essay content',
                  'Copying text from sources without proper citation (plagiarism)',
                  'Submitting work written or substantially edited by another person',
                  'Receiving content suggestions beyond general topic guidance',
                  'Self-plagiarism â€” submitting previously written work',
                  'Submitting after the deadline or exceeding the word limit',
                  'Submitting multiple entries when only one is permitted',
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
                  { tier: 'Minor Violation', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', desc: 'Formal warning, incident documented, minor citation errors corrected with 5â€“10% point deduction.' },
                  { tier: 'Clear Cheating', color: 'text-orange-700 bg-primary/5 border-orange-200', desc: 'Essay disqualified, score of zero, disqualification from rankings and awards, school notification.' },
                  { tier: 'Severe or Repeated', color: 'text-destructive bg-destructive/10 border-red-200', desc: 'Immediate permanent disqualification, forfeiture of all earned points, ban from future competitions.' },
                ].map((c) => (
                  <div key={c.tier} className={`border rounded-xl p-4 ${c.color}`}>
                    <p className="font-semibold text-sm mb-1">{c.tier}</p>
                    <p className="text-sm leading-relaxed opacity-90">{c.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Appeals must be submitted within 24 hours of the disputed incident by the student or their parent/guardian. Final determinations are issued within 48â€“72 hours.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-sans text-4xl text-foreground mb-5">Ready to write?</h2>
          <p className="text-muted-foreground mb-8">Registration is free and takes under two minutes.</p>
          <Link to="/register/essay"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
            Register for Essay Competition <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
}

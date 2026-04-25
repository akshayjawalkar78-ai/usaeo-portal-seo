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

const LOGO = '/logos/USAEOlogo.png';

const members = [
  { name: 'Austin Huynh', role: 'Chief Executive Officer (CEO)', dept: 'Leadership', photo: LOGO },
  { name: 'Avyaktv', role: 'Chief Operating Officer (COO)', dept: 'Operations', photo: LOGO },
  { name: 'Ethan Cai', role: 'Chief Financial Officer (CFO)', dept: 'Finance', photo: LOGO },
  { name: 'Ishaan Menon', role: 'Chief Marketing Officer (CMO)', dept: 'Marketing', photo: LOGO },
  { name: 'Allen Du', role: 'Chief Human Resources Officer (CHRO)', dept: 'People', photo: LOGO },
  { name: 'Nick Chen', role: 'Chief Development Officer (CDO)', dept: 'Development', photo: LOGO },
  { name: 'Aarjit Adhikari', role: 'Chief Information Officer (CIO)', dept: 'Technology', photo: LOGO },
  { name: 'Joseph Augustine', role: 'Chief Academic Officer (CAO)', dept: 'Academics', photo: LOGO },
  { name: 'Radeen', role: 'Chief Research Officer (CRO)', dept: 'Research', photo: LOGO },
];

const roles = [
  { title: 'Content & Curriculum', desc: 'Help build study materials, practice exams, and educational resources for students nationwide.' },
  { title: 'Technology & Design', desc: 'Work on the USAEO platform, website, and digital tools used by hundreds of students.' },
  { title: 'Outreach & Marketing', desc: 'Spread the word about USAEO, manage social media, and grow our community of student economists.' },
  { title: 'Operations & Logistics', desc: 'Help coordinate competitions, workshops, and the day-to-day functioning of the organization.' },
  { title: 'Partnerships & Sponsorships', desc: 'Build relationships with schools, universities, and organizations who share our mission.' },
  { title: 'Mentorship & Advising', desc: 'Serve as a mentor or academic advisor for students, chapters, or the research program.' },
];

function MemberCard({ member, delay = 0 }) {
  return (
    <motion.div {...fadeUp(delay)}
      className="bg-white border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all duration-200">
      <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center p-8">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-foreground text-sm">{member.name}</p>
        <p className="text-xs text-primary mt-0.5">{member.role}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{member.dept}</p>
      </div>
    </motion.div>
  );
}

export default function Team() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Our Team</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Driven by students,<br /><em>for students</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              The USAEO is run by a passionate team of student leaders who believe in the power of economics education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Member Grid */}
      <section className="py-20 px-5 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Leadership</p>
            <h2 className="font-serif text-3xl text-foreground">Meet the team behind USAEO</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((m, i) => (
              <MemberCard key={m.name} member={m} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-5 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Open Roles</p>
            <h2 className="font-serif text-3xl text-foreground">Find your place on the team</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map((r, i) => (
              <motion.div key={r.title} {...fadeUp(i * 0.08)} className="bg-white border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)} className="mt-8 text-center">
            <a href="mailto:info@usaeo.org"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-full font-medium text-sm hover:bg-foreground/85 transition-colors">
              Apply Now <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const roles = [
  { title: 'Content & Curriculum', desc: 'Help build study materials, practice exams, and educational resources for students nationwide.' },
  { title: 'Technology & Design', desc: 'Work on the USAEO platform, website, and digital tools used by hundreds of students.' },
  { title: 'Outreach & Marketing', desc: 'Spread the word about USAEO, manage social media, and grow our community of student economists.' },
  { title: 'Operations & Logistics', desc: 'Help coordinate competitions, workshops, and the day-to-day functioning of the organization.' },
  { title: 'Partnerships & Sponsorships', desc: 'Build relationships with schools, universities, and organizations who share our mission.' },
  { title: 'Mentorship & Advising', desc: 'Serve as a mentor or academic advisor for students, chapters, or the research program.' },
];

// TODO: Replace placeholder data (names, roles, photos) with real team members
const members = [
  { name: 'Alex Chen', role: 'Executive Director', dept: 'Leadership', isExec: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Priya Sharma', role: 'Director of Programs', dept: 'Programs', isExec: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Marcus Williams', role: 'Director of Competitions', dept: 'Competitions', isExec: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Sofia Reyes', role: 'Director of Outreach', dept: 'Marketing', isExec: true, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { name: 'Jordan Kim', role: 'Director of Technology', dept: 'Technology', isExec: true, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80' },
  { name: 'Aisha Patel', role: 'Director of Partnerships', dept: 'Partnerships', isExec: true, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
  { name: 'Tyler Brooks', role: 'Curriculum Lead', dept: 'Content', isExec: false, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { name: 'Emma Liu', role: 'Workshop Coordinator', dept: 'Programs', isExec: false, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
  { name: 'Noah Osei', role: 'Research Program Lead', dept: 'Research', isExec: false, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
  { name: 'Isabella Torres', role: 'Chapter Program Lead', dept: 'Chapters', isExec: false, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80' },
  { name: 'Ethan Park', role: 'Software Engineer', dept: 'Technology', isExec: false, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
  { name: 'Maya Johnson', role: 'Social Media Manager', dept: 'Marketing', isExec: false, photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80' },
  { name: 'Lucas Fernandez', role: 'Graphic Designer', dept: 'Design', isExec: false, photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80' },
  { name: 'Zoe Chang', role: 'Sponsorship Associate', dept: 'Partnerships', isExec: false, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { name: 'Ryan Mitchell', role: 'Competition Coordinator', dept: 'Competitions', isExec: false, photo: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&q=80' },
];

const execs = members.filter((m) => m.isExec);
const generalMembers = members.filter((m) => !m.isExec);

function MemberCard({ member, delay = 0 }) {
  return (
    <motion.div {...fadeUp(delay)}
      className="bg-white border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all duration-200">
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
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
  const [expanded, setExpanded] = useState(false);

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
              The USAEO is run by a passionate team of volunteers — students, educators, and professionals who believe in the power of economics education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <h2 className="font-serif text-4xl text-foreground leading-tight mb-6">Join our mission</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We're building the next generation of economists, and we need passionate people to help. Whether you have 2 hours a week or 20, there's a meaningful role for you.</p>
              <p>Our team members gain real-world experience, build professional networks, and make a direct impact on students across the country.</p>
            </div>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSf2T7EysG4f-95LKPVkZxLnghE5t8GDG_HQrrgXa6pGCUwyKg/viewform"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Apply to Join the Team <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Team" className="w-full rounded-2xl object-cover h-80 border border-border" />
          </motion.div>
        </div>
      </section>

      {/* Team Member Grid */}
      <section className="py-20 px-5 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The Team</p>
            <h2 className="font-serif text-3xl text-foreground">Meet the people behind USAEO</h2>
          </motion.div>

          {/* Executive grid — always visible */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {execs.map((m, i) => (
              <MemberCard key={m.name} member={m} delay={i * 0.06} />
            ))}
          </div>

          {/* Expandable general members */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {generalMembers.map((m, i) => (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <MemberCard member={m} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-medium text-foreground hover:border-primary/40 transition-colors bg-white"
            >
              {expanded ? 'Show fewer' : `View all ${members.length} members`}
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-5">
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
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSf2T7EysG4f-95LKPVkZxLnghE5t8GDG_HQrrgXa6pGCUwyKg/viewform"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-full font-medium text-sm hover:bg-foreground/85 transition-colors">
              Apply Now <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

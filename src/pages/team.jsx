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

const roles = [
  { title: 'Content & Curriculum', desc: 'Help build study materials, practice exams, and educational resources for students nationwide.' },
  { title: 'Technology & Design', desc: 'Work on the USAEO platform, website, and digital tools used by hundreds of students.' },
  { title: 'Outreach & Marketing', desc: 'Spread the word about USAEO, manage social media, and grow our community of student economists.' },
  { title: 'Operations & Logistics', desc: 'Help coordinate competitions, workshops, and the day-to-day functioning of the organization.' },
  { title: 'Partnerships & Sponsorships', desc: 'Build relationships with schools, universities, and organizations who share our mission.' },
  { title: 'Mentorship & Advising', desc: 'Serve as a mentor or academic advisor for students, chapters, or the research program.' },
];

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

      {/* Open Roles */}
      <section className="py-20 px-5 bg-muted/30">
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

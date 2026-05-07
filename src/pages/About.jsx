import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Seo from '@/components/Seo';
import { PAGE_SEO } from '@/lib/seo-config';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

const values = [
  { title: 'Academic Excellence', desc: 'We set the highest standard in economics education, challenging students with rigorous micro and macroeconomic theory, data analysis, and real-world problem solving.' },
  { title: 'Radical Accessibility', desc: 'The USAEO is 100% free. We believe financial barriers should never prevent a talented student from competing at the national level.' },
  { title: 'Community & Leadership', desc: 'We foster a nationwide network of students, chapter founders, mentors, and economists who share a passion for understanding how the world works.' },
  { title: 'Impact-Driven', desc: 'As a 501(c)(3) nonprofit, every dollar we raise goes directly toward student programming, free workshops, curriculum, and competition infrastructure.' },
];

export default function About() {
  return (
    <PageLayout>
      <Seo title={PAGE_SEO['/about']?.title} description={PAGE_SEO['/about']?.description} canonical="/about" />
      {/* Hero */}
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">About USAEO</p>
            <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight mb-6">
              Elevating economics<br /><em>education nationwide</em>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              The USA Economics Olympiad (USAEO) is a 501(c)(3) nonprofit organization dedicated to identifying and developing the nation's top high school economists, completely free, open to every student.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Our Mission</p>
            <h2 className="font-sans text-4xl text-foreground leading-tight mb-6">
              From the classroom<br /><em>to the national stage</em>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              <p>The USAEO identifies and rewards the nation's top high school economists through rigorous competition. We emphasize <strong className="text-foreground">academic excellence</strong> through micro and macroeconomic theory, data interpretation, and real-world problem solving.</p>
              <p>As a registered <strong className="text-foreground">501(c)(3) nonprofit</strong>, our activities include: hosting free national competitions (Quiz Bowl, Essay, National Finals), offering free live workshops taught by university economists, providing a complete open curriculum, supporting student-led chapters in high schools across the country, and running a student research program.</p>
              <p>We foster <strong className="text-foreground">leadership and outreach</strong> through mentorship and connections with economists and institutions, building the pipeline from classroom curiosity to national competition.</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80" alt="Students" className="w-full rounded-2xl object-cover h-80 border border-border"  loading="lazy" decoding="async" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">What we stand for</p>
            <h2 className="font-sans text-4xl text-foreground">Our core values</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(i * 0.08)} className="bg-white border border-border rounded-2xl p-8">
                <h3 className="font-semibold text-lg text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-sans text-4xl text-foreground mb-5">Want to get involved?</h2>
          <p className="text-muted-foreground mb-8">Whether you want to compete, volunteer, sponsor, or start a chapter, there's a place for you in the USAEO community.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register/quiz-bowl"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Register to Compete <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/team"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
              Join Our Team
            </Link>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
}

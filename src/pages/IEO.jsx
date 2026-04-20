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

export default function IEO() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">International</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-3xl">
              International Economics<br /><em>Olympiad</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              The world's premier economics competition for high school students. 50+ countries. One stage. The USA team earns their spot through the USAEO National Finals.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">What is the IEO?</p>
            <h2 className="font-serif text-4xl text-foreground leading-tight mb-6">
              The global stage for<br /><em>young economists</em>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The International Economics Olympiad (IEO) brings together the brightest high school economists from over 50 nations for a multi-day competition testing their knowledge in theory, analytics, and creative problem-solving.</p>
              <p>The USAEO selects the top performers from the National Finals to represent the United States at the IEO, giving them the chance to compete with and learn from peers across the globe.</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" alt="International competition" className="w-full rounded-2xl object-cover h-80 border border-border" />
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <h2 className="font-serif text-4xl text-foreground">By the numbers</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'Countries competing' },
              { value: '3', label: 'Competition rounds' },
              { value: 'Top', label: 'Students represent USA' },
              { value: 'Annual', label: 'Global event' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="bg-white border border-border rounded-2xl p-6 text-center">
                <div className="font-serif text-4xl text-primary mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <h2 className="font-serif text-4xl text-foreground mb-4">How to qualify</h2>
            <p className="text-muted-foreground max-w-xl">The path to the IEO runs through the USAEO.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
            {[
              { step: '1', title: 'Register for USAEO', desc: 'Sign up completely free via the Register page' },
              { step: '2', title: 'Qualify at Nationals', desc: 'Compete in the National Qualifiers and advance to the National Finals' },
              { step: '3', title: 'Represent the USA', desc: 'Top performers at Nationals earn a spot on the IEO team' },
            ].map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.1)} className="bg-white p-8">
                <span className="font-serif text-5xl text-orange-100 block mb-4">{s.step}</span>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-8 text-center">
            <a href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

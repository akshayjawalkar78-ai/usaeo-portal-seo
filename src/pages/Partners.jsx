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

const partners = [
  { name: 'Ultra AI', logo: 'https://www.usaeo.org/imgs/sponsors/UltraAI.png', url: 'https://useultra.ai/', desc: 'AI-powered learning platform' },
  { name: 'Stellar', logo: 'https://www.usaeo.org/imgs/sponsors/Stellar.png', url: 'https://stellarlearning.app/', desc: 'Student learning tools' },
  { name: 'Crackd', logo: 'https://www.usaeo.org/imgs/sponsors/Crackd.png', url: 'https://crackd.it/', desc: 'Exam preparation platform' },
  { name: 'Launchpoint', logo: 'https://www.usaeo.org/imgs/sponsors/Launchpoint.png', url: 'https://www.launchpointhq.com/', desc: 'Student opportunity network' },
  { name: 'Fintech Scholars', logo: 'https://www.usaeo.org/imgs/sponsors/FintechScholars.png', url: 'https://www.fintechscholars.org/', desc: 'Finance education nonprofit' },
  { name: 'Think Finance', logo: 'https://www.usaeo.org/imgs/sponsors/ThinkFinance.png', url: 'https://www.think-finance.org/', desc: 'Financial literacy organization' },
  { name: 'YRI', logo: 'https://www.usaeo.org/imgs/sponsors/YRI.png', url: 'https://www.yriscience.com/', desc: 'Youth research initiative' },
  { name: 'FYC', logo: 'https://www.usaeo.org/imgs/sponsors/FYC.png', url: 'https://linktr.ee/financialyouthclub', desc: 'Financial Youth Club' },
  { name: 'CFE', logo: 'https://www.usaeo.org/imgs/sponsors/CFE.png', url: 'https://councilfe.org/', desc: 'Council for Financial Education' },
];

const tiers = [
  { tier: 'Title Sponsor', price: '$10,000+', perks: ['Logo on all competition materials', 'Speaking slot at National Finals', 'Exclusive student recruitment access', 'Featured in all email communications', 'Social media spotlight campaign'] },
  { tier: 'Gold Sponsor', price: '$5,000+', perks: ['Logo on competition materials', 'Featured on USAEO website', 'Social media mentions', 'Student recruitment access'] },
  { tier: 'Partner', price: '$1,000+', perks: ['Logo on USAEO website', 'Social media mention', 'Partner badge for your platform'] },
];

export default function Partners() {
  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Partners</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Building the future<br /><em>together</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              We're proud to partner with education-driven organizations that share our mission of making economics education accessible and world-class.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Current Partners</p>
            <h2 className="font-serif text-3xl text-foreground">Our partner network</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {partners.map((p, i) => (
              <motion.div key={p.name} {...fadeUp(i * 0.06)}>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 p-8 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Tiers */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Become a Sponsor</p>
            <h2 className="font-serif text-4xl text-foreground mb-4">Partner with USAEO</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Support the next generation of economists while reaching a highly engaged audience of high-achieving students.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((t, i) => (
              <motion.div key={t.tier} {...fadeUp(i * 0.1)} className={`bg-white border rounded-2xl p-8 ${i === 0 ? 'border-primary shadow-md shadow-orange-50' : 'border-border'}`}>
                {i === 0 && <span className="text-xs font-semibold text-primary bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-4 block w-fit">Most Popular</span>}
                <h3 className="font-semibold text-xl text-foreground mb-1">{t.tier}</h3>
                <div className="text-2xl font-serif text-primary mb-6">{t.price}</div>
                <ul className="space-y-2.5">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)} className="mt-10 text-center">
            <a href="mailto:info@usaeo.org"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}

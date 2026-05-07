import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Lock } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PARTNER_PROGRAMS } from '@/lib/partnerEventsSeed';
import Seo from '@/components/Seo';
import { PAGE_SEO } from '@/lib/seo-config';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

const upcoming = PARTNER_PROGRAMS.filter(e => e.status === 'upcoming');
const past = PARTNER_PROGRAMS.filter(e => e.status === 'past');

function ProgramCard({ event, i }) {
  return (
    <motion.div {...fadeUp(i * 0.08)}
      className="border border-border rounded-2xl bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0 flex items-center gap-3 min-w-[120px]">
            {event.partnerLogo && (
              <img src={event.partnerLogo} alt={event.partnerShort} className="h-10 w-auto max-w-[80px] object-contain opacity-80"  loading="lazy" decoding="async" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                {event.badge}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary border border-orange-200">
                {event.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 text-success border border-green-200">
                Applications Open
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{event.partner}</p>
            <h2 className="font-sans text-2xl md:text-3xl text-foreground mb-3">{event.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{event.desc}</p>
            <a href={event.externalUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Learn more on {event.partnerShort} website <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PartnerPrograms() {
  return (
    <PageLayout>
      <Seo title={PAGE_SEO['/partner-programs']?.title} description={PAGE_SEO['/partner-programs']?.description} canonical="/partner-programs" />
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Partner Programs</p>
            <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              Grow your skills<br /><em>with our partners</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              USAEO partner organizations run fellowships, reading groups, and mentorship programs open to our students. Expand what economics means for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Upcoming</p>
            <h2 className="font-sans text-3xl text-foreground">Open programs</h2>
          </motion.div>
          {upcoming.length === 0 ? (
            <motion.div {...fadeUp(0.1)} className="bg-white border border-border rounded-2xl p-12 text-center">
              <p className="font-semibold text-foreground mb-2">No upcoming partner programs right now</p>
              <p className="text-sm text-muted-foreground">Check back soon or visit our partners' websites directly.</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {upcoming.map((event, i) => <ProgramCard key={event.id} event={event} i={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="py-20 px-5 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Previous Events</p>
              <h2 className="font-sans text-3xl text-foreground">Past programs</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">These programs have concluded. More information is available on partner websites.</p>
            </motion.div>
            <div className="space-y-3">
              {past.map((event, i) => (
                <motion.div key={event.id} {...fadeUp(i * 0.05)}
                  className="flex items-start gap-5 bg-white border border-border rounded-xl px-6 py-5 opacity-75">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    {event.partnerLogo && (
                      <img src={event.partnerLogo} alt={event.partnerShort} className="h-8 w-auto max-w-[36px] object-contain grayscale"  loading="lazy" decoding="async" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">{event.partner}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{event.category}</span>
                    </div>
                    <p className="font-medium text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{event.desc}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> Closed
                    </span>
                    <a href={event.externalUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      Details <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-sans text-4xl text-foreground mb-5">Are you a partner with a program?</h2>
          <p className="text-muted-foreground mb-8">Let us know and we'll feature it here for our students.</p>
          <a href="mailto:partnerships@usaeo.org?subject=Partner%20program%20listing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
            Contact us <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </PageLayout>
  );
}

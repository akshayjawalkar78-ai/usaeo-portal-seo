import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CHAPTERS_SEED, CHAPTER_STATE_COUNT } from '@/lib/chaptersSeed';
import { PARTNERS } from '@/lib/partnersSeed';
import { easeOut, viewportOnce } from '@/lib/motion';
import Seo from '@/components/Seo';
import { ORG_JSON_LD, PAGE_SEO, SITE_URL } from '@/lib/seo-config';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
const orangeIcon = L.divIcon({
  className: 'usaeo-map-pin',
  html: '<div class="h-3.5 w-3.5 rounded-full bg-primary border-[2.5px] border-white shadow-[0_1px_5px_rgba(0,0,0,0.35)]"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: viewportOnce,
  transition: { duration: 0.32, ease: easeOut, delay },
});

const partners = PARTNERS;

const faqs = [
  { q: 'Who can participate?', a: 'Any high school student in the United States. No prior economics knowledge is required, we provide all the study materials you need, completely free.' },
  { q: 'Is there a registration fee?', a: 'No. The USAEO is completely free to participate in at every stage. Our mission is to make economics education accessible to all students regardless of background.' },
  { q: 'What topics are covered?', a: 'Microeconomics, macroeconomics, international trade, data interpretation, and real-world economic analysis. The full syllabus is available to all registered students.' },
  { q: 'How is the competition structured?', a: 'Four stages: National Qualifiers (virtual, February 28, 2026), Quiz Bowl (open now), Essay Competition (open now), and National Finals (in-person, May 2026). Each stage builds on the last.' },
  { q: 'Can I start a chapter at my school?', a: 'Yes. Chapter Founder applications are open year-round. Chapters can be founded at any public or private US high school.' },
  { q: 'Do I need a teacher or sponsor to register?', a: 'No. Students register individually at usaeo.org. You do not need school sponsorship, a teacher nomination, or any prior affiliation with USAEO.' },
];

const principles = [
  { title: 'Academic excellence', body: 'We set a high standard for economic reasoning, testing theory, data analysis, and real-world problem solving across all competition stages. Students leave the USAEO with analytical skills that extend well beyond economics.' },
  { title: 'Radical accessibility', body: 'Free registration, free curriculum, free workshops. No school nomination, no entry fees, no prerequisites. The competition is genuinely open to every US high schooler, from any state, any school, any background.' },
  { title: 'Impact-driven', body: "As a 501(c)(3) nonprofit, every dollar we raise goes toward student programming: free workshops, open curriculum, and a competition infrastructure that levels the playing field for students everywhere." },
];

function ScrollPrinciple({ item }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.25'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [20, 0, 0, -20]);
  return (
    <motion.div ref={ref} style={{ opacity, y }} className="min-h-[45vh] flex items-center">
      <div className="border-l border-white/20 pl-6">
        <p className="font-semibold text-white mb-3">{item.title}</p>
        <p className="text-sm text-white/60 leading-relaxed max-w-md">{item.body}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {

  return (
    <PageLayout>
      <Seo
        title={PAGE_SEO['/'].title}
        description={PAGE_SEO['/'].description}
        canonical="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            ORG_JSON_LD,
            {
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              url: `${SITE_URL}/`,
              name: 'USA Economics Olympiad',
              publisher: { '@id': `${SITE_URL}/#organization` },
              inLanguage: 'en-US',
            },
          ],
        }}
      />

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="relative min-h-screen flex flex-col justify-center px-5 overflow-hidden bg-white pt-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="max-w-4xl">

            <motion.h1 {...fadeUp(0.05)} className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-foreground leading-[1.03] mb-7 tracking-tight">
              The US economics<br />
              <em className="text-primary">olympiad</em> for<br />
              high school students
            </motion.h1>

            <motion.p {...fadeUp(0.1)} className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              The USAEO is a free national competition that identifies and develops America's top young economists, completely free, open to every US high school student, and run by a 501(c)(3) nonprofit.
            </motion.p>

            <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-3">
              <a href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-white rounded-full font-medium hover:bg-foreground/85 transition-colors">
                Register <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/competitions"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground rounded-full font-medium hover:border-foreground transition-colors">
                How it works
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero image */}
        <motion.div {...fadeUp(0.2)} className="relative z-10 mt-16 w-full max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-gray-100/80">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80&fm=webp&auto=format"
              srcSet="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=70&fm=webp&auto=format 800w, https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=75&fm=webp&auto=format 1200w, https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80&fm=webp&auto=format 1600w"
              sizes="(max-width: 768px) 100vw, 1200px"
              alt="High school students competing at the USA Economics Olympiad national finals"
              className="w-full h-72 md:h-[480px] object-cover object-top"
              fetchPriority="high"
              decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* â”€â”€ NUMBERS â”€â”€ */}
      <section className="py-16 border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10">
            {[
              { value: '600+', label: 'Registered students', sub: `From ${CHAPTER_STATE_COUNT}+ states` },
              { value: '100%', label: 'Free to participate', sub: 'No fees at any stage' },
              { value: `${CHAPTERS_SEED.length}`, label: 'Active school chapters', sub: `Across ${CHAPTER_STATE_COUNT} states` },
              { value: '4', label: 'Competition stages', sub: 'Qualifiers to Finals' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.07)}>
                <div className="text-4xl md:text-5xl font-sans text-foreground mb-1.5">{s.value}</div>
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ COMPETITION PATH â”€â”€ */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp()} className="md:sticky md:top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">The Competition</p>
              <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight mb-6">
                Four stages.<br /><em>One national champion.</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                The USAEO runs a multi-stage competition open to all US high school students: qualifying round, Quiz Bowl, Essay Competition, and National Finals. Each stage is free to enter.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Students advance based solely on performance. There are no nominations, no fees, and no prerequisites, just a genuine open competition accessible to every US high schooler.
              </p>
            </motion.div>

            <div className="space-y-0 divide-y divide-border">
              {[
                {
                  n: '01', title: 'National Qualifiers', date: 'February 28, 2026',
                  body: 'A two-hour virtual exam open to all US high school students covering the full USAEO syllabus. Registration is now closed, top scorers have advanced to the next rounds.',
                  to: '/competitions',
                },
                {
                  n: '02', title: 'Quiz Bowl', date: 'May 17th, 2026',
                  body: 'Fast-paced timed quiz covering microeconomics, macroeconomics, and current events. Open to all registered students, register now to secure your spot.',
                  to: '/competitions/quiz-bowl',
                },
                {
                  n: '03', title: 'Essay Competition', date: 'May 17th, 2026',
                  body: 'Submit a research essay on an economics topic. Judged on economic reasoning, evidence quality, and clarity of argument. Open to all registered students.',
                  to: '/competitions/essay',
                },
                {
                  n: '04', title: 'National Finals', date: 'June 14th 2026',
                  body: 'An intensive in-person competition held at a US university campus. Top scorers from Quiz Bowl and Essay rounds compete in a written exam and case study analysis. Winners are named National Champions.',
                  to: '/competitions/finals',
                },
              ].map((step, i) => (
                <motion.div key={step.n} {...fadeUp(i * 0.1)} className="py-8">
                  <div className="flex gap-6">
                    <span className="font-sans text-5xl text-primary/70 leading-none flex-shrink-0 w-12 text-right">{step.n}</span>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{step.date}</p>
                      <h3 className="font-semibold text-foreground text-lg mb-3">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.body}</p>
                      <Link to={step.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ PROGRAMS â”€â”€ */}
      <section className="py-28 md:py-36 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Programs</p>
              <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                Beyond the competition
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="md:pt-9">
              <p className="text-base text-muted-foreground leading-relaxed">
                The competition is the core of USAEO, but the program extends well beyond exam day. Whether you're looking to study, research, connect with peers, or build something at your school, there's a place for you.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border overflow-hidden rounded-2xl">
            {[
              {
                title: 'Free Curriculum',
                to: '/curriculum',
                body: 'Six structured units covering the complete USAEO syllabus, from introductory supply and demand to international finance. Self-paced, with problem sets and practice tests. No prior economics background needed.',
                meta: '6 units · 30+ hours · Self-paced',
              },
              {
                title: 'Live Workshops',
                to: '/workshops',
                body: 'Expert-led sessions held over Zoom throughout the competition season. Topics include game theory, macroeconomic policy, data analysis, and competition preparation. All sessions are free and recordings are available.',
                meta: 'Weekly sessions · Free · All levels',
              },
              {
                title: 'Research Program',
                to: '/research',
                body: 'Students interested in academic economics can apply to the USAEO research program, where they conduct original economic research with guidance from mentors in the field. Papers are published in the USAEO student journal.',
                meta: 'Mentored · Published · Open applications',
              },
              {
                title: 'Chapter Program',
                to: '/chapters',
                body: 'Start a USAEO chapter at your high school. Chapter Founders lead weekly meetings, organize local study sessions, and connect their peers to the national competition. Active chapters exist in 15+ states.',
                meta: '50+ active chapters · Applications open',
              },
            ].map((p, i) => (
              <motion.div key={p.title} {...fadeUp(i * 0.08)} className="bg-white p-8 md:p-10 group">
                <h3 className="font-semibold text-foreground text-xl mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.body}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{p.meta}</span>
                  <Link to={p.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ PARTNERS â”€â”€ */}
      <section className="py-20 border-t border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-12">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Partners & Sponsors</p>
              <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                Organizations that share <em>our mission</em>
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="md:pt-9">
              <p className="text-base text-muted-foreground leading-relaxed">
                The USAEO is supported by organizations committed to economics education and student opportunity. Our partners share our belief that every student, regardless of background or resources, deserves access to rigorous, real-world economic learning. Together, we work to expand the reach and impact of the USAEO mission across the country.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {partners.map((p, i) => {
              const logoH = p.logoScale ? Math.round(32 * p.logoScale) : 32;
              return (
                <motion.a key={p.name} {...fadeUp(i * 0.04)}
                  href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 p-6 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-200 bg-white h-20">
                  {p.logo
                    ? <img src={p.logo} alt={p.name} style={{ height: logoH, ...(p.logoFilter ? { filter: p.logoFilter } : {}) }} className="w-auto max-w-[120px] object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"  loading="lazy" decoding="async" />
                    : <span className="text-xs font-semibold text-muted-foreground text-center leading-tight group-hover:text-primary transition-colors">{p.shortName || p.name}</span>
                  }
                  {p.wordmark && (
                    <span
                      style={{ fontFamily: p.wordmark.fontFamily, fontWeight: p.wordmark.fontWeight, fontSize: p.wordmark.fontSize, whiteSpace: p.wordmark.wrap ? 'pre-line' : 'nowrap', lineHeight: 1.2 }}
                      className="text-base text-foreground/70 group-hover:text-foreground transition-colors"
                    >
                      {p.wordmark.text}
                    </span>
                  )}
                </motion.a>
              );
            })}
            <motion.a {...fadeUp(0.56)} href="mailto:info@usaeo.org"
              className="flex items-center justify-center p-6 border border-dashed border-border rounded-xl hover:border-primary/40 transition-all duration-200 h-20">
              <span className="text-sm text-muted-foreground">+ Partner</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* â”€â”€ CHAPTERS â”€â”€ */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header row: title left, description + CTAs right */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">School Chapters</p>
              <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                Building economics communities<br /><em>across the country</em>
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="pt-9">
              <p className="text-base text-muted-foreground leading-relaxed mb-5">
                Chapter Founders establish USAEO chapters at their high schools, leading weekly study sessions, workshops, and local competition prep. Chapters exist at schools from New York to San Francisco.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Founding a chapter gives you leadership experience, access to exclusive USAEO resources, and the ability to build an economics community at your school.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/chapters"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
                  View all chapters
                </Link>
                <Link to="/register/chapter"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
                  Start a chapter
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div {...fadeUp(0.1)} className="relative z-0 isolate rounded-2xl overflow-hidden border border-border shadow-sm mb-10 aspect-[16/9] md:aspect-[21/9]">
            <MapContainer center={[38.5, -96]} zoom={4} className="h-full w-full" scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {CHAPTERS_SEED.map((c) => (
                <Marker key={c.id} position={[c.lat, c.lng]} icon={orangeIcon}>
                  <Popup>
                    <strong>{c.school}</strong><br />{c.city}, {c.state}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Chapter grid, first 6 from canonical seed */}
          <motion.div {...fadeUp(0.15)} className="grid md:grid-cols-3 gap-4">
            {CHAPTERS_SEED.slice(0, 6).map((c) => (
              <div key={c.id} className="border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <p className="font-medium text-foreground text-sm mb-2">{c.school}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {c.city}, {c.state}
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="mt-5">
            <Link to="/chapters" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              + {CHAPTERS_SEED.length - 6} more chapters <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ TESTIMONIALS â”€â”€ */}
      <section className="py-28 md:py-36 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">From students</p>
              <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                What competitors<br />say about USAEO
              </h2>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'USAEO fundamentally changed how I think about economics. The workshops were invaluable prep for both the competition and my AP coursework.', name: 'Aisha T.', school: 'Stuyvesant High School, NY', year: 'Class of 2026' },
              { quote: "I had no economics background when I registered. Six months later I was competing at the national level. The free curriculum made it genuinely possible, not just in theory.", name: 'Marcus L.', school: 'Phillips Academy, MA', year: 'Class of 2025' },
              { quote: "Competing at the National Finals was the most formative academic experience of my life. The community you build with students from across the country is unlike anything in a classroom.", name: 'Sofia R.', school: 'Lowell High School, CA', year: 'National Finals 2025' },
            ].map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)} className="bg-white border border-border rounded-2xl p-8">
                <p className="text-base text-foreground leading-relaxed mb-7 italic">"{t.quote}"</p>
                <div className="border-t border-border pt-5">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.school}</div>
                  <div className="text-xs text-primary mt-0.5">{t.year}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ MISSION â”€â”€ */}
      <section className="bg-foreground">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div {...fadeUp()} className="md:sticky md:top-24 py-28 md:py-36 self-start">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">Our Mission</p>
              <blockquote className="font-sans text-3xl md:text-4xl text-white leading-snug mb-6">
                "We believe every student deserves access to world-class economics education, and the chance to prove themselves on the global stage."
              </blockquote>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-primary/70 transition-colors">
                About USAEO <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <div className="py-28 md:py-36">
              {principles.map((item) => (
                <ScrollPrinciple key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€ */}
      <section className="py-28 md:py-36 bg-white border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-5 gap-16">
            <motion.div {...fadeUp()} className="md:col-span-2 md:sticky md:top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">FAQ</p>
              <h2 className="font-sans text-4xl text-foreground leading-tight mb-5">Common questions</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Can't find what you're looking for? Email us at{' '}
                <a href="mailto:info@usaeo.org" className="text-foreground underline underline-offset-2">info@usaeo.org</a>.
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="md:col-span-3">
              <Accordion type="single" collapsible className="space-y-0 divide-y divide-border">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`f-${i}`} className="border-0">
                    <AccordionTrigger className="text-left font-medium text-foreground text-base py-5 hover:no-underline hover:text-primary transition-colors">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€ */}
      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-sans text-4xl md:text-5xl text-foreground mb-5">Ready to compete?</h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
            Registration is free. No economics background required. No teacher nomination needed. Just register and start preparing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Register <ArrowRight className="w-4 h-4" />
            </a>
            <a href="mailto:info@usaeo.org"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
              Email info@usaeo.org
            </a>
          </div>
        </motion.div>
      </section>

    </PageLayout>
  );
}

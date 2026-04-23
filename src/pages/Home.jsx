import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
const orangeIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:hsl(24,95%,53%);border:2.5px solid white;box-shadow:0 1px 5px rgba(0,0,0,.35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
});

const partners = [
  { name: 'Ultra AI', logo: 'https://www.usaeo.org/imgs/sponsors/UltraAI.png', url: 'https://useultra.ai/' },
  { name: 'Stellar', logo: 'https://www.usaeo.org/imgs/sponsors/Stellar.png', url: 'https://stellarlearning.app/' },
  { name: 'Crackd', logo: 'https://www.usaeo.org/imgs/sponsors/Crackd.png', url: 'https://crackd.it/' },
  { name: 'Launchpoint', logo: 'https://www.usaeo.org/imgs/sponsors/Launchpoint.png', url: 'https://www.launchpointhq.com/' },
  { name: 'Fintech Scholars', logo: 'https://www.usaeo.org/imgs/sponsors/FintechScholars.png', url: 'https://www.fintechscholars.org/' },
  { name: 'Think Finance', logo: 'https://www.usaeo.org/imgs/sponsors/ThinkFinance.png', url: 'https://www.think-finance.org/' },
  { name: 'YRI', logo: 'https://www.usaeo.org/imgs/sponsors/YRI.png', url: 'https://www.yriscience.com/' },
  { name: 'FYC', logo: 'https://www.usaeo.org/imgs/sponsors/FYC.png', url: 'https://linktr.ee/financialyouthclub' },
  { name: 'CFE', logo: 'https://www.usaeo.org/imgs/sponsors/CFE.png', url: 'https://councilfe.org/' },
  { name: 'Youth Economy Lab', logo: null, url: 'https://www.youtheconomylab.com/' },
  { name: 'Synthica', logo: null, url: 'https://www.synthica.org/' },
  { name: 'A-Warded', logo: null, url: 'https://a-warded.org/' },
  { name: 'SE Asia Econ Project', logo: null, url: 'https://seaecon.org/' },
];

const faqs = [
  { q: 'Who can participate?', a: 'Any high school student in the United States. No prior economics knowledge is required — we provide all the study materials you need, completely free.' },
  { q: 'Is there a registration fee?', a: 'No. The USAEO is completely free to participate in at every stage. Our mission is to make economics education accessible to all students regardless of background.' },
  { q: 'What topics are covered?', a: 'Microeconomics, macroeconomics, international trade, data interpretation, and real-world economic analysis. The full syllabus is available to all registered students.' },
  { q: 'How is the competition structured?', a: 'Four stages: National Qualifiers (virtual, February 28, 2026), Quiz Bowl (open now), Essay Competition (open now), and National Finals (in-person, May 2026). Each stage builds on the last.' },
  { q: 'Can I start a chapter at my school?', a: 'Yes. Chapter Founder applications are open year-round. Chapters can be founded at any public or private US high school.' },
  { q: 'Do I need a teacher or sponsor to register?', a: 'No. Students register individually at usaeo.org. You do not need school sponsorship, a teacher nomination, or any prior affiliation with USAEO.' },
];

const principles = [
  { title: 'Academic excellence', body: 'We set a high standard for economic reasoning, testing theory, data analysis, and real-world problem solving across all competition stages. Students leave the USAEO with analytical skills that extend well beyond economics.' },
  { title: 'Radical accessibility', body: 'Free registration, free curriculum, free workshops. No school nomination, no entry fees, no prerequisites. The competition is genuinely open to every US high schooler — from any state, any school, any background.' },
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
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const target = new Date('2026-05-15T11:00:00');
    const update = () => {
      const diff = Math.max(0, target - new Date());
      setDays(Math.floor(diff / 86400000));
      setHours(Math.floor((diff % 86400000) / 3600000));
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center px-5 overflow-hidden bg-white pt-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="max-w-4xl">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                National Finals in {days}d {hours}h — May 2026
              </div>
            </motion.div>

            <motion.h1 {...fadeUp(0.05)} className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[84px] text-foreground leading-[1.03] mb-7 tracking-tight">
              The US economics<br />
              <em className="text-primary">olympiad</em> for<br />
              high school students
            </motion.h1>

            <motion.p {...fadeUp(0.1)} className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              The USAEO is a free national competition that identifies and develops America's top young economists — completely free, open to every US high school student, and run by a 501(c)(3) nonprofit.
            </motion.p>

            <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-3">
              <a href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-white rounded-full font-medium hover:bg-foreground/85 transition-colors">
                Register — it's free <ArrowRight className="w-4 h-4" />
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
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=85"
              alt="Students in an economics competition"
              className="w-full h-72 md:h-[480px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="py-16 border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10">
            {[
              { value: '500+', label: 'Registered students', sub: 'From 40+ states' },
              { value: '100%', label: 'Free to participate', sub: 'No fees at any stage' },
              { value: '501(c)(3)', label: 'Registered nonprofit', sub: 'Mission-driven organization' },
              { value: '9+', label: 'Active school chapters', sub: 'And growing' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.07)}>
                <div className="text-4xl md:text-5xl font-serif text-foreground mb-1.5">{s.value}</div>
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPETITION PATH ── */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp()} className="md:sticky md:top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">The Competition</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-6">
                Four stages.<br /><em>One national champion.</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                The USAEO runs a multi-stage competition open to all US high school students: qualifying round, Quiz Bowl, Essay Competition, and National Finals. Each stage is free to enter.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Students advance based solely on performance. There are no nominations, no fees, and no prerequisites — just a genuine open competition accessible to every US high schooler.
              </p>
            </motion.div>

            <div className="space-y-0 divide-y divide-border">
              {[
                {
                  n: '01', title: 'National Qualifiers', date: 'February 28, 2026',
                  body: 'A two-hour virtual exam open to all US high school students covering the full USAEO syllabus. Registration is now closed — top scorers have advanced to the next rounds.',
                  to: '/competitions',
                },
                {
                  n: '02', title: 'Quiz Bowl', date: 'Coming Soon',
                  body: 'Fast-paced timed quiz covering microeconomics, macroeconomics, and current events. Open to all registered students — register now to secure your spot.',
                  to: '/competitions/quiz-bowl',
                },
                {
                  n: '03', title: 'Essay Competition', date: 'Coming Soon',
                  body: 'Submit a research essay on an economics topic. Judged on economic reasoning, evidence quality, and clarity of argument. Open to all registered students.',
                  to: '/competitions/essay',
                },
                {
                  n: '04', title: 'National Finals', date: 'May 2026',
                  body: 'An intensive in-person competition held at a US university campus. Top scorers from Quiz Bowl and Essay rounds compete in a written exam and case study analysis. Winners are named National Champions.',
                  to: '/competitions/finals',
                },
              ].map((step, i) => (
                <motion.div key={step.n} {...fadeUp(i * 0.1)} className="py-8">
                  <div className="flex gap-6">
                    <span className="font-serif text-5xl text-orange-300 leading-none flex-shrink-0 w-12 text-right">{step.n}</span>
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

      {/* ── PROGRAMS ── */}
      <section className="py-28 md:py-36 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Programs</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                Beyond the competition
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="md:pt-9">
              <p className="text-base text-muted-foreground leading-relaxed">
                The competition is the core of USAEO — but the program extends well beyond exam day. Whether you're looking to study, research, connect with peers, or build something at your school, there's a place for you.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border overflow-hidden rounded-2xl">
            {[
              {
                title: 'Free Curriculum',
                to: '/curriculum',
                body: 'Six structured units covering the complete USAEO syllabus — from introductory supply and demand to international finance. Self-paced, with problem sets and practice tests. No prior economics background needed.',
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
                meta: '9+ active chapters · Applications open',
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

      {/* ── PARTNERS ── */}
      <section className="py-20 border-t border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-12">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Partners & Sponsors</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                Organizations that share<br /><em>our mission</em>
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="md:pt-9">
              <p className="text-base text-muted-foreground leading-relaxed">
                The USAEO is supported by organizations committed to economics education and student opportunity.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {partners.map((p, i) => (
              <motion.a key={p.name} {...fadeUp(i * 0.04)}
                href={p.url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-center p-6 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-200 bg-white h-20">
                {p.logo
                  ? <img src={p.logo} alt={p.name} className="h-8 w-auto max-w-[120px] object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300" />
                  : <span className="text-xs font-semibold text-muted-foreground text-center leading-tight group-hover:text-primary transition-colors">{p.name}</span>
                }
              </motion.a>
            ))}
            <motion.a {...fadeUp(0.56)} href="mailto:info@usaeo.org"
              className="flex items-center justify-center p-6 border border-dashed border-border rounded-xl hover:border-primary/40 transition-all duration-200 h-20">
              <span className="text-sm text-muted-foreground">+ Partner</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── CHAPTERS ── */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header row: title left, description + CTAs right */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">School Chapters</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
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
          <motion.div {...fadeUp(0.1)} className="relative z-0 isolate rounded-2xl overflow-hidden border border-border shadow-sm mb-10" style={{ height: 400 }}>
            <MapContainer center={[38.5, -96]} zoom={4} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {[
                { school: 'Thomas Jefferson HS', city: 'Alexandria, VA', members: 24, lat: 38.8048, lng: -77.0719 },
                { school: 'Stuyvesant HS', city: 'New York, NY', members: 31, lat: 40.7178, lng: -74.0134 },
                { school: 'Phillips Academy', city: 'Andover, MA', members: 18, lat: 42.6509, lng: -71.1369 },
                { school: 'Chicago Lab School', city: 'Chicago, IL', members: 22, lat: 41.7943, lng: -87.5907 },
                { school: 'Basis Scottsdale', city: 'Scottsdale, AZ', members: 15, lat: 33.5093, lng: -111.8985 },
                { school: 'Lowell High School', city: 'San Francisco, CA', members: 27, lat: 37.7454, lng: -122.4614 },
                { school: 'Montgomery Blair HS', city: 'Silver Spring, MD', members: 19, lat: 39.0415, lng: -77.0009 },
                { school: 'Lynbrook High School', city: 'San Jose, CA', members: 21, lat: 37.3508, lng: -121.9961 },
                { school: 'River Hill High School', city: 'Clarksville, MD', members: 14, lat: 39.1774, lng: -76.9247 },
              ].map((c) => (
                <Marker key={c.school} position={[c.lat, c.lng]} icon={orangeIcon}>
                  <Popup>
                    <strong>{c.school}</strong><br />{c.city}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Chapter grid */}
          <motion.div {...fadeUp(0.15)} className="grid md:grid-cols-3 gap-4">
            {[
              { school: 'Thomas Jefferson High School', city: 'Alexandria, VA', members: 24, founded: 'Sep 2024' },
              { school: 'Stuyvesant High School', city: 'New York, NY', members: 31, founded: 'Aug 2024' },
              { school: 'Phillips Academy', city: 'Andover, MA', members: 18, founded: 'Oct 2024' },
              { school: 'Chicago Lab School', city: 'Chicago, IL', members: 22, founded: 'Nov 2024' },
              { school: 'Lowell High School', city: 'San Francisco, CA', members: 27, founded: 'Sep 2024' },
              { school: 'Lynbrook High School', city: 'San Jose, CA', members: 21, founded: 'Feb 2025' },
            ].map((c) => (
              <div key={c.school} className="border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <p className="font-medium text-foreground text-sm mb-2">{c.school}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {c.city}
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="mt-5">
            <Link to="/chapters" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              + 3 more chapters <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 md:py-36 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">From students</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                What competitors<br />say about USAEO
              </h2>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'USAEO fundamentally changed how I think about economics. The workshops were invaluable prep for both the competition and my AP coursework.', name: 'Aisha T.', school: 'Stuyvesant High School, NY', year: 'Class of 2026' },
              { quote: "I had no economics background when I registered. Six months later I was competing at the national level. The free curriculum made it genuinely possible — not just in theory.", name: 'Marcus L.', school: 'Phillips Academy, MA', year: 'Class of 2025' },
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

      {/* ── MISSION ── */}
      <section className="bg-foreground">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div {...fadeUp()} className="md:sticky md:top-24 py-28 md:py-36 self-start">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">Our Mission</p>
              <blockquote className="font-serif text-3xl md:text-4xl text-white leading-snug mb-6">
                "We believe every student deserves access to world-class economics education — and the chance to prove themselves on the global stage."
              </blockquote>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors">
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

      {/* ── FAQ ── */}
      <section className="py-28 md:py-36 bg-white border-t border-border">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-5 gap-16">
            <motion.div {...fadeUp()} className="md:col-span-2 md:sticky md:top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">FAQ</p>
              <h2 className="font-serif text-4xl text-foreground leading-tight mb-5">Common questions</h2>
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

      {/* ── CTA ── */}
      <section className="py-20 px-5 text-center border-t border-border">
        <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5">Ready to compete?</h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
            Registration is free. No economics background required. No teacher nomination needed. Just register and start preparing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Register Now — Free <ArrowRight className="w-4 h-4" />
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

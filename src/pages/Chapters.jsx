import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, X, ExternalLink, Calendar, BookOpen, Mic2, Trophy, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageLayout from '../components/layout/PageLayout';
import { base44 } from '@/api/base44Client';
import { CHAPTERS_SEED, CHAPTER_STATE_COUNT } from '@/lib/chaptersSeed';

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
  initial: { opacity: 0, transform: 'translate3d(0,24px,0)' },
  whileInView: { opacity: 1, transform: 'translate3d(0,0,0)' },
  viewport: { once: true },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
});

const SEED_CHAPTERS = CHAPTERS_SEED.map(c => ({ ...c, name: c.school }));

const founderActions = [
  { icon: Calendar, action: 'Host weekly or bi-weekly economics meetings' },
  { icon: BookOpen, action: 'Run study sessions using USAEO curriculum' },
  { icon: Mic2, action: 'Invite guest speakers from academia & industry' },
  { icon: Trophy, action: 'Organize local mock competition rounds' },
  { icon: Radio, action: 'Spread USAEO awareness at your school' },
];

export default function Chapters() {
  const [selected, setSelected] = useState(null);
  const [chapters, setChapters] = useState(SEED_CHAPTERS);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 8;
  const visibleChapters = showAll ? chapters : chapters.slice(0, INITIAL_COUNT);

  useEffect(() => {
    base44.entities.Chapter.filter({ status: 'active' }).then((data) => {
      if (data && data.length > 0) setChapters(data);
    }).catch(() => {});
  }, []);

  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Chapters</p>
            <h1 className="font-sans text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              USAEO chapters<br /><em>across the nation</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Start a chapter at your school, lead your peers, and build a local economics community connected to the national network.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[[`${CHAPTERS_SEED.length}`, 'Active chapters'], [`${CHAPTER_STATE_COUNT}`, 'States represented'], ['Open', 'Applications']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-sans text-primary">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAP + ACTIVE CHAPTERS */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Active Chapters</p>
            <h2 className="font-sans text-3xl text-foreground">Find chapters near you</h2>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="relative z-0 isolate rounded-2xl overflow-hidden border border-border shadow-sm mb-10 aspect-[16/9] md:aspect-[21/9]">
            <MapContainer
              center={[38.5, -96]}
              zoom={4}
              className="h-full w-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {chapters.map((c) => (
                <Marker key={c.school} position={[c.lat, c.lng]} icon={orangeIcon}>
                  <Popup>
                    <div className="text-sm">
                      <strong className="block text-foreground">{c.school}</strong>
                      <span className="text-muted-foreground">{c.state ? `${c.city}, ${c.state}` : c.city}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleChapters.map((c, i) => (
              <motion.div key={c.id || c.school} {...fadeUp(i * 0.06)}>
                <button onClick={() => setSelected(c)}
                  className="w-full text-left bg-white border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{c.school}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" /> {c.state ? `${c.city}, ${c.state}` : c.city}
                      </div>
                      {c.focus && <p className="text-xs text-muted-foreground">{c.focus}</p>}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
          {chapters.length > INITIAL_COUNT && (
            <motion.div {...fadeUp(0.2)} className="mt-6 flex justify-center">
              <button onClick={() => setShowAll(v => !v)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-full font-medium text-sm hover:border-foreground transition-colors">
                {showAll ? 'Show less' : `Show all ${chapters.length} chapters`}
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            </motion.div>
          )}
          <motion.p {...fadeUp(0.3)} className="text-sm text-muted-foreground mt-6 text-center">
            Showing {visibleChapters.length} of {chapters.length} active chapters · More joining every week
          </motion.p>
        </div>
      </section>

      {/* Become a founder */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Start a Chapter</p>
              <h2 className="font-sans text-4xl text-foreground leading-tight">Become a Chapter Founder</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed md:pt-9">
              <p>As a Chapter Founder, you'll lead economics education at your school, organize study sessions, host competition prep workshops, and connect your peers with the nationwide USAEO network.</p>
              <p>Applications are open year-round. Chapters can be founded at any public or private high school in the US. Chapter Founders receive exclusive resources, direct support from USAEO staff, and recognition in the national community.</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden mb-10">
            <motion.div {...fadeUp(0.05)} className="bg-white p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">What you'll do</p>
              <div className="space-y-5">
                {founderActions.map(({ icon: Icon, action }) => (
                  <div key={action} className="flex items-start gap-4">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="bg-white p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">What you'll gain</p>
              <div className="space-y-5">
                {[
                  'Lead economics education at your school',
                  'Access exclusive founder resources & curriculum',
                  'Connect with a national network of chapter founders',
                  'Build your leadership portfolio for college applications',
                  'Earn USAEO Chapter Founder recognition',
                  'Organize local competitions and community events',
                ].map((b) => (
                  <div key={b} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-foreground leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.15)}>
            <Link to="/register/chapter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Apply as Chapter Founder <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Chapter Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-xl text-foreground">{selected.school}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {selected.city}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Founded</span><span className="font-semibold text-foreground">{selected.founded}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Focus areas</span><span className="font-semibold text-foreground text-right max-w-[200px]">{selected.focus}</span>
                </div>
              </div>
              <a href="mailto:info@usaeo.org" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:underline">
                Contact this chapter <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

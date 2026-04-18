import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Users, X, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageLayout from '../components/layout/PageLayout';

// Fix default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const chapters = [
  { school: 'Thomas Jefferson High School', city: 'Alexandria, VA', members: 24, lat: 38.8048, lng: -77.0719, founded: 'Sep 2024', focus: 'Competition prep, weekly econ talks' },
  { school: 'Stuyvesant High School', city: 'New York, NY', members: 31, lat: 40.7178, lng: -74.0134, founded: 'Aug 2024', focus: 'Research, debate, competitions' },
  { school: 'Phillips Academy', city: 'Andover, MA', members: 18, lat: 42.6509, lng: -71.1369, founded: 'Oct 2024', focus: 'Global economics, IEO prep' },
  { school: 'Chicago Lab School', city: 'Chicago, IL', members: 22, lat: 41.7943, lng: -87.5907, founded: 'Nov 2024', focus: 'Policy analysis, workshops' },
  { school: 'Basis Scottsdale', city: 'Scottsdale, AZ', members: 15, lat: 33.5093, lng: -111.8985, founded: 'Jan 2025', focus: 'Micro/macro deep dives' },
  { school: 'Lowell High School', city: 'San Francisco, CA', members: 27, lat: 37.7454, lng: -122.4614, founded: 'Sep 2024', focus: 'Tech economics, market analysis' },
  { school: 'Montgomery Blair High School', city: 'Silver Spring, MD', members: 19, lat: 39.0415, lng: -77.0009, founded: 'Dec 2024', focus: 'Econometrics, data science' },
  { school: 'Lynbrook High School', city: 'San Jose, CA', members: 21, lat: 37.3508, lng: -121.9961, founded: 'Feb 2025', focus: 'Competition strategy, IEO prep' },
  { school: 'River Hill High School', city: 'Clarksville, MD', members: 14, lat: 39.1774, lng: -76.9247, founded: 'Mar 2025', focus: 'Economics outreach, mentorship' },
];

export default function Chapters() {
  const [selected, setSelected] = useState(null);

  return (
    <PageLayout>
      <section className="pt-20 pb-16 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Chapters</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              USAEO chapters<br /><em>across the nation</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Start a chapter at your school, lead your peers, and build a local economics community connected to the national network.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[['9+', 'Active chapters'], ['190+', 'Chapter members'], ['15+', 'States represented']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-serif text-primary">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Chapter Map</p>
            <h2 className="font-serif text-3xl text-foreground">Find chapters near you</h2>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: 440 }}>
            <MapContainer
              center={[38.5, -96]}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
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
                      <span className="text-muted-foreground">{c.city}</span><br />
                      <span className="text-primary font-medium">{c.members} members</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        </div>
      </section>

      {/* Become a founder */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <h2 className="font-serif text-4xl text-foreground leading-tight mb-6">Become a Chapter Founder</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>As a Chapter Founder, you'll lead economics education at your school, organize study sessions, host competition prep workshops, and connect your peers with the nationwide USAEO network.</p>
              <p>Chapter Founders receive exclusive resources, direct support from USAEO staff, and recognition in the national community.</p>
            </div>
            <div className="space-y-3 mb-8">
              {[
                'Lead economics education at your school',
                'Access exclusive founder resources & curriculum',
                'Connect with a national network of founders',
                'Build your leadership portfolio for college apps',
                'Earn USAEO Chapter Founder recognition',
                'Organize local competitions and workshops',
              ].map((b) => (
                <div key={b} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-4 h-4 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  {b}
                </div>
              ))}
            </div>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSe1p-OteCPs8ulvpy53dDcd5QkNfidprtc9rqGd1FITLJqA6Q/viewform"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors">
              Apply as Chapter Founder <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">What chapter founders do</h3>
              <div className="space-y-3">
                {[
                  { icon: '📅', action: 'Host weekly or bi-weekly economics meetings' },
                  { icon: '📚', action: 'Run study sessions using USAEO curriculum' },
                  { icon: '🎙️', action: 'Invite guest speakers from academia & industry' },
                  { icon: '🏆', action: 'Organize local mock competition rounds' },
                  { icon: '📡', action: 'Spread USAEO awareness at your school' },
                ].map((item) => (
                  <div key={item.action} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-muted-foreground">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <p className="text-sm font-semibold text-primary mb-2">Ready to start?</p>
              <p className="text-sm text-muted-foreground">Applications are open year-round. Chapters can be founded at any public or private high school in the US.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Chapters Grid */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Active Chapters</p>
            <h2 className="font-serif text-3xl text-foreground">Click a chapter to learn more</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((c, i) => (
              <motion.div key={c.school} {...fadeUp(i * 0.06)}>
                <button onClick={() => setSelected(c)}
                  className="w-full text-left bg-white border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{c.school}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" /> {c.city}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.focus}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-full flex-shrink-0">
                      <Users className="w-3 h-3" /> {c.members}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp(0.3)} className="text-sm text-muted-foreground mt-6 text-center">
            Showing {chapters.length} active chapters · More joining every week
          </motion.p>
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
                  <span className="text-muted-foreground">Members</span><span className="font-semibold text-foreground">{selected.members}</span>
                </div>
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

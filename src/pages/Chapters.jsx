import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, X, ExternalLink, Calendar, BookOpen, Mic2, Trophy, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageLayout from '../components/layout/PageLayout';
import { base44 } from '@/api/base44Client';

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
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

const SEED_CHAPTERS = [
  { id: 's1', school: 'Obra D. Tompkins HS', name: 'Obra D. Tompkins HS', city: 'Katy', state: 'TX', lat: 29.7858, lng: -95.8245, status: 'active' },
  { id: 's2', school: 'Lebanon Trail HS', name: 'Lebanon Trail HS', city: 'Frisco', state: 'TX', lat: 33.1581, lng: -96.8230, status: 'active' },
  { id: 's3', school: 'Frisco HS', name: 'Frisco HS', city: 'Frisco', state: 'TX', lat: 33.1501, lng: -96.8236, status: 'active' },
  { id: 's4', school: 'Westwood HS', name: 'Westwood HS', city: 'Austin', state: 'TX', lat: 30.4406, lng: -97.7836, status: 'active' },
  { id: 's5', school: 'Plano West Senior HS', name: 'Plano West Senior HS', city: 'Plano', state: 'TX', lat: 33.0198, lng: -96.7836, status: 'active' },
  { id: 's6', school: 'Flower Mound HS', name: 'Flower Mound HS', city: 'Flower Mound', state: 'TX', lat: 33.0148, lng: -97.0969, status: 'active' },
  { id: 's7', school: 'Southlake Carroll HS', name: 'Southlake Carroll HS', city: 'Southlake', state: 'TX', lat: 32.9401, lng: -97.1340, status: 'active' },
  { id: 's8', school: 'Jesuit College Preparatory', name: 'Jesuit College Preparatory', city: 'Dallas', state: 'TX', lat: 32.8678, lng: -96.8370, status: 'active' },
  { id: 's9', school: 'Highland Park HS', name: 'Highland Park HS', city: 'Dallas', state: 'TX', lat: 32.8367, lng: -96.7973, status: 'active' },
  { id: 's10', school: 'Prosper HS', name: 'Prosper HS', city: 'Prosper', state: 'TX', lat: 33.2368, lng: -96.8009, status: 'active' },
  { id: 's11', school: 'Coppell HS', name: 'Coppell HS', city: 'Coppell', state: 'TX', lat: 32.9543, lng: -97.0150, status: 'active' },
  { id: 's12', school: 'Allen HS', name: 'Allen HS', city: 'Allen', state: 'TX', lat: 33.0951, lng: -96.6641, status: 'active' },
  { id: 's13', school: 'McKinney Boyd HS', name: 'McKinney Boyd HS', city: 'McKinney', state: 'TX', lat: 33.1972, lng: -96.6397, status: 'active' },
  { id: 's14', school: 'Lovejoy HS', name: 'Lovejoy HS', city: 'Lucas', state: 'TX', lat: 33.1029, lng: -96.5780, status: 'active' },
  { id: 's15', school: 'Hebron HS', name: 'Hebron HS', city: 'Carrollton', state: 'TX', lat: 33.0001, lng: -96.9301, status: 'active' },
  { id: 's16', school: 'Rockwall HS', name: 'Rockwall HS', city: 'Rockwall', state: 'TX', lat: 32.9290, lng: -96.4597, status: 'active' },
  { id: 's17', school: 'Wakeland HS', name: 'Wakeland HS', city: 'Frisco', state: 'TX', lat: 33.1700, lng: -96.8900, status: 'active' },
  { id: 's18', school: 'Centennial HS', name: 'Centennial HS', city: 'Frisco', state: 'TX', lat: 33.1450, lng: -96.7710, status: 'active' },
  { id: 's19', school: 'Liberty HS', name: 'Liberty HS', city: 'Frisco', state: 'TX', lat: 33.1200, lng: -96.8200, status: 'active' },
  { id: 's20', school: 'Lone Star HS', name: 'Lone Star HS', city: 'Frisco', state: 'TX', lat: 33.1550, lng: -96.8000, status: 'active' },
  { id: 's21', school: 'Memorial HS', name: 'Memorial HS', city: 'Houston', state: 'TX', lat: 29.7643, lng: -95.5277, status: 'active' },
  { id: 's22', school: 'Dulles HS', name: 'Dulles HS', city: 'Sugar Land', state: 'TX', lat: 29.5724, lng: -95.6397, status: 'active' },
  { id: 's23', school: 'Seven Lakes HS', name: 'Seven Lakes HS', city: 'Katy', state: 'TX', lat: 29.7258, lng: -95.8049, status: 'active' },
  { id: 's24', school: 'Clements HS', name: 'Clements HS', city: 'Sugar Land', state: 'TX', lat: 29.5701, lng: -95.6671, status: 'active' },
  { id: 's25', school: 'Ridge Point HS', name: 'Ridge Point HS', city: 'Missouri City', state: 'TX', lat: 29.5387, lng: -95.5780, status: 'active' },
  { id: 's26', school: 'Cypress Creek HS', name: 'Cypress Creek HS', city: 'Houston', state: 'TX', lat: 29.9463, lng: -95.6613, status: 'active' },
  { id: 's27', school: 'Strake Jesuit', name: 'Strake Jesuit', city: 'Houston', state: 'TX', lat: 29.7134, lng: -95.4887, status: 'active' },
  { id: 's28', school: 'Cinco Ranch HS', name: 'Cinco Ranch HS', city: 'Katy', state: 'TX', lat: 29.7539, lng: -95.7677, status: 'active' },
  { id: 's29', school: 'Jasper HS', name: 'Jasper HS', city: 'Plano', state: 'TX', lat: 33.0200, lng: -96.7200, status: 'active' },
  { id: 's30', school: 'Thomas Jefferson HS (SA)', name: 'Thomas Jefferson HS (SA)', city: 'San Antonio', state: 'TX', lat: 29.4441, lng: -98.5034, status: 'active' },
  { id: 's31', school: 'James Madison HS (SA)', name: 'James Madison HS (SA)', city: 'San Antonio', state: 'TX', lat: 29.5523, lng: -98.4955, status: 'active' },
  { id: 's32', school: 'Ronald Reagan HS (SA)', name: 'Ronald Reagan HS (SA)', city: 'San Antonio', state: 'TX', lat: 29.6131, lng: -98.4231, status: 'active' },
  { id: 's33', school: 'Walter Payton College Prep', name: 'Walter Payton College Prep', city: 'Chicago', state: 'IL', lat: 41.9050, lng: -87.6381, status: 'active' },
  { id: 's34', school: 'Northside College Prep', name: 'Northside College Prep', city: 'Chicago', state: 'IL', lat: 41.9803, lng: -87.7180, status: 'active' },
  { id: 's35', school: 'Niles West HS', name: 'Niles West HS', city: 'Skokie', state: 'IL', lat: 42.0386, lng: -87.7408, status: 'active' },
  { id: 's36', school: 'Niles North HS', name: 'Niles North HS', city: 'Skokie', state: 'IL', lat: 42.0539, lng: -87.7408, status: 'active' },
  { id: 's37', school: 'Naperville Central HS', name: 'Naperville Central HS', city: 'Naperville', state: 'IL', lat: 41.7703, lng: -88.1536, status: 'active' },
  { id: 's38', school: 'TJHSST', name: 'TJHSST', city: 'Falls Church', state: 'VA', lat: 38.8173, lng: -77.1993, status: 'active' },
  { id: 's39', school: 'Langley HS', name: 'Langley HS', city: 'McLean', state: 'VA', lat: 38.9218, lng: -77.1947, status: 'active' },
  { id: 's40', school: 'McLean HS', name: 'McLean HS', city: 'McLean', state: 'VA', lat: 38.9337, lng: -77.1801, status: 'active' },
  { id: 's41', school: 'South Lakes HS', name: 'South Lakes HS', city: 'Reston', state: 'VA', lat: 38.9462, lng: -77.3439, status: 'active' },
  { id: 's42', school: 'Westfield HS', name: 'Westfield HS', city: 'Chantilly', state: 'VA', lat: 38.8844, lng: -77.4075, status: 'active' },
  { id: 's43', school: 'Lynbrook HS', name: 'Lynbrook HS', city: 'San Jose', state: 'CA', lat: 37.3526, lng: -121.9843, status: 'active' },
  { id: 's44', school: 'Monta Vista HS', name: 'Monta Vista HS', city: 'Cupertino', state: 'CA', lat: 37.3230, lng: -122.0452, status: 'active' },
  { id: 's45', school: 'Stuyvesant HS', name: 'Stuyvesant HS', city: 'New York', state: 'NY', lat: 40.7176, lng: -74.0137, status: 'active' },
  { id: 's46', school: 'Townsend Harris HS', name: 'Townsend Harris HS', city: 'Flushing', state: 'NY', lat: 40.7289, lng: -73.8200, status: 'active' },
  { id: 's47', school: 'Lexington HS', name: 'Lexington HS', city: 'Lexington', state: 'MA', lat: 42.4474, lng: -71.2150, status: 'active' },
  { id: 's48', school: 'Brookline HS', name: 'Brookline HS', city: 'Brookline', state: 'MA', lat: 42.3321, lng: -71.1397, status: 'active' },
];

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
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6 max-w-2xl">
              USAEO chapters<br /><em>across the nation</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Start a chapter at your school, lead your peers, and build a local economics community connected to the national network.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {[['50+', 'Active chapters'], ['25+', 'States represented'], ['Open', 'Applications']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-serif text-primary">{v}</div>
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
            <h2 className="font-serif text-3xl text-foreground">Find chapters near you</h2>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="relative z-0 isolate rounded-2xl overflow-hidden border border-border shadow-sm mb-10" style={{ height: 440 }}>
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
                      <span className="text-muted-foreground">{c.state ? `${c.city}, ${c.state}` : c.city}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
                        <MapPin className="w-3 h-3" /> {c.state ? `${c.city}, ${c.state}` : c.city}
                      </div>
                      {c.focus && <p className="text-xs text-muted-foreground">{c.focus}</p>}
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

      {/* Become a founder */}
      <section className="py-20 px-5 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="grid md:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Start a Chapter</p>
              <h2 className="font-serif text-4xl text-foreground leading-tight">Become a Chapter Founder</h2>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bell, Calendar, FileText, School, BarChart2,
  ChevronRight, Plus, Pencil, Trash2, X, Check, AlertTriangle,
  Users, Menu, Eye, EyeOff, Upload, Trophy, BookOpen
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navItems = [
  { label: 'Overview', id: 'overview', icon: LayoutDashboard },
  { label: 'Announcements', id: 'announcements', icon: Bell },
  { label: 'Workshops', id: 'workshops', icon: Calendar },
  { label: 'Resources', id: 'resources', icon: FileText },
  { label: 'Rankings', id: 'rankings', icon: BarChart2 },
  { label: 'Chapters', id: 'chapters', icon: School },
  { label: 'Competition', id: 'competition', icon: Trophy },
  { label: 'Curriculum', id: 'curriculum', icon: BookOpen },
];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-foreground">Delete {label}?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, options, rows }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows || 3}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
      ) : type === 'select' ? (
        <select value={value ?? ''} onChange={e => onChange(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} className="rounded" />
          <span className="text-sm text-muted-foreground">Enabled</span>
        </label>
      ) : (
        <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      )}
    </div>
  );
}

export default function Admin() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [announcements, setAnnouncements] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [resources, setResources] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [competitionEvents, setCompetitionEvents] = useState([]);
  const [curriculumUnits, setCurriculumUnits] = useState([]);
  const [chapterMembers, setChapterMembers] = useState({});
  const [chapterAnns, setChapterAnns] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Modal states
  const [modal, setModal] = useState(null); // { type, data }
  const [deleteTarget, setDeleteTarget] = useState(null); // { entity, id, label }
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    const [a, w, r, rk, ch, ce, cu] = await Promise.all([
      base44.entities.Announcement.list('-created_date'),
      base44.entities.Workshop.list('-created_date'),
      base44.entities.Resource.list(),
      base44.entities.Ranking.list('rank'),
      base44.entities.Chapter.list(),
      base44.entities.CompetitionEvent.list('order'),
      base44.entities.CurriculumUnit.list('order'),
    ]);
    setAnnouncements(a); setWorkshops(w); setResources(r); setRankings(rk); setChapters(ch);
    setCompetitionEvents(ce); setCurriculumUnits(cu);
  };

  useEffect(() => { loadAll(); }, []);

  const loadChapterDetails = async (chapterId) => {
    const [members, anns] = await Promise.all([
      base44.entities.ChapterMember.filter({ chapter_id: chapterId }),
      base44.entities.ChapterAnnouncement.filter({ chapter_id: chapterId }, '-created_date'),
    ]);
    setChapterMembers(prev => ({ ...prev, [chapterId]: members }));
    setChapterAnns(prev => ({ ...prev, [chapterId]: anns }));
  };

  const openCreate = (type, defaults = {}) => { setForm(defaults); setModal({ type, data: null }); };
  const openEdit = (type, data) => { setForm({ ...data }); setModal({ type, data }); };

  const handleSave = async () => {
    setSaving(true);
    const { type, data } = modal;
    const entityMap = {
      announcement: base44.entities.Announcement,
      workshop: base44.entities.Workshop,
      resource: base44.entities.Resource,
      ranking: base44.entities.Ranking,
      chapter: base44.entities.Chapter,
      chapterAnn: base44.entities.ChapterAnnouncement,
      competitionEvent: base44.entities.CompetitionEvent,
      curriculumUnit: base44.entities.CurriculumUnit,
    };
    const entity = entityMap[type];
    if (data?.id) await entity.update(data.id, form);
    else await entity.create(form);
    setModal(null);
    setSaving(false);
    await loadAll();
    if (selectedChapter) loadChapterDetails(selectedChapter.id);
  };

  const handleDelete = async () => {
    const { entity, id } = deleteTarget;
    await entity.delete(id);
    setDeleteTarget(null);
    await loadAll();
    if (selectedChapter) loadChapterDetails(selectedChapter.id);
  };

  const removeMember = async (member) => {
    await base44.entities.ChapterMember.update(member.id, { status: 'removed' });
    const chapter = chapters.find(c => c.id === member.chapter_id);
    if (chapter) await base44.entities.Chapter.update(chapter.id, { member_count: Math.max(0, (chapter.member_count || 1) - 1) });
    loadChapterDetails(member.chapter_id);
    loadAll();
  };

  const stats = [
    { label: 'Announcements', value: announcements.length, id: 'announcements' },
    { label: 'Workshops', value: workshops.length, id: 'workshops' },
    { label: 'Resources', value: resources.length, id: 'resources' },
    { label: 'Active Chapters', value: chapters.filter(c => c.status === 'active').length, id: 'chapters' },
    { label: 'Rankings', value: rankings.length, id: 'rankings' },
    { label: 'Timeline Events', value: competitionEvents.length, id: 'competition' },
    { label: 'Curriculum Units', value: curriculumUnits.length, id: 'curriculum' },
  ];

  const navigate = (id) => { setActive(id); setSidebarOpen(false); };

  return (
    <div className="min-h-screen bg-[#f9f9f8] flex font-inter">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-14 flex items-center px-5 border-b border-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://www.usaeo.org/USAEOlogo.png" alt="USAEO" className="h-6 w-6" />
            <span className="font-semibold text-sm text-foreground">Admin Console</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-1">Manage</p>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${active === item.id ? 'bg-foreground text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Student Dashboard
          </Link>
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Back to website
          </Link>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <Modal title={modal.data ? `Edit ${modal.type}` : `New ${modal.type}`} onClose={() => setModal(null)}>
            <div className="space-y-4">
              {modal.type === 'announcement' && <>
                <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
                <Field label="Body" type="textarea" rows={4} value={form.body} onChange={v => setForm(p => ({ ...p, body: v }))} />
                <Field label="Urgent" type="checkbox" value={form.urgent} onChange={v => setForm(p => ({ ...p, urgent: v }))} />
                <Field label="Published" type="checkbox" value={form.published} onChange={v => setForm(p => ({ ...p, published: v }))} />
              </>}
              {modal.type === 'workshop' && <>
                <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
                <Field label="Date (e.g. Apr 19, 2026)" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
                <Field label="Time (e.g. 4:00 PM ET)" value={form.time} onChange={v => setForm(p => ({ ...p, time: v }))} />
                <Field label="Instructor" value={form.instructor} onChange={v => setForm(p => ({ ...p, instructor: v }))} />
                <Field label="Description" type="textarea" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} />
                <Field label="Zoom Link" value={form.zoom_link} onChange={v => setForm(p => ({ ...p, zoom_link: v }))} />
                <Field label="Recording URL" value={form.recording_url} onChange={v => setForm(p => ({ ...p, recording_url: v }))} />
                <Field label="Status" type="select" value={form.status} onChange={v => setForm(p => ({ ...p, status: v }))}
                  options={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} />
              </>}
              {modal.type === 'resource' && <>
                <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
                <Field label="File URL" value={form.file_url} onChange={v => setForm(p => ({ ...p, file_url: v }))} />
                <Field label="File Type (e.g. PDF, ZIP)" value={form.file_type} onChange={v => setForm(p => ({ ...p, file_type: v }))} />
                <Field label="File Size (e.g. 1.2 MB)" value={form.file_size} onChange={v => setForm(p => ({ ...p, file_size: v }))} />
                <Field label="Tag" type="select" value={form.tag} onChange={v => setForm(p => ({ ...p, tag: v }))}
                  options={['Competition','Curriculum','Practice','Quiz Bowl','Essay','Workshops'].map(t => ({ value: t, label: t }))} />
                <Field label="Publicly accessible (no login required)" type="checkbox" value={form.public} onChange={v => setForm(p => ({ ...p, public: v }))} />
              </>}
              {modal.type === 'ranking' && <>
                <Field label="Student Name" value={form.student_name} onChange={v => setForm(p => ({ ...p, student_name: v }))} />
                <Field label="School" value={form.school} onChange={v => setForm(p => ({ ...p, school: v }))} />
                <Field label="State" value={form.state} onChange={v => setForm(p => ({ ...p, state: v }))} />
                <Field label="Score" type="number" value={form.score} onChange={v => setForm(p => ({ ...p, score: parseFloat(v) }))} />
                <Field label="Rank" type="number" value={form.rank} onChange={v => setForm(p => ({ ...p, rank: parseInt(v) }))} />
                <Field label="Stage" type="select" value={form.stage} onChange={v => setForm(p => ({ ...p, stage: v }))}
                  options={[{ value: 'qualifiers', label: 'Qualifiers' }, { value: 'finals', label: 'Finals' }]} />
                <Field label="Year" value={form.year} onChange={v => setForm(p => ({ ...p, year: v }))} />
                <Field label="Visible to students" type="checkbox" value={form.visible} onChange={v => setForm(p => ({ ...p, visible: v }))} />
              </>}
              {modal.type === 'chapter' && <>
                <Field label="School Name" value={form.school} onChange={v => setForm(p => ({ ...p, school: v }))} />
                <Field label="City" value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} />
                <Field label="State" value={form.state} onChange={v => setForm(p => ({ ...p, state: v }))} />
                <Field label="Founder Name" value={form.founder_name} onChange={v => setForm(p => ({ ...p, founder_name: v }))} />
                <Field label="Founder Email" type="email" value={form.founder_email} onChange={v => setForm(p => ({ ...p, founder_email: v }))} />
                <Field label="Description" type="textarea" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} />
                <Field label="Invite Code" value={form.invite_code} onChange={v => setForm(p => ({ ...p, invite_code: v }))} />
                <Field label="Status" type="select" value={form.status} onChange={v => setForm(p => ({ ...p, status: v }))}
                  options={[{ value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }, { value: 'inactive', label: 'Inactive' }]} />
              </>}
              {modal.type === 'chapterAnn' && <>
                <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
                <Field label="Body" type="textarea" rows={4} value={form.body} onChange={v => setForm(p => ({ ...p, body: v }))} />
              </>}
              {modal.type === 'competitionEvent' && <>
                <Field label="Phase (e.g. Registration Opens)" value={form.phase} onChange={v => setForm(p => ({ ...p, phase: v }))} />
                <Field label="Date (e.g. Sep 2025)" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
                <Field label="Status" type="select" value={form.status} onChange={v => setForm(p => ({ ...p, status: v }))}
                  options={[{ value: 'done', label: 'Done' }, { value: 'current', label: 'Current' }, { value: 'future', label: 'Future' }]} />
                <Field label="Order (sort position)" type="number" value={form.order} onChange={v => setForm(p => ({ ...p, order: parseInt(v) }))} />
              </>}
              {modal.type === 'curriculumUnit' && <>
                <Field label="Unit Number (e.g. 01)" value={form.unit_number} onChange={v => setForm(p => ({ ...p, unit_number: v }))} />
                <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
                <Field label="Topics (comma-separated)" value={form.topics} onChange={v => setForm(p => ({ ...p, topics: v }))} />
                <Field label="Hours (e.g. 4–6 hrs)" value={form.hours} onChange={v => setForm(p => ({ ...p, hours: v }))} />
                <Field label="URL" value={form.url} onChange={v => setForm(p => ({ ...p, url: v }))} />
                <Field label="Order (sort position)" type="number" value={form.order} onChange={v => setForm(p => ({ ...p, order: parseInt(v) }))} />
              </>}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModal(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </Modal>
        )}
        {deleteTarget && (
          <ConfirmDelete label={deleteTarget.label} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-semibold text-sm text-foreground capitalize">
              {navItems.find(n => n.id === active)?.label ?? 'Admin'}
            </h1>
          </div>
          <span className="text-xs bg-orange-50 text-primary border border-orange-200 px-3 py-1 rounded-full font-semibold">Admin Console</span>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">

          {/* ── OVERVIEW ── */}
          {active === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map(s => (
                  <button key={s.id} onClick={() => navigate(s.id)}
                    className="bg-white border border-border rounded-xl px-4 py-4 text-left hover:border-primary/30 hover:shadow-sm transition-all group">
                    <div className="text-2xl font-serif text-foreground mb-1">{s.value}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{s.label}</div>
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-semibold text-foreground mb-4">Quick actions</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { label: 'Post Announcement', action: () => { navigate('announcements'); openCreate('announcement', { published: true, urgent: false }); } },
                    { label: 'Add Workshop', action: () => { navigate('workshops'); openCreate('workshop', { status: 'upcoming' }); } },
                    { label: 'Upload Resource', action: () => { navigate('resources'); openCreate('resource', { public: false }); } },
                    { label: 'Add Ranking Entry', action: () => { navigate('rankings'); openCreate('ranking', { visible: true, stage: 'qualifiers', year: '2026' }); } },
                    { label: 'Add Chapter', action: () => { navigate('chapters'); openCreate('chapter', { status: 'active' }); } },
                    { label: 'Add Timeline Event', action: () => { navigate('competition'); openCreate('competitionEvent', { status: 'future', order: competitionEvents.length + 1 }); } },
                    { label: 'Add Curriculum Unit', action: () => { navigate('curriculum'); openCreate('curriculumUnit', { order: curriculumUnits.length + 1, url: 'https://usaeo.org/curriculum' }); } },
                  ].map(q => (
                    <button key={q.label} onClick={q.action}
                      className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl text-sm text-foreground hover:border-primary/30 hover:bg-muted/30 transition-all text-left">
                      <Plus className="w-4 h-4 text-primary flex-shrink-0" /> {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {active === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Announcements</h2>
                <button onClick={() => openCreate('announcement', { published: true, urgent: false })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New announcement
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                {announcements.length === 0 && <p className="p-6 text-sm text-muted-foreground">No announcements yet.</p>}
                {announcements.map(a => (
                  <div key={a.id} className="flex items-start gap-4 p-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{a.title}</p>
                        {a.urgent && <span className="text-xs font-semibold text-primary bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">Urgent</span>}
                        {!a.published && <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">Draft</span>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => openEdit('announcement', a)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Announcement, id: a.id, label: a.title })}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WORKSHOPS ── */}
          {active === 'workshops' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Workshops</h2>
                <button onClick={() => openCreate('workshop', { status: 'upcoming' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New workshop
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                {workshops.length === 0 && <p className="p-6 text-sm text-muted-foreground">No workshops yet.</p>}
                {workshops.map(w => (
                  <div key={w.id} className="flex items-start gap-4 p-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{w.title}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${w.status === 'upcoming' ? 'bg-orange-50 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{w.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{w.date} · {w.time} · {w.instructor}</p>
                      {w.zoom_link && <p className="text-xs text-primary mt-1">Zoom: {w.zoom_link}</p>}
                      {w.recording_url && <p className="text-xs text-primary mt-1">Recording: {w.recording_url}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => openEdit('workshop', w)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Workshop, id: w.id, label: w.title })}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESOURCES ── */}
          {active === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Resources</h2>
                <button onClick={() => openCreate('resource', { public: false })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add resource
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                {resources.length === 0 && <p className="p-6 text-sm text-muted-foreground">No resources yet.</p>}
                {resources.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-5">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.file_type} · {r.file_size} · {r.tag}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${r.public ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-muted text-muted-foreground border border-border'}`}>
                      {r.public ? 'Public' : 'Registered only'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit('resource', r)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Resource, id: r.id, label: r.title })}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RANKINGS ── */}
          {active === 'rankings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Rankings</h2>
                <button onClick={() => openCreate('ranking', { visible: true, stage: 'qualifiers', year: '2026' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add entry
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                {rankings.length === 0 && <p className="p-6 text-sm text-muted-foreground">No rankings yet.</p>}
                {rankings.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground flex-shrink-0">{r.rank}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{r.student_name}</p>
                      <p className="text-xs text-muted-foreground">{r.school} · {r.state} · {r.stage} · {r.year}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{r.score}</span>
                    <button onClick={() => base44.entities.Ranking.update(r.id, { visible: !r.visible }).then(loadAll)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      {r.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => openEdit('ranking', r)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ entity: base44.entities.Ranking, id: r.id, label: r.student_name })}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAPTERS ── */}
          {active === 'chapters' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Chapter Management</h2>
                <button onClick={() => openCreate('chapter', { status: 'active' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add chapter
                </button>
              </div>

              {chapters.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-border">
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{c.school}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : c.status === 'pending' ? 'bg-orange-50 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.city}, {c.state} · Founder: {c.founder_name} ({c.founder_email}) · {c.member_count} members · Code: <span className="font-mono font-semibold text-foreground">{c.invite_code}</span></p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => { setSelectedChapter(c); loadChapterDetails(c.id); }}
                        className="px-3 py-1.5 border border-border rounded-lg text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Manage
                      </button>
                      <button onClick={() => openEdit('chapter', c)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Chapter, id: c.id, label: c.school })}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* Expanded chapter details */}
                  {selectedChapter?.id === c.id && (
                    <div className="border-t border-border p-5 grid md:grid-cols-2 gap-6 bg-muted/20">
                      {/* Members */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Members ({(chapterMembers[c.id] || []).filter(m => m.status === 'active').length})</p>
                        {(chapterMembers[c.id] || []).filter(m => m.status === 'active').length === 0 && (
                          <p className="text-sm text-muted-foreground">No members yet.</p>
                        )}
                        <div className="space-y-2">
                          {(chapterMembers[c.id] || []).filter(m => m.status === 'active').map(m => (
                            <div key={m.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-primary">{m.user_name?.[0] ?? '?'}</div>
                                <div>
                                  <p className="text-sm text-foreground">{m.user_name || m.user_email}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                                </div>
                              </div>
                              {m.role !== 'founder' && (
                                <button onClick={() => removeMember(m)}
                                  className="text-xs text-destructive hover:underline">Remove</button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chapter Announcements */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Chapter Announcements</p>
                          <button onClick={() => { setForm({ chapter_id: c.id }); setModal({ type: 'chapterAnn', data: null }); }}
                            className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                        </div>
                        {(chapterAnns[c.id] || []).length === 0 && <p className="text-sm text-muted-foreground">No announcements.</p>}
                        <div className="space-y-2">
                          {(chapterAnns[c.id] || []).map(a => (
                            <div key={a.id} className="border border-border rounded-lg p-3 flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-sm text-foreground">{a.title}</p>
                                <p className="text-xs text-muted-foreground">{a.body}</p>
                              </div>
                              <button onClick={() => setDeleteTarget({ entity: base44.entities.ChapterAnnouncement, id: a.id, label: a.title })}
                                className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── COMPETITION ── */}
          {active === 'competition' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Competition Timeline</h2>
                <button onClick={() => openCreate('competitionEvent', { status: 'future', order: competitionEvents.length + 1 })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add event
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                {competitionEvents.length === 0 && <p className="p-6 text-sm text-muted-foreground">No timeline events yet.</p>}
                {competitionEvents.map(e => (
                  <div key={e.id} className="flex items-center gap-4 p-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.status === 'done' ? 'bg-green-500' : e.status === 'current' ? 'bg-primary' : 'bg-border'}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{e.phase}</p>
                      <p className="text-xs text-muted-foreground">{e.date} · order {e.order}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.status === 'done' ? 'bg-green-50 text-green-700 border border-green-200' : e.status === 'current' ? 'bg-orange-50 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{e.status}</span>
                    <button onClick={() => openEdit('competitionEvent', e)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ entity: base44.entities.CompetitionEvent, id: e.id, label: e.phase })}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CURRICULUM ── */}
          {active === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Curriculum Units</h2>
                <button onClick={() => openCreate('curriculumUnit', { order: curriculumUnits.length + 1, url: 'https://usaeo.org/curriculum' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add unit
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border">
                {curriculumUnits.length === 0 && <p className="p-6 text-sm text-muted-foreground">No curriculum units yet.</p>}
                {curriculumUnits.map(u => (
                  <div key={u.id} className="flex items-center gap-4 p-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground flex-shrink-0">{u.unit_number}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{u.title}</p>
                      <p className="text-xs text-muted-foreground">{u.topics}{u.hours ? ` · ${u.hours}` : ''}</p>
                    </div>
                    <button onClick={() => openEdit('curriculumUnit', u)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ entity: base44.entities.CurriculumUnit, id: u.id, label: u.title })}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

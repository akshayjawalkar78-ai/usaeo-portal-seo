import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bell, Calendar, FileText, School, BarChart2,
  ChevronRight, Plus, Pencil, Trash2, X, Check, AlertTriangle,
  Users, Menu, Eye, EyeOff, Upload, Trophy, BookOpen, ClipboardList, ShieldCheck, Download,
  Lock, Unlock, Crown, TrendingUp, Newspaper, Copy, Mail,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/supabaseClient';
import { UPCOMING_PARTNER_EVENTS, PARTNER_WORKSHOPS } from '@/lib/partnerEventsSeed';
import AdminEditWebsite from './AdminEditWebsite';
import AdminAnalytics from './AdminAnalytics';
import AdminNews from './AdminNews';
import SoloRegistrantsPanel from './SoloRegistrantsPanel';

const navItems = [
  { label: 'Overview', id: 'overview', icon: LayoutDashboard },
  { label: 'Announcements', id: 'announcements', icon: Bell },
  { label: 'Workshops', id: 'workshops', icon: Calendar },
  { label: 'Resources', id: 'resources', icon: FileText },
  { label: 'Rankings', id: 'rankings', icon: BarChart2 },
  { label: 'Chapters', id: 'chapters', icon: School },
  { label: 'Competition', id: 'competition', icon: Trophy },
  { label: 'Curriculum', id: 'curriculum', icon: BookOpen },
  { label: 'Registrations', id: 'registrations', icon: ClipboardList },
  { label: 'QB Teams', id: 'qb-teams', icon: Users },
  { label: 'Applications', id: 'applications', icon: ShieldCheck },
  { label: 'News', id: 'news', icon: Newspaper },
  { label: 'Edit Website', id: 'edit-website', icon: Pencil },
];

const ECON_TEAM_NAMES = [
  'Invisible Hand','Nash Equilibrium','Keynesian Crusaders','Supply Siders','The Marginalists',
  'Rational Actors','Pareto Optimizers','The Arbitrageurs','Comparative Advantage','The Elastics',
  'Marginal Revolution','Creative Destroyers','The Multipliers','Market Makers','The Equilibrium',
  'Fiscal Hawks','The Monetarists','Opportunity Costs','The Ricardians','Coase Theorem',
  'The Externalities','Game Theorists','Austrian School','Chicago School','The Laissez-Faire',
  'Price Discoverers','The Oligopolists','Moral Hazard','Deadweight Avoiders','The Incentivists',
];
function randomEconTeamName() {
  const base = ECON_TEAM_NAMES[Math.floor(Math.random() * ECON_TEAM_NAMES.length)];
  return `${base} ${Math.floor(Math.random() * 90 + 10)}`;
}

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
  const [active, setActive] = useState(() => {
    try { return localStorage.getItem('admin.activeTab') || 'overview'; } catch { return 'overview'; }
  });
  useEffect(() => {
    try { localStorage.setItem('admin.activeTab', active); } catch {}
  }, [active]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [announcements, setAnnouncements] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [resources, setResources] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [competitionEvents, setCompetitionEvents] = useState([]);
  const [curriculumUnits, setCurriculumUnits] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [qbTeams, setQbTeams] = useState([]);
  const [qbTeamMembers, setQbTeamMembers] = useState({}); // teamId â†' members[]
  const [expandedQBTeam, setExpandedQBTeam] = useState(null);
  const [chapterMembers, setChapterMembers] = useState({});
  const [chapterAnns, setChapterAnns] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [assignAdminEmail, setAssignAdminEmail] = useState('');
  const [regFilter, setRegFilter] = useState('all');
  const [dupExportModal, setDupExportModal] = useState(null); // { filtered, dupIds, filteredDupIds }
  const [colFilters, setColFilters] = useState({ name: '', email: '', event: '', eventType: 'all', school: '', state: '', date: '' });
  const [showDupsOnly, setShowDupsOnly] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [backfillStatus, setBackfillStatus] = useState('idle'); // idle | running | done
  const [backfillLog, setBackfillLog] = useState([]);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Modal states
  const [modal, setModal] = useState(null); // { type, data }
  const [deleteTarget, setDeleteTarget] = useState(null); // { entity, id, label }
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    const [a, w, r, rk, ch, ce, cu, reg, apps, qbt] = await Promise.all([
      base44.entities.Announcement.list('-created_date'),
      base44.entities.Workshop.list('-created_date'),
      base44.entities.Resource.list(),
      base44.entities.Ranking.list('rank'),
      base44.entities.Chapter.list(),
      base44.entities.CompetitionEvent.list('order'),
      base44.entities.CurriculumUnit.list('order'),
      base44.entities.EventRegistration.list('-registered_at'),
      base44.entities.Application?.list('-created_at').catch(() => []) ?? [],
      base44.entities.QuizBowlTeam.list('-created_at').catch(() => []),
    ]);
    setAnnouncements(a); setWorkshops(w); setResources(r); setRankings(rk); setChapters(ch);
    setCompetitionEvents(ce); setCurriculumUnits(cu); setRegistrations(reg); setApplications(apps);
    setQbTeams(qbt);
  };

  const loadQBTeamMembers = async (teamId) => {
    const members = await base44.entities.QuizBowlTeamMember.filter({ team_id: teamId });
    setQbTeamMembers(prev => ({ ...prev, [teamId]: members }));
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
    try {
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
      // rankings: team_name NOT NULL, derive from student_name if not provided
      const payload = type === 'ranking'
        ? { ...form, team_name: form.team_name || form.student_name || form.school || 'Individual' }
        : form;
      if (data?.id) await entity.update(data.id, payload);
      else await entity.create(payload);
      setModal(null);
      await loadAll();
      if (selectedChapter) loadChapterDetails(selectedChapter.id);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed: ' + (err?.message || 'Unknown error. Check console.'));
    } finally {
      setSaving(false);
    }
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
    { label: 'Registrations', value: registrations.length, id: 'registrations' },
  ];

  const exportRegistrationsCSV = (rows) => {
    const headers = ['Name', 'Email', 'Event', 'Type', 'School', 'Grade', 'State', 'Registered At', 'Status'];
    const lines = [
      headers.join(','),
      ...rows.map(r => [
        r.user_name || '',
        r.user_email || '',
        r.event_name || '',
        r.event_type || '',
        r.school || '',
        r.grade || '',
        r.state || '',
        r.registered_at ? new Date(r.registered_at).toLocaleDateString() : '',
        r.status || '',
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${regFilter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navigate = (id) => { setActive(id); setSidebarOpen(false); };

  // Solo QB panel — computed from state, no IIFE in JSX
  const soloTeams = qbTeams.filter(t => (qbTeamMembers[t.id] || []).filter(m => m.status === 'active').length <= 1);
  const soloEmails = [...new Set(soloTeams.map(t => t.captain_email).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#f9f9f8] flex font-inter">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-14 flex items-center px-5 border-b border-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-6 w-6"  loading="lazy" decoding="async" />
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
                <Field label="Student Email (links to their dashboard)" type="email" value={form.user_email} onChange={v => setForm(p => ({ ...p, user_email: v }))} />
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
        {dupExportModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">Duplicate Registrations Found</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{dupExportModal.filteredDupIds.length} duplicate{dupExportModal.filteredDupIds.length !== 1 ? 's' : ''}</strong> detected in the current view, same email registered for the same event more than once.
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Removing keeps the <strong>earliest</strong> registration per email + event type and permanently deletes the rest.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={async () => {
                  for (const id of dupExportModal.filteredDupIds) {
                    await base44.entities.EventRegistration.delete(id);
                  }
                  await loadAll();
                  setDupExportModal(null);
                  const cleaned = dupExportModal.filtered.filter(r => !dupExportModal.dupIds.has(r.id));
                  exportRegistrationsCSV(cleaned);
                }} className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">
                  Remove {dupExportModal.filteredDupIds.length} duplicate{dupExportModal.filteredDupIds.length !== 1 ? 's' : ''} &amp; export
                </button>
                <button onClick={() => { exportRegistrationsCSV(dupExportModal.filtered); setDupExportModal(null); }}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                  Export anyway (with duplicates)
                </button>
                <button onClick={() => setDupExportModal(null)}
                  className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
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
          <span className="text-xs bg-primary/5 text-primary border border-orange-200 px-3 py-1 rounded-full font-semibold">Admin Console</span>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">

          {/* â”€â”€ OVERVIEW â”€â”€ */}
          {active === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map(s => (
                  <button key={s.id} onClick={() => navigate(s.id)}
                    className="bg-white border border-border rounded-xl px-4 py-4 text-left hover:border-primary/30 hover:shadow-sm transition-all group">
                    <div className="text-2xl font-sans text-foreground mb-1">{s.value}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{s.label}</div>
                  </button>
                ))}
              </div>
              {/* Partner Events */}
              {(UPCOMING_PARTNER_EVENTS.length > 0 || PARTNER_WORKSHOPS.length > 0) && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-semibold text-foreground mb-1">Partner Events</h2>
                  <p className="text-xs text-muted-foreground mb-4">Upcoming events from partner organizations. These are static and managed in <code className="bg-muted px-1 rounded">partnerEventsSeed.js</code>.</p>
                  <div className="space-y-2">
                    {UPCOMING_PARTNER_EVENTS.map(e => (
                      <div key={e.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            {e.partnerLogo && <img src={e.partnerLogo} alt={e.partnerShort} className="h-5 w-auto max-w-[24px] object-contain opacity-70"  loading="lazy" decoding="async" />}
                            <p className="font-medium text-sm text-foreground">{e.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{e.partner} · {e.category} · {e.date}</p>
                        </div>
                        <a href={e.externalUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-semibold text-primary hover:underline flex-shrink-0 ml-4">
                          {e.partnerShort} ↗
                        </a>
                      </div>
                    ))}
                    {PARTNER_WORKSHOPS.slice(0, 2).map(w => (
                      <div key={w.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3 opacity-70">
                        <div>
                          <div className="flex items-center gap-2">
                            {w.partnerLogo && <img src={w.partnerLogo} alt={w.partnerShort} className="h-5 w-auto max-w-[24px] object-contain opacity-70"  loading="lazy" decoding="async" />}
                            <p className="font-medium text-sm text-foreground">{w.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{w.partner} · Partner Workshop · {w.date}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">Past</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

          {/* â”€â”€ ANNOUNCEMENTS â”€â”€ */}
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
                        {a.urgent && <span className="text-xs font-semibold text-primary bg-primary/5 border border-orange-200 px-2 py-0.5 rounded-full">Urgent</span>}
                        {!a.published && <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">Draft</span>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => openEdit('announcement', a)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Announcement, id: a.id, label: a.title })}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ WORKSHOPS â”€â”€ */}
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
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${w.status === 'upcoming' ? 'bg-primary/5 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{w.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{w.date} · {w.time} · {w.instructor}</p>
                      {w.zoom_link && <p className="text-xs text-primary mt-1">Zoom: {w.zoom_link}</p>}
                      {w.recording_url && <p className="text-xs text-primary mt-1">Recording: {w.recording_url}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => openEdit('workshop', w)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Workshop, id: w.id, label: w.title })}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ RESOURCES â”€â”€ */}
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
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${r.public ? 'bg-success/10 text-success border border-green-200' : 'bg-muted text-muted-foreground border border-border'}`}>
                      {r.public ? 'Public' : 'Registered only'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit('resource', r)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ entity: base44.entities.Resource, id: r.id, label: r.title })}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ RANKINGS â”€â”€ */}
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
                      className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ CHAPTERS â”€â”€ */}
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
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-success/10 text-success border border-green-200' : c.status === 'pending' ? 'bg-primary/5 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{c.status}</span>
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
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
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

                      {/* Assign Chapter Admin */}
                      <div className="md:col-span-2 border-t border-border pt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Assign Chapter Admin</p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="user@email.com"
                            value={assignAdminEmail}
                            onChange={e => setAssignAdminEmail(e.target.value)}
                            className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          />
                          <button
                            onClick={async () => {
                              if (!assignAdminEmail.trim()) return;
                              try {
                                const existing = (chapterMembers[c.id] || []).find(m => m.user_email === assignAdminEmail.trim());
                                if (existing) {
                                  await supabase.from('chapter_members').update({ role: 'chapter_admin' }).eq('id', existing.id);
                                } else {
                                  await supabase.from('chapter_members').insert({ chapter_id: c.id, user_email: assignAdminEmail.trim(), role: 'chapter_admin', status: 'active' });
                                }
                                setAssignAdminEmail('');
                                loadChapterDetails(c.id);
                              } catch (err) {
                                alert('Failed: ' + err.message);
                              }
                            }}
                            className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Assign
                          </button>
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
                                className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
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

          {/* â”€â”€ COMPETITION â”€â”€ */}
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
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.status === 'done' ? 'bg-success/100' : e.status === 'current' ? 'bg-primary' : 'bg-border'}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{e.phase}</p>
                      <p className="text-xs text-muted-foreground">{e.date} · order {e.order}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.status === 'done' ? 'bg-success/10 text-success border border-green-200' : e.status === 'current' ? 'bg-primary/5 text-primary border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{e.status}</span>
                    <button onClick={() => openEdit('competitionEvent', e)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ entity: base44.entities.CompetitionEvent, id: e.id, label: e.phase })}
                      className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ CURRICULUM â”€â”€ */}
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
                      className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ REGISTRATIONS â”€â”€ */}
          {active === 'registrations' && (() => {
            const nonChapter = registrations.filter(r => r.event_type !== 'chapter');

            // Detect duplicates: same email + event_type â†' keep earliest, mark rest as dup
            const groupMap = {};
            nonChapter.forEach(r => {
              const key = `${r.user_email}::${r.event_type}`;
              if (!groupMap[key]) groupMap[key] = [];
              groupMap[key].push(r);
            });
            const dupIds = new Set();
            const originalIds = new Set();
            const dupReasons = {};
            Object.values(groupMap).forEach(group => {
              if (group.length > 1) {
                const sorted = [...group].sort((a, b) => new Date(a.registered_at) - new Date(b.registered_at));
                originalIds.add(sorted[0].id);
                sorted.slice(1).forEach(r => {
                  dupIds.add(r.id);
                  dupReasons[r.id] = `Duplicate: ${sorted[0].user_name || sorted[0].user_email} registered for ${r.event_type} on ${new Date(sorted[0].registered_at).toLocaleDateString()} (kept). This entry registered ${new Date(r.registered_at).toLocaleDateString()}.`;
                });
              }
            });
            const dupGroupIds = new Set([...originalIds, ...dupIds]);

            // Apply filters
            let filtered = nonChapter;
            if (regFilter !== 'all') filtered = filtered.filter(r => r.event_type === regFilter);
            if (colFilters.name) filtered = filtered.filter(r => (r.user_name || '').toLowerCase().includes(colFilters.name.toLowerCase()));
            if (colFilters.email) filtered = filtered.filter(r => (r.user_email || '').toLowerCase().includes(colFilters.email.toLowerCase()));
            if (colFilters.event) filtered = filtered.filter(r => (r.event_name || '').toLowerCase().includes(colFilters.event.toLowerCase()));
            if (colFilters.eventType !== 'all') filtered = filtered.filter(r => r.event_type === colFilters.eventType);
            if (colFilters.school) filtered = filtered.filter(r => (r.school || '').toLowerCase().includes(colFilters.school.toLowerCase()));
            if (colFilters.state) filtered = filtered.filter(r => (r.state || '').toLowerCase().includes(colFilters.state.toLowerCase()));
            if (colFilters.date) filtered = filtered.filter(r => r.registered_at && new Date(r.registered_at).toLocaleDateString().includes(colFilters.date));
            if (showDupsOnly) {
              filtered = filtered.filter(r => dupGroupIds.has(r.id));
              filtered = [...filtered].sort((a, b) => {
                const ka = `${a.user_email}::${a.event_type}`;
                const kb = `${b.user_email}::${b.event_type}`;
                if (ka !== kb) return ka.localeCompare(kb);
                return new Date(a.registered_at) - new Date(b.registered_at);
              });
            }

            const hasColFilters = colFilters.name || colFilters.email || colFilters.event || colFilters.eventType !== 'all' || colFilters.school || colFilters.state || colFilters.date;
            const filteredDupIds = filtered.filter(r => dupIds.has(r.id)).map(r => r.id);
            const dupCount = filteredDupIds.length;
            const setCol = col => e => setColFilters(f => ({ ...f, [col]: e.target.value }));

            const handleExportClick = () => {
              if (dupCount > 0) {
                setDupExportModal({ filtered, dupIds, filteredDupIds });
              } else {
                exportRegistrationsCSV(filtered);
              }
            };

            const inputCls = 'w-full border border-border rounded-md px-2 py-1 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary';

            return (
              <div className="space-y-4">
                {showAnalytics && <AdminAnalytics registrations={nonChapter} onClose={() => setShowAnalytics(false)} />}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-foreground">Event Registrations</h2>
                    <span className="text-sm text-muted-foreground">{filtered.length} of {nonChapter.length}</span>
                    {dupCount > 0 && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {dupCount} dup{dupCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex bg-muted rounded-lg p-1 gap-1">
                      {[{ id: 'all', label: 'All' }, { id: 'quiz-bowl', label: 'Quiz Bowl' }, { id: 'essay', label: 'Essay' }].map(f => (
                        <button key={f.id} onClick={() => setRegFilter(f.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${regFilter === f.id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowDupsOnly(v => !v)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${showDupsOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-border text-foreground hover:bg-muted'}`}>
                      <AlertTriangle className="w-3.5 h-3.5" /> {showDupsOnly ? 'Show all' : 'Dups only'}
                    </button>
                    <button onClick={() => setShowAnalytics(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                      <TrendingUp className="w-3.5 h-3.5" /> Analytics
                    </button>
                    {hasColFilters && (
                      <button onClick={() => setColFilters({ name: '', email: '', event: '', eventType: 'all', school: '', state: '', date: '' })}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-3 h-3" /> Clear filters
                      </button>
                    )}
                    <button onClick={handleExportClick}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  {filtered.length === 0 && (
                    <p className="p-6 text-sm text-muted-foreground">
                      {hasColFilters || showDupsOnly ? 'No registrations match the current filters.' : `No registrations${regFilter !== 'all' ? ` for ${regFilter}` : ''} yet.`}
                    </p>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Event</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">School</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">State</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                          <th className="sticky right-0 bg-muted/30 px-4 py-3 w-12 shadow-[-1px_0_0_0_#e5e7eb]"></th>
                        </tr>
                        <tr className="border-b border-border bg-white">
                          <th className="px-3 py-2"><input value={colFilters.name} onChange={setCol('name')} placeholder="Search..." className={inputCls} /></th>
                          <th className="px-3 py-2"><input value={colFilters.email} onChange={setCol('email')} placeholder="Search..." className={inputCls} /></th>
                          <th className="px-3 py-2"><input value={colFilters.event} onChange={setCol('event')} placeholder="Search..." className={inputCls} /></th>
                          <th className="px-3 py-2">
                            <select value={colFilters.eventType} onChange={setCol('eventType')} className={`${inputCls} bg-white`}>
                              <option value="all">All types</option>
                              <option value="quiz-bowl">Quiz Bowl</option>
                              <option value="essay">Essay</option>
                            </select>
                          </th>
                          <th className="px-3 py-2"><input value={colFilters.school} onChange={setCol('school')} placeholder="Search..." className={inputCls} /></th>
                          <th className="px-3 py-2"><input value={colFilters.state} onChange={setCol('state')} placeholder="Search..." className={inputCls} /></th>
                          <th className="px-3 py-2"><input value={colFilters.date} onChange={setCol('date')} placeholder="MM/DD/YY..." className={inputCls} /></th>
                          <th className="sticky right-0 bg-white shadow-[-1px_0_0_0_#e5e7eb] px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filtered.map(r => {
                          const isDup = dupIds.has(r.id);
                          const isOriginalInGroup = showDupsOnly && originalIds.has(r.id);
                          return (
                            <tr key={r.id}
                              title={isDup ? dupReasons[r.id] : undefined}
                              className={`group transition-colors ${isDup ? 'bg-amber-50 hover:bg-amber-100' : isOriginalInGroup ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-muted/20'}`}>
                              <td className="px-4 py-3 font-medium text-foreground">
                                <span className="flex items-center gap-1.5">
                                  {isDup && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                                  {r.user_name || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{r.user_email}</td>
                              <td className="px-4 py-3 text-foreground">{r.event_name || '—'}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.event_type === 'quiz-bowl' ? 'bg-blue-50 text-blue-700 border border-blue-200' : r.event_type === 'essay' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-primary/5 text-primary border border-orange-200'}`}>
                                  {r.event_type || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{r.school || '—'}</td>
                              <td className="px-4 py-3 text-muted-foreground">{r.state || '—'}</td>
                              <td className="px-4 py-3 text-muted-foreground text-xs">{r.registered_at ? new Date(r.registered_at).toLocaleDateString() : '—'}</td>
                              <td className={`sticky right-0 px-4 py-3 text-right shadow-[-1px_0_0_0_#e5e7eb] ${isDup ? 'bg-amber-50 group-hover:bg-amber-100' : isOriginalInGroup ? 'bg-blue-50/40 group-hover:bg-blue-50' : 'bg-white group-hover:bg-muted/20'}`}>
                                <button onClick={() => setDeleteTarget({ entity: base44.entities.EventRegistration, id: r.id, label: r.user_name || r.user_email })}
                                  className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* â”€â”€ QB TEAMS â”€â”€ */}
          {active === 'qb-teams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Quiz Bowl Teams</h2>
                <span className="text-sm text-muted-foreground">{qbTeams.length} teams</span>
              </div>
              {qbTeams.length === 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <p className="text-sm text-muted-foreground">No teams yet.</p>
                </div>
              )}
              {qbTeams.map(team => {
                const members = qbTeamMembers[team.id] || [];
                const activeCount = members.filter(m => m.status === 'active').length;
                const isExpanded = expandedQBTeam === team.id;
                return (
                  <div key={team.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                    <div className="flex items-center gap-4 p-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{team.team_name}</p>
                          {team.locked
                            ? <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                            : <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2 py-0.5 rounded-full">Open</span>
                          }
                          {activeCount >= 3 && <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Ready</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Captain: {team.captain_email} · {activeCount} active member{activeCount !== 1 ? 's' : ''}
                          {team.school ? ` · ${team.school}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={async () => {
                          await base44.entities.QuizBowlTeam.update(team.id, { locked: !team.locked });
                          loadAll();
                        }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${team.locked ? 'border-green-200 bg-success/10 text-success hover:bg-success/15' : 'border-border bg-muted text-foreground hover:bg-muted/70'}`}>
                          {team.locked ? <><Unlock className="w-3 h-3" /> Unlock</> : <><Lock className="w-3 h-3" /> Lock</>}
                        </button>
                        <button onClick={() => {
                          if (isExpanded) { setExpandedQBTeam(null); return; }
                          setExpandedQBTeam(team.id);
                          loadQBTeamMembers(team.id);
                        }} className="px-3 py-1.5 border border-border rounded-lg text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {isExpanded ? 'Hide' : 'Members'}
                        </button>
                        <button onClick={() => setDeleteTarget({ entity: base44.entities.QuizBowlTeam, id: team.id, label: team.team_name })}
                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border p-5 bg-muted/10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Members ({members.length})</p>
                        {members.length === 0 && <p className="text-sm text-muted-foreground">No members.</p>}
                        <div className="space-y-2">
                          {members.map(m => (
                            <div key={m.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-primary">
                                  {(m.user_name || m.user_email)?.[0]?.toUpperCase() ?? '?'}
                                </div>
                                <div>
                                  <p className="text-sm text-foreground">{m.user_name || m.user_email}</p>
                                  <p className="text-xs text-muted-foreground">{m.user_email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {m.role === 'captain' && <span className="text-xs font-semibold text-primary flex items-center gap-1"><Crown className="w-3 h-3" /> Captain</span>}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-success/10 text-success border border-green-200' : m.status === 'pending' ? 'bg-primary/5 text-orange-700 border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>
                                  {m.status}
                                </span>
                                {!team.locked && (
                                  <button onClick={async () => {
                                    await base44.entities.QuizBowlTeamMember.delete(m.id);
                                    loadQBTeamMembers(team.id);
                                    loadAll();
                                  }} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Solo registrants panel */}
              <SoloRegistrantsPanel
                soloEmails={soloEmails}
                copiedEmails={copiedEmails}
                setCopiedEmails={setCopiedEmails}
                backfillStatus={backfillStatus}
                setBackfillStatus={setBackfillStatus}
                backfillLog={backfillLog}
                setBackfillLog={setBackfillLog}
                registrations={registrations}
                loadAll={loadAll}
              />
            </div>
          )}

          {/* â”€â”€ APPLICATIONS â”€â”€ */}
          {active === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Applications</h2>
                <span className="text-sm text-muted-foreground">{applications.length} total</span>
              </div>
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                {applications.length === 0 && <p className="p-6 text-sm text-muted-foreground">No applications yet.</p>}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Program</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Details</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {applications.map(a => (
                        <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{a.user_name || '—'}</td>
                          <td className="px-4 py-3 text-muted-foreground">{a.user_email}</td>
                          <td className="px-4 py-3 text-foreground capitalize">{a.program}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{a.payload?.school ? `${a.payload.school}${a.payload.state ? `, ${a.payload.state}` : ''}` : '—'}</td>
                          <td className="px-4 py-3">
                            <select value={a.status || 'pending'} onChange={async e => {
                              await base44.entities.Application.update(a.id, { status: e.target.value });
                              loadAll();
                            }} className="text-xs border border-border rounded-lg px-2 py-1 bg-white">
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => setDeleteTarget({ entity: base44.entities.Application, id: a.id, label: a.user_name || a.user_email })}
                              className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ NEWS â”€â”€ */}
          {active === 'news' && <AdminNews />}

          {/* â”€â”€ EDIT WEBSITE â”€â”€ */}
          {active === 'edit-website' && <AdminEditWebsite />}

        </main>
      </div>
    </div>
  );
}

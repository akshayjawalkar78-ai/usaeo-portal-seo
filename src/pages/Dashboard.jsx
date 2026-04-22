import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, BookOpen, Calendar, CalendarDays, Users, FileText, ExternalLink,
  Bell, CheckCircle, Clock, ArrowRight, Lock,
  LayoutDashboard, Menu, ChevronRight, School, BarChart2, X
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { label: 'Overview', id: 'overview', icon: LayoutDashboard },
  { label: 'Competition', id: 'competition', icon: Trophy },
  { label: 'Rankings', id: 'rankings', icon: BarChart2 },
  { label: 'Calendar', id: 'calendar', icon: CalendarDays },
  { label: 'Resources', id: 'resources', icon: FileText },
  { label: 'Workshops', id: 'workshops', icon: Calendar },
  { label: 'Curriculum', id: 'curriculum', icon: BookOpen },
  { label: 'Chapters', id: 'chapters', icon: School },
];


export default function Dashboard() {
  const { user: authUser, profile } = useAuth();
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
  const [myChapter, setMyChapter] = useState(null);
  const [chapterMembers, setChapterMembers] = useState([]);
  const [chapterAnnouncements, setChapterAnnouncements] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [rankStage, setRankStage] = useState('qualifiers');
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    base44.entities.Announcement.filter({ published: true }, '-created_date').then(setAnnouncements);
    base44.entities.Workshop.list('-date').then(setWorkshops);
    base44.entities.Resource.list().then(setResources);
    base44.entities.Ranking.filter({ visible: true }, 'rank').then(setRankings);
    base44.entities.Chapter.filter({ status: 'active' }).then(setChapters);
    base44.entities.CompetitionEvent.list('order').then(setCompetitionEvents);
    base44.entities.CurriculumUnit.list('order').then(setCurriculumUnits);
    if (authUser?.email) {
      base44.entities.EventRegistration.filter({ user_email: authUser.email }).then(setMyRegistrations);
    }
  }, [authUser?.email]);

  const upcomingWorkshops = workshops.filter(w => w.status === 'upcoming');
  const pastWorkshops = workshops.filter(w => w.status === 'past');
  const filteredRankings = rankings.filter(r => r.stage === rankStage);

  const handleJoinChapter = async () => {
    setJoinError(''); setJoinSuccess('');
    const chapter = chapters.find(c => c.invite_code?.toLowerCase() === joinCode.trim().toLowerCase());
    if (!chapter) { setJoinError('Invalid invite code. Check with your chapter founder.'); return; }
    if (!authUser) { setJoinError('You must be logged in.'); return; }
    const email = authUser.email;
    const fullName = profile?.full_name || '';
    const existing = await base44.entities.ChapterMember.filter({ chapter_id: chapter.id, user_email: email });
    if (existing.length > 0) { setJoinError('You are already a member of this chapter.'); return; }
    await base44.entities.ChapterMember.create({ chapter_id: chapter.id, user_email: email, user_name: fullName, role: 'member', status: 'active' });
    await base44.entities.Chapter.update(chapter.id, { member_count: (chapter.member_count || 0) + 1 });
    setMyChapter(chapter);
    setJoinSuccess(`Successfully joined ${chapter.school} chapter!`);
    setJoinCode('');
    loadMyChapter(chapter.id);
  };

  const loadMyChapter = async (chapterId) => {
    const members = await base44.entities.ChapterMember.filter({ chapter_id: chapterId, status: 'active' });
    const anns = await base44.entities.ChapterAnnouncement.filter({ chapter_id: chapterId }, '-created_date');
    setChapterMembers(members);
    setChapterAnnouncements(anns);
  };

  const navigate = (id) => { setActive(id); setSidebarOpen(false); };

  return (
    <div className="min-h-screen bg-[#f9f9f8] flex font-inter">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-14 flex items-center px-5 border-b border-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://www.usaeo.org/USAEOlogo.png" alt="USAEO" className="h-6 w-6" />
            <span className="font-semibold text-sm text-foreground">USAEO</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-1">Dashboard</p>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${active === item.id ? 'bg-foreground text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
          <div className="pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">External</p>
            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground cursor-not-allowed select-none">
              <Lock className="w-4 h-4 flex-shrink-0" />
              Testing Portal
              <span className="ml-auto text-[10px] font-semibold bg-muted border border-border px-1.5 py-0.5 rounded-full">Soon</span>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/admin" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-3 h-3" /> Admin Console
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

      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-semibold text-sm text-foreground capitalize">
              {navItems.find(n => n.id === active)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <Link to="/register"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
            Register <ArrowRight className="w-3 h-3" />
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">

          {/* ── OVERVIEW ── */}
          {active === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'National Qualifiers', status: 'Closed', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
                  { label: 'Quiz Bowl', status: 'Open', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
                  { label: 'Essay Competition', status: 'Open', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
                  { label: 'National Finals', status: 'Upcoming — May 2026', color: 'text-primary', bg: 'bg-orange-50 border-orange-200' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.bg}`}>
                    <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                    <p className={`text-sm font-semibold ${s.color}`}>{s.status}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-5 gap-5">
                <div className="md:col-span-3 bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Bell className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-foreground text-sm">Announcements</h2>
                  </div>
                  <div className="space-y-3">
                    {announcements.length === 0 && <p className="text-sm text-muted-foreground">No announcements yet.</p>}
                    {announcements.map((a) => (
                      <div key={a.id} className={`p-4 rounded-xl ${a.urgent ? 'bg-orange-50 border border-orange-200' : 'border border-border'}`}>
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <p className="font-semibold text-sm text-foreground leading-snug">{a.title}</p>
                          {a.urgent && <span className="text-xs font-semibold text-primary bg-orange-100 px-2 py-0.5 rounded-full flex-shrink-0">Urgent</span>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-foreground rounded-2xl p-5">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Next milestone</p>
                    <h3 className="font-serif text-2xl text-white mb-1">National Finals</h3>
                    <p className="text-sm text-white/60 mb-4">May 2026 · In-person</p>
                    <Link to="/register"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
                      Register <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="bg-white rounded-2xl border border-border p-5">
                    <p className="font-semibold text-foreground text-sm mb-3">Quick links</p>
                    <div className="space-y-0.5">
                      {[
                        { label: 'Study Curriculum', id: 'curriculum' },
                        { label: 'Upcoming Workshops', id: 'workshops' },
                        { label: 'Resources & Downloads', id: 'resources' },
                        { label: 'Competition Timeline', id: 'competition' },
                        { label: 'Rankings', id: 'rankings' },
                        { label: 'Chapter Portal', id: 'chapters' },
                      ].map((q) => (
                        <button key={q.label} onClick={() => navigate(q.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-left">
                          {q.label} <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COMPETITION ── */}
          {active === 'competition' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="font-semibold text-foreground mb-2">Competition Timeline 2025–2026</h2>
                <p className="text-sm text-muted-foreground mb-8">Your full pathway from registration through the National Finals.</p>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {competitionEvents.length === 0 && <p className="text-sm text-muted-foreground">Timeline not yet published.</p>}
                    {competitionEvents.map((t) => (
                      <div key={t.id} className="relative flex gap-6 pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${t.status === 'done' ? 'bg-green-50 border-green-300' : t.status === 'current' ? 'bg-primary border-primary' : 'bg-white border-border'}`}>
                          {t.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                          {t.status === 'current' && <span className="w-2 h-2 rounded-full bg-white" />}
                          {t.status === 'future' && <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-3">
                            <p className={`font-semibold text-sm ${t.status === 'future' ? 'text-muted-foreground' : 'text-foreground'}`}>{t.phase}</p>
                            {t.status === 'current' && <span className="text-xs font-semibold text-primary bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">Current</span>}
                          </div>
                          <p className={`text-xs mt-0.5 ${t.status === 'done' ? 'text-green-600' : 'text-muted-foreground'}`}>{t.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">Quiz Bowl</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">Fast-paced timed quiz covering microeconomics, macroeconomics, and current events. Open to all registered students.</p>
                  <Link to="/competitions/quiz-bowl" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Register now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">Essay Competition</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">Submit a research essay on an economics topic. Judged on economic reasoning, evidence, and clarity of argument.</p>
                  <Link to="/competitions/essay" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Register now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">National Finals</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">In-person, full-day event in May 2026. Written exam + case study analysis. Top scorers selected as National Champions.</p>
                  <Link to="/competitions/finals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Full details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── RANKINGS ── */}
          {active === 'rankings' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-foreground">Competition Rankings</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">2025–2026 season</p>
                  </div>
                  <div className="flex bg-muted rounded-lg p-1 gap-1">
                    {['qualifiers', 'finals'].map((s) => (
                      <button key={s} onClick={() => setRankStage(s)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${rankStage === s ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredRankings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">Rankings for this stage have not been published yet.</p>
                ) : (
                  <div className="space-y-0 divide-y divide-border">
                    {filteredRankings.map((r) => (
                      <div key={r.id} className={`flex items-center gap-4 py-3.5 ${r.rank <= 3 ? 'bg-orange-50/50 -mx-2 px-2 rounded-lg' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${r.rank === 1 ? 'bg-yellow-100 text-yellow-700' : r.rank === 2 ? 'bg-gray-100 text-gray-600' : r.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-muted text-muted-foreground'}`}>
                          {r.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">{r.student_name}</p>
                          <p className="text-xs text-muted-foreground">{r.school} · {r.state}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-foreground">{r.score}</p>
                          <p className="text-xs text-muted-foreground">score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── RESOURCES ── */}
          {active === 'resources' && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h2 className="font-semibold text-foreground mb-1">Resources & Downloads</h2>
              <p className="text-sm text-muted-foreground mb-6">Public resources are available freely. Register to unlock all study materials.</p>
              <div className="divide-y divide-border">
                {resources.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.file_type} · {r.file_size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground hidden md:block">{r.tag}</span>
                      {r.public && r.file_url ? (
                        <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                          Download
                        </a>
                      ) : (
                        <Link to="/register"
                          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">
                          <Lock className="w-3 h-3" /> Register to access
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WORKSHOPS ── */}
          {active === 'workshops' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="font-semibold text-foreground mb-1">Upcoming Workshops</h2>
                <p className="text-sm text-muted-foreground mb-6">Expert-led sessions, free and open to all registered students. Held via Zoom.</p>
                {upcomingWorkshops.length === 0 && <p className="text-sm text-muted-foreground">No upcoming workshops scheduled.</p>}
                <div className="space-y-4">
                  {upcomingWorkshops.map((w) => (
                    <div key={w.id} className="border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-center flex-shrink-0 w-16">
                          <p className="text-base font-bold text-primary leading-tight">{w.date?.split(', ')[0]?.split(' ')[1]}</p>
                          <p className="text-xs text-primary/70">{w.date?.split(', ')[0]?.split(' ')[0]}</p>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-sm mb-1">{w.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{w.time} · {w.instructor}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                        </div>
                        {w.zoom_link ? (
                          <a href={w.zoom_link} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
                            Join Zoom
                          </a>
                        ) : (
                          <Link to="/register"
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 border border-border text-foreground rounded-full text-xs font-medium hover:border-foreground transition-colors">
                            RSVP
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {pastWorkshops.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-8">
                  <h2 className="font-semibold text-foreground mb-5">Past Workshops — Recordings</h2>
                  <div className="space-y-3">
                    {pastWorkshops.map((w) => (
                      <div key={w.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{w.title}</p>
                          <p className="text-xs text-muted-foreground">{w.date} · {w.instructor}</p>
                        </div>
                        {w.recording_url ? (
                          <a href={w.recording_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-semibold text-primary hover:underline">
                            Watch recording →
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">Recording pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CURRICULUM ── */}
          {active === 'curriculum' && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <h2 className="font-semibold text-foreground mb-1">Study Curriculum</h2>
              <p className="text-sm text-muted-foreground mb-6">Six units covering the full USAEO syllabus. Free for all students at usaeo.org/curriculum.</p>
              <div className="space-y-0 divide-y divide-border">
                {curriculumUnits.length === 0 && <p className="text-sm text-muted-foreground">Curriculum not yet published.</p>}
                {curriculumUnits.map((u) => (
                  <div key={u.id} className="flex items-center gap-5 py-4">
                    <span className="font-serif text-3xl text-orange-100 w-10 flex-shrink-0 text-center leading-none">{u.unit_number}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{u.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{u.topics}</p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden md:block">{u.hours}</span>
                    <a href={u.url || 'https://usaeo.org/curriculum'} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex-shrink-0">
                      Start →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAPTERS ── */}
          {active === 'chapters' && (
            <div className="space-y-6">
              {/* Join a Chapter */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <div className="flex items-center gap-3 mb-2">
                  <School className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Chapter Portal</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Join a USAEO chapter at your school using an invite code from your chapter founder. Once joined, you can view announcements and your chapter community.</p>

                {joinSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3 mb-4">{joinSuccess}</div>
                )}

                <div className="flex gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Enter invite code (e.g. TJ2024)"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button onClick={handleJoinChapter}
                    className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Join
                  </button>
                </div>
                {joinError && <p className="text-xs text-destructive mt-1">{joinError}</p>}
              </div>

              {/* My Chapter */}
              {myChapter && (
                <div className="bg-white rounded-2xl border border-border p-8">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">My Chapter</p>
                      <h3 className="font-semibold text-lg text-foreground">{myChapter.school}</h3>
                      <p className="text-sm text-muted-foreground">{myChapter.city}, {myChapter.state}</p>
                    </div>
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Announcements</p>
                      {chapterAnnouncements.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No announcements from this chapter yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {chapterAnnouncements.map(a => (
                            <div key={a.id} className="border border-border rounded-lg p-3">
                              <p className="font-semibold text-sm text-foreground mb-1">{a.title}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Members ({chapterMembers.length})</p>
                      <div className="space-y-2">
                        {chapterMembers.map(m => (
                          <div key={m.id} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-primary">
                              {m.user_name?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm text-foreground font-medium">{m.user_name || m.user_email}</p>
                              <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Browse Chapters */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <h3 className="font-semibold text-foreground mb-5">Active Chapters</h3>
                <div className="divide-y divide-border">
                  {chapters.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-sm text-foreground">{c.school}</p>
                        <p className="text-xs text-muted-foreground">{c.city}, {c.state}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary font-medium">Founded by {c.founder_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Don't see your school? Start a chapter.</p>
                  <Link to="/register/chapter"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
                    Apply to start a chapter <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── CALENDAR ── */}
          {active === 'calendar' && (
            <div className="space-y-6">
              {/* My Registered Events */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <div className="flex items-center gap-2 mb-5">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground text-sm">My Registered Events</h2>
                </div>
                {myRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">You haven't registered for any events yet.</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Link to="/register/quiz-bowl" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
                        Register for Quiz Bowl <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link to="/register/essay" className="inline-flex items-center gap-1.5 px-4 py-2 border border-primary text-primary rounded-full text-xs font-semibold hover:bg-orange-50 transition-colors">
                        Register for Essay <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRegistrations.map((reg) => (
                      <div key={reg.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                        <div>
                          <p className="font-medium text-sm text-foreground">{reg.event_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{reg.event_type?.replace('-', ' ')} · Registered {new Date(reg.registered_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full capitalize">{reg.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Upcoming Events */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground text-sm">All Upcoming Events</h2>
                </div>
                <div className="space-y-3">
                  {competitionEvents.filter(e => e.status !== 'done').map((e) => {
                    const isRegistered = myRegistrations.some(r =>
                      r.event_name?.toLowerCase().includes(e.phase?.toLowerCase() ?? '') ||
                      r.event_type?.toLowerCase().includes(e.phase?.toLowerCase() ?? '')
                    );
                    return (
                      <div key={e.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                        <div>
                          <p className="font-medium text-sm text-foreground">{e.phase}</p>
                          <p className="text-xs text-muted-foreground">{e.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isRegistered && <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Registered</span>}
                          {e.status === 'current' && <span className="text-xs font-semibold text-primary bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">Open</span>}
                        </div>
                      </div>
                    );
                  })}
                  {upcomingWorkshops.map((w) => (
                    <div key={w.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-foreground">{w.title}</p>
                        <p className="text-xs text-muted-foreground">Workshop · {w.date}</p>
                      </div>
                    </div>
                  ))}
                  {competitionEvents.filter(e => e.status !== 'done').length === 0 && upcomingWorkshops.length === 0 && (
                    <p className="text-sm text-muted-foreground">No upcoming events at this time.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

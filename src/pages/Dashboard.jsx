import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, BookOpen, Calendar, CalendarDays, Users, FileText, ExternalLink,
  Bell, CheckCircle, Clock, ArrowRight, Lock, Info,
  LayoutDashboard, Menu, ChevronRight, School, BarChart2, X, ShieldCheck, Plus, Trash2,
  Pencil, Crown, UserPlus, LogOut
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/supabaseClient';
import { UPCOMING_PARTNER_EVENTS, UPCOMING_PARTNER_WORKSHOPS } from '@/lib/partnerEventsSeed';
// DB-backed partner events (overrides seed when populated)

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
  const { user: authUser, profile, isChapterAdmin, chapterAdminOf } = useAuth();
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
  const [myApplications, setMyApplications] = useState([]);
  const [myPendingMemberships, setMyPendingMemberships] = useState([]);
  // Quiz Bowl teams
  const [myQBTeam, setMyQBTeam] = useState(null); // { team, members, myMembership }
  const [qbConfig, setQbConfig] = useState(null);
  const [openQBTeams, setOpenQBTeams] = useState([]);
  const [qbCreateName, setQbCreateName] = useState('');
  const [qbInviteEmail, setQbInviteEmail] = useState('');
  const [qbInviteName, setQbInviteName] = useState('');
  const [qbEditName, setQbEditName] = useState('');
  const [qbEditingName, setQbEditingName] = useState(false);
  const [qbError, setQbError] = useState('');
  const [qbSuccess, setQbSuccess] = useState('');
  const [myQBInvites, setMyQBInvites] = useState([]);
  const [qbConflictInvite, setQbConflictInvite] = useState(null); // { inv, isSolo }
  // Chapter admin state
  const [adminChapter, setAdminChapter] = useState(null);
  const [adminMembers, setAdminMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [adminAnns, setAdminAnns] = useState([]);
  const [adminAnnForm, setAdminAnnForm] = useState({ title: '', body: '' });
  const [dbPartnerEvents, setDbPartnerEvents] = useState(null); // null = not yet loaded

  useEffect(() => {
    base44.entities.PartnerEvent.filter({ status: 'upcoming' })
      .then(rows => setDbPartnerEvents(rows))
      .catch(() => setDbPartnerEvents([]));
    base44.entities.Announcement.filter({ published: true }, '-created_date').then(setAnnouncements);
    base44.entities.Workshop.list('-date').then(setWorkshops);
    base44.entities.Resource.list().then(setResources);
    base44.entities.Ranking.filter({ visible: true }, 'rank').then(setRankings);
    base44.entities.Chapter.filter({ status: 'active' }).then(setChapters);
    base44.entities.CompetitionEvent.list('order').then(setCompetitionEvents);
    base44.entities.CurriculumUnit.list('order').then(setCurriculumUnits);
    if (authUser?.email) {
      base44.entities.EventRegistration.filter({ user_email: authUser.email }).then(setMyRegistrations);
      base44.entities.Application?.filter({ user_email: authUser.email }).then(setMyApplications).catch(() => setMyApplications([]));
      base44.entities.ChapterMember.filter({ user_email: authUser.email, status: 'pending' }).then(setMyPendingMemberships).catch(() => setMyPendingMemberships([]));
      loadQBData(authUser.email);
    }
  }, [authUser?.email]);

  const loadQBData = async (email) => {
    try {
      base44.entities.QuizBowlConfig.list().then((c) => setQbConfig(c?.[0] || null)).catch(() => {});
      const myMemberships = await base44.entities.QuizBowlTeamMember.filter({ user_email: email });

      // Always load pending invitations regardless of active membership
      const invitedMemberships = myMemberships.filter(m => m.status === 'invited');
      if (invitedMemberships.length > 0) {
        const inviteTeams = await Promise.all(
          invitedMemberships.map(async m => {
            const teams = await base44.entities.QuizBowlTeam.filter({ id: m.team_id });
            return teams[0] ? { ...m, team: teams[0] } : null;
          })
        );
        setMyQBInvites(inviteTeams.filter(Boolean));
      } else {
        setMyQBInvites([]);
      }

      const activeMembership = myMemberships.find(m => m.status === 'active');
      if (activeMembership) {
        const [teams, allMembers] = await Promise.all([
          base44.entities.QuizBowlTeam.filter({ id: activeMembership.team_id }),
          base44.entities.QuizBowlTeamMember.filter({ team_id: activeMembership.team_id }),
        ]);
        if (teams[0]) {
          setMyQBTeam({ team: teams[0], members: allMembers, myMembership: activeMembership });
          return;
        }
      }
      setMyQBTeam(null);
      const allTeams = await base44.entities.QuizBowlTeam.list('created_at');
      const openTeams = allTeams.filter(t => !t.locked);
      const teamsWithMembers = await Promise.all(openTeams.map(async t => {
        const members = await base44.entities.QuizBowlTeamMember.filter({ team_id: t.id });
        return { ...t, members };
      }));
      setOpenQBTeams(teamsWithMembers.filter(t => {
        const activeCount = t.members.filter(m => m.status === 'active').length;
        return activeCount < 5;
      }));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (isChapterAdmin && chapterAdminOf.length > 0) {
      const chapId = chapterAdminOf[0];
      base44.entities.Chapter.filter({ id: chapId }).then(data => {
        if (data?.[0]) setAdminChapter(data[0]);
      }).catch(() => {});
      loadAdminChapterData(chapId);
    }
  }, [isChapterAdmin, chapterAdminOf]);

  const loadAdminChapterData = async (chapId) => {
    const [members, anns] = await Promise.all([
      base44.entities.ChapterMember.filter({ chapter_id: chapId }),
      base44.entities.ChapterAnnouncement.filter({ chapter_id: chapId }, '-created_date'),
    ]);
    setAdminMembers(members.filter(m => m.status === 'active'));
    setPendingMembers(members.filter(m => m.status === 'pending'));
    setAdminAnns(anns);
  };

  const handleAdminAnnSubmit = async () => {
    if (!adminAnnForm.title.trim() || !adminChapter) return;
    await base44.entities.ChapterAnnouncement.create({
      chapter_id: adminChapter.id,
      title: adminAnnForm.title,
      body: adminAnnForm.body,
      author_email: authUser?.email,
    });
    setAdminAnnForm({ title: '', body: '' });
    loadAdminChapterData(adminChapter.id);
  };

  const handleMemberRequest = async (member, approve) => {
    await supabase.from('chapter_members').update({ status: approve ? 'active' : 'removed' }).eq('id', member.id);
    loadAdminChapterData(adminChapter.id);
  };

  const upcomingWorkshops = workshops.filter(w => w.status === 'upcoming');
  const pastWorkshops = workshops.filter(w => w.status === 'past');
  const filteredRankings = rankings.filter(r => r.stage === rankStage);
  const myRankingEntry = filteredRankings.find(r =>
    (authUser?.email && r.user_email && r.user_email.toLowerCase() === authUser.email.toLowerCase()) ||
    (profile?.full_name && r.student_name && r.student_name.toLowerCase() === profile.full_name.toLowerCase())
  );

  const handleJoinChapter = async () => {
    setJoinError(''); setJoinSuccess('');
    const chapter = chapters.find(c => c.invite_code?.toLowerCase() === joinCode.trim().toLowerCase());
    if (!chapter) { setJoinError('Invalid invite code. Check with your chapter founder.'); return; }
    if (!authUser) { setJoinError('You must be logged in.'); return; }
    const email = authUser.email;
    const fullName = profile?.full_name || '';
    const existing = await base44.entities.ChapterMember.filter({ chapter_id: chapter.id, user_email: email });
    if (existing.length > 0) { setJoinError('You are already a member of this chapter.'); return; }
    await base44.entities.ChapterMember.create({ chapter_id: chapter.id, user_email: email, user_name: fullName, role: 'member', status: 'pending' });
    // member_count increments only after chapter admin approves
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
            <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-6 w-6"  loading="lazy" decoding="async" />
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
          {isChapterAdmin && (
            <button onClick={() => navigate('chapter-admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${active === 'chapter-admin' ? 'bg-foreground text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              Chapter Admin
            </button>
          )}
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

          {/* â”€â”€ OVERVIEW â”€â”€ */}
          {active === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'National Qualifiers', status: 'Closed', color: 'text-destructive', bg: 'bg-destructive/10 border-red-200' },
                  { label: 'Quiz Bowl', status: 'Open', color: 'text-success', bg: 'bg-success/10 border-green-200' },
                  { label: 'Essay Competition', status: 'Open', color: 'text-success', bg: 'bg-success/10 border-green-200' },
                  { label: 'National Finals', status: 'Upcoming, May 2026', color: 'text-primary', bg: 'bg-primary/5 border-orange-200' },
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
                      <div key={a.id} className={`p-4 rounded-xl ${a.urgent ? 'bg-primary/5 border border-orange-200' : 'border border-border'}`}>
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
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Registration open</p>
                    <h3 className="font-sans text-2xl text-white mb-1">Quiz Bowl</h3>
                    <p className="text-sm text-white/60 mb-4">Timed quiz · Open to all</p>
                    <Link to="/register?event=quiz-bowl"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">
                      Register <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {(myApplications.length > 0 || myPendingMemberships.length > 0) && (
                    <div className="bg-white rounded-2xl border border-border p-5">
                      <p className="font-semibold text-foreground text-sm mb-3">My applications</p>
                      <div className="space-y-2">
                        {myPendingMemberships.map(m => (
                          <div key={`mem-${m.id}`} className="flex items-center justify-between text-xs">
                            <span className="text-foreground truncate">Chapter membership</span>
                            <span className="font-semibold text-orange-700 bg-primary/5 border border-orange-200 px-2 py-0.5 rounded-full">Pending</span>
                          </div>
                        ))}
                        {myApplications.map(a => (
                          <div key={`app-${a.id}`} className="flex items-center justify-between text-xs">
                            <span className="text-foreground truncate capitalize">{a.program?.replace('-', ' ') || 'Application'}</span>
                            <span className={`font-semibold px-2 py-0.5 rounded-full border ${a.status === 'approved' ? 'text-success bg-success/10 border-green-200' : a.status === 'rejected' ? 'text-destructive bg-destructive/10 border-red-200' : 'text-orange-700 bg-primary/5 border-orange-200'}`}>{a.status || 'Pending'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

          {/* â”€â”€ COMPETITION â”€â”€ */}
          {active === 'competition' && (
            <div className="space-y-6">
              {/* My Registrations */}
              {authUser && (() => {
                const compRegs = myRegistrations.filter(r => r.event_type === 'quiz-bowl' || r.event_type === 'essay');
                if (compRegs.length === 0) return null;
                return (
                  <div className="bg-white rounded-2xl border border-border p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">My Registrations</p>
                    <div className="space-y-3">
                      {compRegs.map((reg) => (
                        <div key={reg.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                          <div>
                            <p className="font-medium text-sm text-foreground">{reg.event_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {reg.event_type?.replace('-', ' ')} · Registered {new Date(reg.registered_at).toLocaleDateString()}
                              {reg.school ? ` · ${reg.school}` : ''}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2.5 py-1 rounded-full capitalize">{reg.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="font-semibold text-foreground mb-2">Competition Timeline 2025–2026</h2>
                <p className="text-sm text-muted-foreground mb-8">Your full pathway from registration through the National Finals.</p>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {competitionEvents.length === 0 && <p className="text-sm text-muted-foreground">Timeline not yet published.</p>}
                    {competitionEvents.map((t) => (
                      <div key={t.id} className="relative flex gap-6 pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${t.status === 'done' ? 'bg-success/10 border-green-300' : t.status === 'current' ? 'bg-primary border-primary' : 'bg-white border-border'}`}>
                          {t.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-success" />}
                          {t.status === 'current' && <span className="w-2 h-2 rounded-full bg-white" />}
                          {t.status === 'future' && <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-3">
                            <p className={`font-semibold text-sm ${t.status === 'future' ? 'text-muted-foreground' : 'text-foreground'}`}>{t.phase}</p>
                            {t.status === 'current' && <span className="text-xs font-semibold text-primary bg-primary/5 border border-orange-200 px-2 py-0.5 rounded-full">Current</span>}
                          </div>
                          <p className={`text-xs mt-0.5 ${t.status === 'done' ? 'text-success' : 'text-muted-foreground'}`}>{t.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Quiz Bowl</h3>
                    {myRegistrations.some(r => r.event_type === 'quiz-bowl') && (
                      <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2 py-0.5 rounded-full">Registered</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">Fast-paced timed quiz covering microeconomics, macroeconomics, and current events. Open to all registered students.</p>
                  {myRegistrations.some(r => r.event_type === 'quiz-bowl') ? (
                    <span className="text-xs text-muted-foreground">You're registered âœ“</span>
                  ) : (
                    <Link to="/competitions/quiz-bowl" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      Register now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Essay Competition</h3>
                    {myRegistrations.some(r => r.event_type === 'essay') && (
                      <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2 py-0.5 rounded-full">Registered</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">Submit a research essay on an economics topic. Judged on economic reasoning, evidence, and clarity of argument.</p>
                  {myRegistrations.some(r => r.event_type === 'essay') ? (
                    <span className="text-xs text-muted-foreground">You're registered âœ“</span>
                  ) : (
                    <Link to="/competitions/essay" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      Register now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">National Finals</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">In-person, full-day event in May 2026. Written exam + case study analysis. Top scorers selected as National Champions.</p>
                  <Link to="/competitions/finals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    Full details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* ── QUIZ BOWL INVITATIONS (visible to all logged-in users) ── */}
              {authUser && myQBInvites.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">Quiz Bowl Team Invitations</h3>
                    <span className="text-xs font-semibold text-primary bg-primary/5 border border-orange-200 px-2 py-0.5 rounded-full">{myQBInvites.length}</span>
                  </div>
                  {qbError && <div className="bg-destructive/10 border border-red-200 text-destructive text-sm rounded-xl px-4 py-3 mb-3">{qbError}</div>}
                  {qbSuccess && <div className="bg-success/10 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3 mb-3">{qbSuccess}</div>}
                  <div className="space-y-2">
                    {myQBInvites.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                        <div>
                          <p className="font-medium text-sm text-foreground">{inv.team.team_name}</p>
                          <p className="text-xs text-muted-foreground">{inv.team.school}{inv.team.state ? ` · ${inv.team.state}` : ''}</p>
                        </div>
                        <div className="flex gap-2">
                          {qbConfig?.registration_closed ? (
                            <span className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-lg">Registration closed</span>
                          ) : <button onClick={async () => {
                            setQbError(''); setQbSuccess('');
                            try {
                              if (myQBTeam) {
                                const activeMembers = myQBTeam.members.filter(m => m.status === 'active');
                                const isSolo = activeMembers.length === 1 && myQBTeam.myMembership?.role === 'captain';
                                setQbConflictInvite({ inv, isSolo });
                                return;
                              }
                              const alreadyReg = myRegistrations.some(r => r.event_type === 'quiz-bowl');
                              if (!alreadyReg) {
                                const reg = await base44.entities.EventRegistration.create({
                                  user_name: profile?.full_name || '',
                                  user_email: authUser.email,
                                  school: inv.team.school || '',
                                  state: inv.team.state || '',
                                  event_type: 'quiz-bowl',
                                  event_name: 'USAEO Quiz Bowl 2026',
                                  registered_at: new Date().toISOString(),
                                  status: 'registered',
                                });
                                setMyRegistrations(prev => [...prev, reg]);
                              }
                              await base44.entities.QuizBowlTeamMember.update(inv.id, { status: 'active' });
                              setQbSuccess(`Joined ${inv.team.team_name}!`);
                              loadQBData(authUser.email);
                            } catch { setQbError('Something went wrong. Try again.'); }
                          }} className="px-3 py-1.5 text-xs font-semibold bg-success/10 text-success border border-green-200 rounded-lg hover:bg-success/15 transition-colors">Accept</button>}
                          <button onClick={async () => {
                            setQbError(''); setQbSuccess('');
                            await base44.entities.QuizBowlTeamMember.delete(inv.id);
                            setQbSuccess('Invitation declined.');
                            loadQBData(authUser.email);
                          }} className="px-3 py-1.5 text-xs font-semibold bg-destructive/10 text-destructive border border-red-200 rounded-lg hover:bg-destructive/15 transition-colors">Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-team invite conflict modal */}
              {qbConflictInvite && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                    <h3 className="font-semibold text-foreground">Join a new team?</h3>
                    <p className="text-sm text-muted-foreground">
                      You're currently on <strong>{myQBTeam?.team?.team_name}</strong>.
                      {qbConflictInvite.isSolo
                        ? ' Since you\'re the only member, your team will be disbanded.'
                        : ' You\'ll leave your current team and your teammates will remain.'}
                    </p>
                    <p className="text-sm text-foreground">
                      Join <strong>{qbConflictInvite.inv.team.team_name}</strong> instead?
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setQbConflictInvite(null)}
                        className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                        Cancel
                      </button>
                      <button onClick={async () => {
                        setQbError(''); setQbSuccess('');
                        try {
                          const { inv, isSolo } = qbConflictInvite;
                          if (isSolo) {
                            await base44.entities.QuizBowlTeam.delete(myQBTeam.team.id);
                          } else {
                            await base44.entities.QuizBowlTeamMember.delete(myQBTeam.myMembership.id);
                          }
                          await base44.entities.QuizBowlTeamMember.update(inv.id, { status: 'active' });
                          setQbConflictInvite(null);
                          setQbSuccess(`Joined ${inv.team.team_name}!`);
                          loadQBData(authUser.email);
                        } catch { setQbError('Something went wrong. Try again.'); setQbConflictInvite(null); }
                      }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                        {qbConflictInvite.isSolo ? 'Disband & Join' : 'Leave & Join'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* â”€â”€ QUIZ BOWL TEAMS â”€â”€ */}
              {authUser && myRegistrations.some(r => r.event_type === 'quiz-bowl') && (() => {
                const email = authUser.email;
                const isCaptain = myQBTeam?.myMembership?.role === 'captain';
                const activeMembers = myQBTeam?.members?.filter(m => m.status === 'active') ?? [];
                const pendingRequests = myQBTeam?.members?.filter(m => m.status === 'pending') ?? [];

                return (
                  <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-foreground">Quiz Bowl Team</h3>
                      {myQBTeam?.team?.locked && (
                        <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                      )}
                    </div>

                    <Link to="/quiz-bowl" className="flex items-center justify-between gap-3 bg-primary/5 border border-orange-200 rounded-xl px-4 py-3 hover:bg-primary/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Open the Quiz Bowl tournament portal</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">Brackets · schedule · matches →</span>
                    </Link>

                    {Array.isArray(qbConfig?.round_deadlines) && qbConfig.round_deadlines.length > 0 && (
                      <div className="border border-border rounded-xl p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Round deadlines — submit matches before</p>
                        <div className="space-y-1">
                          {qbConfig.round_deadlines.map((r, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-foreground">{r.name || `Round ${i + 1}`}</span>
                              <span className="text-muted-foreground">{r.deadline ? new Date(r.deadline).toLocaleString() : 'TBD'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {qbError && <div className="bg-destructive/10 border border-red-200 text-destructive text-sm rounded-xl px-4 py-3">{qbError}</div>}
                    {qbSuccess && <div className="bg-success/10 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3">{qbSuccess}</div>}

                    {/* Has a team */}
                    {myQBTeam && (
                      <div className="space-y-4">
                        {/* Team header */}
                        <div className="flex items-start justify-between">
                          <div>
                            {qbEditingName ? (
                              <div className="flex items-center gap-2">
                                <input value={qbEditName} onChange={e => setQbEditName(e.target.value)}
                                  className="border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                                <button onClick={async () => {
                                  if (!qbEditName.trim()) return;
                                  await base44.entities.QuizBowlTeam.update(myQBTeam.team.id, { team_name: qbEditName.trim() });
                                  setQbEditingName(false);
                                  loadQBData(email);
                                }} className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Save</button>
                                <button onClick={() => setQbEditingName(false)} className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">{myQBTeam.team.team_name}</p>
                                {isCaptain && !myQBTeam.team.locked && (
                                  <button onClick={() => { setQbEditName(myQBTeam.team.team_name); setQbEditingName(true); }}
                                    className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">{myQBTeam.team.school} · {activeMembers.length}/5 members
                              {activeMembers.length < 3 && <span className="text-orange-600"> · Need {3 - activeMembers.length} more to be ready</span>}
                            </p>
                          </div>
                          {isCaptain && !myQBTeam.team.locked && (
                            <button onClick={async () => {
                              if (!window.confirm(`Delete team "${myQBTeam.team.team_name}"? This cannot be undone.`)) return;
                              await base44.entities.QuizBowlTeam.delete(myQBTeam.team.id);
                              setMyQBTeam(null);
                              loadQBData(email);
                            }} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Members list */}
                        <div className="space-y-2">
                          {myQBTeam.members.map(m => (
                            <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-primary">
                                  {(m.user_name || m.user_email)?.[0]?.toUpperCase() ?? '?'}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{m.user_name || m.user_email}</p>
                                  <p className="text-xs text-muted-foreground">{m.user_email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {m.role === 'captain' && <span className="text-xs font-semibold text-primary flex items-center gap-1"><Crown className="w-3 h-3" /> Captain</span>}
                                {m.status === 'invited' && <span className="text-xs text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">Invited</span>}
                                {m.status === 'pending' && <span className="text-xs text-orange-700 bg-primary/5 border border-orange-200 px-2 py-0.5 rounded-full">Requested</span>}
                                {isCaptain && !myQBTeam.team.locked && m.user_email !== email && (
                                  <button onClick={async () => {
                                    await base44.entities.QuizBowlTeamMember.delete(m.id);
                                    loadQBData(email);
                                  }} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Captain: pending join requests */}
                        {isCaptain && pendingRequests.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Join Requests ({pendingRequests.length})</p>
                            <div className="space-y-2">
                              {pendingRequests.map(req => (
                                <div key={req.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-2.5">
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{req.user_name || req.user_email}</p>
                                    <p className="text-xs text-muted-foreground">{req.user_email}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={async () => {
                                      if (activeMembers.length >= 5) { setQbError('Team is full (5 members max).'); return; }
                                      await base44.entities.QuizBowlTeamMember.update(req.id, { status: 'active' });
                                      loadQBData(email);
                                    }} className="px-3 py-1.5 text-xs font-semibold bg-success/10 text-success border border-green-200 rounded-lg hover:bg-success/15 transition-colors">Approve</button>
                                    <button onClick={async () => {
                                      await base44.entities.QuizBowlTeamMember.delete(req.id);
                                      loadQBData(email);
                                    }} className="px-3 py-1.5 text-xs font-semibold bg-destructive/10 text-destructive border border-red-200 rounded-lg hover:bg-destructive/15 transition-colors">Deny</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Captain: invite by email */}
                        {isCaptain && !myQBTeam.team.locked && activeMembers.length < 5 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Invite a Teammate</p>
                            <div className="flex gap-2">
                              <input value={qbInviteName} onChange={e => setQbInviteName(e.target.value)} placeholder="Name (optional)"
                                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                              <input value={qbInviteEmail} onChange={e => setQbInviteEmail(e.target.value)} placeholder="Email"
                                className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                              <button onClick={async () => {
                                setQbError(''); setQbSuccess('');
                                if (!qbInviteEmail.trim()) { setQbError('Email required.'); return; }
                                const already = myQBTeam.members.find(m => m.user_email === qbInviteEmail.trim());
                                if (already) { setQbError('Already on team.'); return; }
                                await base44.entities.QuizBowlTeamMember.create({
                                  team_id: myQBTeam.team.id,
                                  user_email: qbInviteEmail.trim(),
                                  user_name: qbInviteName.trim() || null,
                                  role: 'member',
                                  status: 'invited',
                                });
                                supabase.functions.invoke('send-registration-email', {
                                  body: { name: qbInviteName.trim() || qbInviteEmail, email: qbInviteEmail.trim(), event_type: 'team-invite', event_name: 'USAEO Quiz Bowl 2026', team_name: myQBTeam.team.team_name, invited_by: profile?.full_name || email },
                                }).catch(() => {});
                                setQbInviteEmail(''); setQbInviteName('');
                                setQbSuccess('Invitation sent!');
                                loadQBData(email);
                              }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                                <UserPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Member: leave team */}
                        {!isCaptain && !myQBTeam.team.locked && (
                          <button onClick={async () => {
                            if (!window.confirm('Leave this team?')) return;
                            await base44.entities.QuizBowlTeamMember.delete(myQBTeam.myMembership.id);
                            setMyQBTeam(null);
                            loadQBData(email);
                          }} className="inline-flex items-center gap-1.5 text-sm text-destructive hover:underline">
                            <LogOut className="w-3.5 h-3.5" /> Leave team
                          </button>
                        )}
                      </div>
                    )}

                    {/* No team: create or browse */}
                    {!myQBTeam && (
                      <div className="space-y-6">
                        {/* Create team */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Create a Team</p>
                          <div className="flex gap-2">
                            <input value={qbCreateName} onChange={e => setQbCreateName(e.target.value)} placeholder="Team name"
                              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                            <button onClick={async () => {
                              setQbError(''); setQbSuccess('');
                              if (!qbCreateName.trim()) { setQbError('Enter a team name.'); return; }
                              const reg = myRegistrations.find(r => r.event_type === 'quiz-bowl');
                              const team = await base44.entities.QuizBowlTeam.create({
                                team_name: qbCreateName.trim(),
                                captain_email: email,
                                school: reg?.school || '',
                                state: reg?.state || '',
                                locked: false,
                              });
                              await base44.entities.QuizBowlTeamMember.create({
                                team_id: team.id,
                                user_email: email,
                                user_name: profile?.full_name || '',
                                role: 'captain',
                                status: 'active',
                              });
                              setQbCreateName('');
                              setQbSuccess('Team created! Invite teammates from the panel above.');
                              loadQBData(email);
                            }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                              Create
                            </button>
                          </div>
                        </div>

                        {/* Browse open teams */}
                        {openQBTeams.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Open Teams, Request to Join</p>
                            <div className="space-y-2">
                              {openQBTeams.map(t => {
                                const activeCount = t.members.filter(m => m.status === 'active').length;
                                const alreadyRequested = t.members.some(m => m.user_email === email && m.status === 'pending');
                                return (
                                  <div key={t.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
                                    <div>
                                      <p className="font-medium text-sm text-foreground">{t.team_name}</p>
                                      <p className="text-xs text-muted-foreground">{t.school} · {activeCount}/5 members</p>
                                    </div>
                                    {alreadyRequested ? (
                                      <span className="text-xs text-orange-700 bg-primary/5 border border-orange-200 px-2.5 py-1 rounded-full">Requested</span>
                                    ) : (
                                      <button onClick={async () => {
                                        setQbError(''); setQbSuccess('');
                                        await base44.entities.QuizBowlTeamMember.create({
                                          team_id: t.id,
                                          user_email: email,
                                          user_name: profile?.full_name || '',
                                          role: 'member',
                                          status: 'pending',
                                        });
                                        setQbSuccess(`Join request sent to ${t.team_name}.`);
                                        loadQBData(email);
                                      }} className="px-3 py-1.5 text-xs font-semibold border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                                        Request to Join
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* â”€â”€ RANKINGS â”€â”€ */}
          {active === 'rankings' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border p-8">
                {/* Personalized header */}
                {myRankingEntry ? (
                  <div className="rounded-xl bg-foreground text-white px-6 py-5 mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Your Standing</p>
                      <p className="font-semibold text-lg">Rank #{myRankingEntry.rank}</p>
                      <p className="text-white/70 text-sm">{myRankingEntry.score} pts · {myRankingEntry.stage}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl">
                      {myRankingEntry.rank}
                    </div>
                  </div>
                ) : filteredRankings.length > 0 ? (
                  <div className="rounded-xl border border-border px-6 py-5 mb-6 flex items-center justify-between gap-4 bg-muted/30">
                    <div>
                      <p className="font-semibold text-foreground text-sm">You haven't been ranked yet</p>
                      <p className="text-muted-foreground text-xs mt-0.5">Register for Quiz Bowl or Essay to earn a ranking.</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link to="/register/quiz-bowl" className="text-xs font-semibold text-primary hover:underline">Quiz Bowl</Link>
                      <span className="text-muted-foreground text-xs">·</span>
                      <Link to="/register/essay" className="text-xs font-semibold text-primary hover:underline">Essay</Link>
                    </div>
                  </div>
                ) : null}
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
                ) : (() => {
                  // Build tie map: rank â†’ count of entries sharing it
                  const rankCount = filteredRankings.reduce((acc, r) => {
                    acc[r.rank] = (acc[r.rank] || 0) + 1;
                    return acc;
                  }, {});
                  return (
                    <div className="space-y-1">
                      {filteredRankings.map((r) => {
                        const isTop10 = r.rank <= 10;
                        const isTie = rankCount[r.rank] > 1;
                        const rowBg = isTie
                          ? 'bg-sky-50 border border-sky-200'
                          : isTop10
                          ? 'bg-amber-50/70 border border-amber-200/60'
                          : 'border border-transparent';
                        const badgeBg = r.rank === 1
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : r.rank === 2
                          ? 'bg-gray-200 text-gray-600 border border-gray-300'
                          : r.rank === 3
                          ? 'bg-orange-100 text-orange-700 border border-orange-300'
                          : isTop10
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-muted text-muted-foreground border border-border';
                        return (
                          <div key={r.id} className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${rowBg}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${badgeBg}`}>
                              {r.rank}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm ${isTop10 ? 'text-foreground' : 'text-foreground'}`}>{r.student_name || r.team_name}</p>
                              <p className="text-xs text-muted-foreground truncate">{r.school}{r.state ? ` · ${r.state}` : ''}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-sm text-foreground">{r.score}</p>
                              <p className="text-xs text-muted-foreground">score</p>
                            </div>
                            {isTie && (
                              <div className="group relative flex-shrink-0">
                                <Info className="w-4 h-4 text-sky-500 cursor-help" />
                                <div className="pointer-events-none absolute right-0 bottom-6 z-10 w-64 bg-foreground text-white text-xs rounded-xl px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity leading-relaxed">
                                  Participants who have the same overall, MCQ, and essay scores will share ranks. Tiebreaks are decided by essay scores.
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* â”€â”€ RESOURCES â”€â”€ */}
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

          {/* â”€â”€ WORKSHOPS â”€â”€ */}
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
                        <div className="bg-primary/5 border border-orange-200 rounded-lg px-3 py-2 text-center flex-shrink-0 w-16">
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
                  <h2 className="font-semibold text-foreground mb-5">Past Workshops, Recordings</h2>
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
                            Watch recording â†’
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

          {/* â”€â”€ CURRICULUM â”€â”€ */}
          {active === 'curriculum' && (
            <div className="bg-white rounded-2xl border border-border p-8">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-semibold text-foreground">Study Curriculum</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/5 border border-orange-200 px-2 py-0.5 rounded-full">Releasing soon</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Six units covering the full USAEO syllabus. Free for all students at usaeo.org/curriculum.</p>
              <div className="space-y-0 divide-y divide-border">
                {curriculumUnits.length === 0 && <p className="text-sm text-muted-foreground">Curriculum not yet published.</p>}
                {curriculumUnits.map((u) => (
                  <div key={u.id} className="flex items-center gap-5 py-4">
                    <span className="font-sans text-3xl text-orange-100 w-10 flex-shrink-0 text-center leading-none">{u.unit_number}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{u.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{u.topics}</p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden md:block">{u.hours}</span>
                    <a href={u.url || 'https://usaeo.org/curriculum'} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex-shrink-0">
                      Start â†’
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* â”€â”€ CHAPTERS â”€â”€ */}
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
                  <div className="bg-success/10 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3 mb-4">{joinSuccess}</div>
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
                    <span className="text-xs bg-success/10 text-success border border-green-200 px-2.5 py-1 rounded-full font-medium">Active</span>
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

          {/* â”€â”€ CALENDAR â”€â”€ */}
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
                      <Link to="/register/essay" className="inline-flex items-center gap-1.5 px-4 py-2 border border-primary text-primary rounded-full text-xs font-semibold hover:bg-primary/5 transition-colors">
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
                        <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2.5 py-1 rounded-full capitalize">{reg.status}</span>
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
                          {isRegistered && <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2.5 py-1 rounded-full">Registered</span>}
                          {e.status === 'current' && <span className="text-xs font-semibold text-primary bg-primary/5 border border-orange-200 px-2.5 py-1 rounded-full">Open</span>}
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
                  {(dbPartnerEvents !== null && dbPartnerEvents.length > 0 ? dbPartnerEvents : UPCOMING_PARTNER_EVENTS).map((e) => (
                    <div key={e.id} className="flex items-center justify-between border border-orange-100 bg-orange-50/40 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-foreground">{e.title}</p>
                        <p className="text-xs text-muted-foreground">Partner {e.category || e.event_type} · {e.date}</p>
                      </div>
                      <a href={e.externalUrl || e.external_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary hover:underline flex-shrink-0 ml-3">
                        {e.partnerShort || e.partner_short || e.partner} ↗
                      </a>
                    </div>
                  ))}
                  {competitionEvents.filter(e => e.status !== 'done').length === 0 && upcomingWorkshops.length === 0 && (dbPartnerEvents !== null ? dbPartnerEvents : UPCOMING_PARTNER_EVENTS).length === 0 && (
                    <p className="text-sm text-muted-foreground">No upcoming events at this time.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ CHAPTER ADMIN â”€â”€ */}
          {active === 'chapter-admin' && isChapterAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-foreground mb-1">Chapter Admin</h2>
                <p className="text-sm text-muted-foreground">{adminChapter?.name || adminChapter?.school || 'Your chapter'}</p>
              </div>

              {/* Pending Join Requests */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Pending Requests ({pendingMembers.length})
                </p>
                {pendingMembers.length === 0 && <p className="text-sm text-muted-foreground">No pending requests.</p>}
                <div className="space-y-3">
                  {pendingMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.user_name || m.user_email}</p>
                        <p className="text-xs text-muted-foreground">{m.user_email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleMemberRequest(m, true)}
                          className="px-3 py-1.5 text-xs font-semibold bg-success/10 text-success border border-green-200 rounded-lg hover:bg-success/15 transition-colors">
                          Approve
                        </button>
                        <button onClick={() => handleMemberRequest(m, false)}
                          className="px-3 py-1.5 text-xs font-semibold bg-destructive/10 text-destructive border border-red-200 rounded-lg hover:bg-destructive/15 transition-colors">
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Members */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Active Members ({adminMembers.length})
                </p>
                {adminMembers.length === 0 && <p className="text-sm text-muted-foreground">No members yet.</p>}
                <div className="space-y-2">
                  {adminMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-primary">
                          {m.user_name?.[0] ?? '?'}
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{m.user_name || m.user_email}</p>
                          <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post Announcement */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Post Announcement
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={adminAnnForm.title}
                    onChange={e => setAdminAnnForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <textarea
                    placeholder="Body (optional)"
                    rows={3}
                    value={adminAnnForm.body}
                    onChange={e => setAdminAnnForm(f => ({ ...f, body: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                  <button onClick={handleAdminAnnSubmit}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Post
                  </button>
                </div>
              </div>

              {/* Past Announcements */}
              {adminAnns.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Chapter Announcements
                  </p>
                  <div className="space-y-3">
                    {adminAnns.map(a => (
                      <div key={a.id} className="border border-border rounded-lg p-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{a.title}</p>
                          {a.body && <p className="text-xs text-muted-foreground mt-1">{a.body}</p>}
                        </div>
                        <button onClick={async () => { await base44.entities.ChapterAnnouncement.delete(a.id); loadAdminChapterData(adminChapter.id); }}
                          className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

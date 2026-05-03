import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight, Plus, X, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/supabaseClient';

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const GRADES = ['9th Grade','10th Grade','11th Grade','12th Grade'];

const MAX_TEAM_SIZE = 5;

export default function QuizBowlRegister() {
  const [form, setForm] = useState({ name: '', email: '', school: '', grade: '', state: '' });
  const [showTeam, setShowTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teammates, setTeammates] = useState([{ name: '', email: '' }]);
  const [captainIndex, setCaptainIndex] = useState(-1); // -1 = registrant is captain
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addTeammate = () => {
    if (teammates.length < MAX_TEAM_SIZE - 1) {
      setTeammates(t => [...t, { name: '', email: '' }]);
    }
  };

  const removeTeammate = (i) => {
    setTeammates(t => t.filter((_, idx) => idx !== i));
    if (captainIndex === i) setCaptainIndex(-1);
    if (captainIndex > i) setCaptainIndex(c => c - 1);
  };

  const setTeammate = (i, field, val) => {
    setTeammates(t => t.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.school || !form.grade || !form.state) {
      setError('Please fill in all fields.');
      return;
    }
    if (showTeam && !teamName.trim()) {
      setError('Please enter a team name.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await base44.entities.EventRegistration.create({
        user_name: form.name,
        user_email: form.email,
        school: form.school,
        grade: form.grade,
        state: form.state,
        event_type: 'quiz-bowl',
        event_name: 'USAEO Quiz Bowl 2026',
        registered_at: new Date().toISOString(),
        status: 'registered',
      });

      if (showTeam && teamName.trim()) {
        const validTeammates = teammates.filter(t => t.email.trim());
        const captainEmail = captainIndex === -1 ? form.email : (validTeammates[captainIndex]?.email || form.email);

        const team = await base44.entities.QuizBowlTeam.create({
          team_name: teamName.trim(),
          captain_email: captainEmail,
          school: form.school,
          state: form.state,
          locked: false,
        });

        // Add registrant
        await base44.entities.QuizBowlTeamMember.create({
          team_id: team.id,
          user_email: form.email,
          user_name: form.name,
          role: captainIndex === -1 ? 'captain' : 'member',
          status: 'active',
        });

        // Add teammates as invited
        for (let i = 0; i < validTeammates.length; i++) {
          const t = validTeammates[i];
          await base44.entities.QuizBowlTeamMember.create({
            team_id: team.id,
            user_email: t.email.trim(),
            user_name: t.name.trim() || null,
            role: captainIndex === i ? 'captain' : 'member',
            status: 'invited',
          });
          // Fire invite email
          supabase.functions.invoke('send-registration-email', {
            body: {
              name: t.name.trim() || t.email,
              email: t.email.trim(),
              event_type: 'team-invite',
              event_name: 'USAEO Quiz Bowl 2026',
              team_name: teamName.trim(),
              invited_by: form.name,
            },
          }).catch(() => {});
        }
      }

      supabase.functions.invoke('send-registration-email', {
        body: { name: form.name, email: form.email, event_type: 'quiz-bowl', event_name: 'USAEO Quiz Bowl 2026' },
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
            <div className="flex justify-center mb-5">
              <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-16 w-16" />
            </div>
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h2 className="font-sans text-3xl text-foreground mb-3">You're registered!</h2>
            <p className="text-muted-foreground mb-4">
              A confirmation email is on its way to <strong>{form.email}</strong>.
              {showTeam && teamName ? ` Your team "${teamName}" has been created.` : ''}
            </p>
            {!showTeam && (
              <div className="bg-primary/5 border border-orange-200 rounded-xl px-5 py-4 mb-6 text-left">
                <p className="text-sm font-semibold text-orange-900 mb-1">Next step: create or join a team</p>
                <p className="text-sm text-orange-700">Sign in to your dashboard, go to Competition â†’ Quiz Bowl to create a team or browse open teams.</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/register-account" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-semibold text-sm hover:border-foreground transition-colors">
                Create Account
              </Link>
            </div>
            <Link to="/competitions/quiz-bowl" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Quiz Bowl
            </Link>
          </motion.div>
        </section>
      </PageLayout>
    );
  }

  const totalMembers = 1 + teammates.filter(t => t.email.trim()).length;

  return (
    <PageLayout>
      <section className="pt-20 pb-24 px-5">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Register</p>
            <h1 className="font-sans text-3xl text-foreground mb-2">USAEO Quiz Bowl 2026</h1>
            <p className="text-sm text-muted-foreground">Free registration Â· Takes under 2 minutes</p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8 space-y-4">
            {error && <div className="bg-destructive/10 border border-red-200 text-destructive text-sm rounded-xl px-4 py-3">{error}</div>}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">High School Name</label>
              <input type="text" value={form.school} onChange={set('school')} placeholder="Lincoln High School"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Grade</label>
                <select value={form.grade} onChange={set('grade')}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
                  <option value="">Select grade</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">State</label>
                <select value={form.state} onChange={set('state')}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
                  <option value="">Select state</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Team section */}
            <div className="border border-border rounded-xl overflow-hidden">
              <button type="button" onClick={() => setShowTeam(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Build your team now (optional)</span>
                <span className="text-xs text-muted-foreground">{showTeam ? 'â–² Hide' : 'â–¼ Show'}</span>
              </button>

              {showTeam && (
                <div className="px-4 pb-4 pt-1 space-y-4 border-t border-border bg-muted/10">
                  <p className="text-xs text-muted-foreground">Teams need 3–5 players. You can also create or join a team from your dashboard after registering.</p>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Team Name</label>
                    <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Economics Eagles"
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-foreground">Team Captain</label>
                      <span className="text-xs text-muted-foreground">{totalMembers}/{MAX_TEAM_SIZE} members</span>
                    </div>
                    <div className="space-y-2">
                      {/* Registrant row */}
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-border">
                        <input type="radio" name="captain" checked={captainIndex === -1} onChange={() => setCaptainIndex(-1)} className="accent-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{form.name || 'You'}</p>
                          <p className="text-xs text-muted-foreground truncate">{form.email || 'your email'}</p>
                        </div>
                        <span className="text-xs text-primary font-semibold">You</span>
                      </div>
                      {/* Teammate rows */}
                      {teammates.map((tm, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="pt-3">
                            <input type="radio" name="captain" checked={captainIndex === i} onChange={() => setCaptainIndex(i)} className="accent-primary" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input type="text" value={tm.name} onChange={e => setTeammate(i, 'name', e.target.value)} placeholder="Name (optional)"
                              className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                            <input type="email" value={tm.email} onChange={e => setTeammate(i, 'email', e.target.value)} placeholder="Email"
                              className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                          </div>
                          <button type="button" onClick={() => removeTeammate(i)} className="mt-2 p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {teammates.length < MAX_TEAM_SIZE - 1 && (
                      <button type="button" onClick={addTeammate}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                        <Plus className="w-3 h-3" /> Add teammate
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2">
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              By registering you agree to receive emails from USAEO about this event.
            </p>
          </motion.form>
        </div>
      </section>
    </PageLayout>
  );
}

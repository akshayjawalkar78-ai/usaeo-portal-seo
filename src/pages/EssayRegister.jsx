import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/supabaseClient';

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const GRADES = ['9th Grade','10th Grade','11th Grade','12th Grade'];

export default function EssayRegister() {
  const [form, setForm] = useState({ name: '', email: '', school: '', grade: '', state: '', topic: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.school || !form.grade || !form.state) {
      setError('Please fill in all required fields.');
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
        event_type: 'essay',
        event_name: 'USAEO Essay Competition 2026',
        notes: form.topic,
        registered_at: new Date().toISOString(),
        status: 'registered',
      });
      supabase.functions.invoke('send-registration-email', {
        body: { name: form.name, email: form.email, event_type: 'essay', event_name: 'USAEO Essay Competition 2026' },
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
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="font-serif text-3xl text-foreground mb-3">You're registered!</h2>
            <p className="text-muted-foreground mb-6">A confirmation email is on its way to <strong>{form.email}</strong>. Sign in to your USAEO account and head to your dashboard to view your registration and submission details.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/register-account" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-semibold text-sm hover:border-foreground transition-colors">
                Create Account
              </Link>
            </div>
            <Link to="/competitions/essay" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Essay Competition
            </Link>
          </motion.div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="pt-20 pb-24 px-5">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <img src="/logos/USAEOlogo.png" alt="USAEO" className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Register</p>
            <h1 className="font-serif text-3xl text-foreground mb-2">USAEO Essay Competition 2026</h1>
            <p className="text-sm text-muted-foreground">Free registration · Takes under 2 minutes</p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

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
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Essay Topic (optional)</label>
              <input type="text" value={form.topic} onChange={set('topic')} placeholder="e.g. The Economics of Climate Policy"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
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

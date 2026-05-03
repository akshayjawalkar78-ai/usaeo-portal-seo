import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { base44 } from '@/api/base44Client';

const GRADUATION_YEARS = [
  'Highschool Freshman', 'Highschool Sophomore', 'Highschool Junior', 'Highschool Senior',
  'College Freshman', 'College Sophomore', 'College Junior', 'College Senior',
  'Professional', 'Other',
];

const POSITIONS = [
  'Academia Committee',
  'Operations Committee',
  'Outreach Committee',
  'Marketing Committee',
  'Research Committee',
  'HR Committee',
  'IT Committee',
];

export default function CareersApply() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', discord: '', social: '',
    school_org_state: '', graduation_year: '', position: '', resume_link: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, discord, school_org_state, graduation_year, position, resume_link } = form;
    if (!name || !email || !phone || !discord || !school_org_state || !graduation_year || !position || !resume_link) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await base44.entities.Application.create({
        user_name: name,
        user_email: email,
        program: 'careers',
        payload: {
          phone,
          discord,
          social: form.social,
          school_org_state,
          graduation_year,
          position,
          resume_link,
        },
        status: 'pending',
      });
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
            <h2 className="font-sans text-3xl text-foreground mb-3">Application submitted!</h2>
            <p className="text-muted-foreground mb-6">
              We've received your application for the <strong>{form.position}</strong>. Our team will be in touch soon.
            </p>
            <Link to="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Team
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Careers</p>
            <h1 className="font-sans text-3xl text-foreground mb-2">Apply to USAEO</h1>
            <p className="text-sm text-muted-foreground">Contributors & committee leaders · Min. 1 hr/week volunteer commitment</p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8 space-y-4">
            {error && <div className="bg-destructive/10 border border-red-200 text-destructive text-sm rounded-xl px-4 py-3">{error}</div>}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Discord Username <span className="text-destructive">*</span>
              </label>
              <input type="text" value={form.discord} onChange={set('discord')} placeholder="username or @handle"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Other Social Media <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </label>
              <input type="text" value={form.social} onChange={set('social')} placeholder="LinkedIn, Twitter/X, etc."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                School / Organization and State <span className="text-destructive">*</span>
              </label>
              <input type="text" value={form.school_org_state} onChange={set('school_org_state')}
                placeholder="Lincoln High School, California"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Academic Level <span className="text-destructive">*</span>
                </label>
                <select value={form.graduation_year} onChange={set('graduation_year')}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
                  <option value="">Select level</option>
                  {GRADUATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Preferred Position <span className="text-destructive">*</span>
                </label>
                <select value={form.position} onChange={set('position')}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
                  <option value="">Select position</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Resume Link <span className="text-destructive">*</span>
              </label>
              <input type="url" value={form.resume_link} onChange={set('resume_link')}
                placeholder="https://drive.google.com/..."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              <p className="text-xs text-muted-foreground mt-1">Google Drive, Dropbox, or any public link</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Our team reviews all applications and will be in touch within a few business days.
            </p>
          </motion.form>
        </div>
      </section>
    </PageLayout>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, X, ChevronDown, ChevronUp, Download,
  CheckCircle, Clock, AlertTriangle, Ban, Pencil, RefreshCw,
  Plus, Trash2, Eye, Bot, Save,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const inputCls =
  'w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

const STATUS_META = {
  to_grade:     { label: 'To Grade',     color: 'text-amber-700 bg-amber-50 border-amber-200',      icon: Clock },
  grading:      { label: 'Grading',      color: 'text-blue-700 bg-blue-50 border-blue-200',          icon: RefreshCw },
  graded:       { label: 'Graded',       color: 'text-green-700 bg-green-50 border-green-200',        icon: CheckCircle },
  disqualified: { label: 'Disqualified', color: 'text-red-700 bg-red-50 border-red-200',             icon: Ban },
};

const AI_PLATFORMS = [
  { key: 'gptzero_score',     label: 'GPTZero'      },
  { key: 'turnitin_score',    label: 'Turnitin'     },
  { key: 'originality_score', label: 'Originality'  },
  { key: 'copyleaks_score',   label: 'Copyleaks'    },
  { key: 'writer_score',      label: 'Writer'       },
];

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.to_grade;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

function computeAiTotal(scores) {
  const vals = AI_PLATFORMS.map(p => scores[p.key]).filter(v => v !== null && v !== undefined && v !== '');
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + parseFloat(b), 0) / vals.length);
}

// ── Prompts sub-tab ───────────────────────────────────────────────────────────
function PromptsTab({ prompts, onReload }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', prompt_number: 1, visible: true });
  const [saving, setSaving] = useState(false);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ title: p.title, body: p.body, prompt_number: p.prompt_number, visible: p.visible });
  };
  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await base44.entities.EssayPrompt.update(editingId, form);
      setEditingId(null);
      onReload();
    } catch (e) { alert(e.message); }
    setSaving(false);
  };

  const sorted = [...prompts].sort((a, b) => a.prompt_number - b.prompt_number);

  return (
    <div className="space-y-4">
      {sorted.map(p => (
        <div key={p.id} className="bg-white rounded-2xl border border-border p-5">
          {editingId === p.id ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-24">
                  <label className="text-xs text-muted-foreground mb-1 block">Prompt #</label>
                  <input type="number" min={1} max={5} value={form.prompt_number}
                    onChange={e => setForm(f => ({ ...f, prompt_number: parseInt(e.target.value) }))}
                    className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Prompt Body</label>
                <textarea rows={5} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  className={inputCls} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id={`vis-${p.id}`} checked={form.visible}
                  onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} />
                <label htmlFor={`vis-${p.id}`} className="text-sm text-muted-foreground">Visible to students</label>
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} disabled={saving}
                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={cancelEdit} className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center">
                    {p.prompt_number}
                  </span>
                  <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                  {!p.visible && (
                    <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">Hidden</span>
                  )}
                </div>
                <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Submissions sub-tab ───────────────────────────────────────────────────────
function SubmissionsTab({ submissions, reviews, prompts, onReload }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState(null); // submission
  const [reviewForm, setReviewForm] = useState({});
  const [saving, setSaving] = useState(false);

  const promptMap = Object.fromEntries(prompts.map(p => [p.id, p]));
  const reviewMap = Object.fromEntries(reviews.map(r => [r.submission_id, r]));

  const openReview = (sub) => {
    const existing = reviewMap[sub.id] || {};
    setReviewForm({
      review_status: existing.review_status || 'to_grade',
      reviewer_email: existing.reviewer_email || user?.email || '',
      notes: existing.notes || '',
      gptzero_score: existing.gptzero_score ?? '',
      turnitin_score: existing.turnitin_score ?? '',
      originality_score: existing.originality_score ?? '',
      copyleaks_score: existing.copyleaks_score ?? '',
      writer_score: existing.writer_score ?? '',
    });
    setReviewModal(sub);
  };

  const saveReview = async () => {
    if (!reviewModal) return;
    setSaving(true);
    try {
      const total = computeAiTotal(reviewForm);
      const payload = { ...reviewForm, ai_total_score: total, updated_at: new Date().toISOString() };
      const existing = reviewMap[reviewModal.id];
      if (existing) {
        await base44.entities.EssayReview.update(existing.id, payload);
      } else {
        await base44.entities.EssayReview.create({ submission_id: reviewModal.id, ...payload });
      }
      setReviewModal(null);
      onReload();
    } catch (e) { alert(e.message); }
    setSaving(false);
  };

  const filtered = submissions.filter(s => {
    const review = reviewMap[s.id];
    const status = review?.review_status || 'to_grade';
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.user_email.toLowerCase().includes(q) ||
      s.user_name.toLowerCase().includes(q) ||
      s.school.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, school…"
            className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div className="flex bg-muted rounded-lg p-1 gap-1">
          {[{ id: 'all', label: 'All' }, ...Object.entries(STATUS_META).map(([id, m]) => ({ id, label: m.label }))].map(f => (
            <button key={f.id} onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${statusFilter === f.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} submission{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground text-sm">No submissions match your filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prompt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">File</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => {
                const review = reviewMap[sub.id];
                const status = review?.review_status || 'to_grade';
                const prompt = promptMap[sub.prompt_id];
                const aiScore = review?.ai_total_score;
                return (
                  <tr key={sub.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{sub.user_name || sub.user_email}</p>
                      <p className="text-xs text-muted-foreground">{sub.school}{sub.state ? ` · ${sub.state}` : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {prompt ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-bold text-primary">#{prompt.prompt_number}</span>
                          <span className="text-xs">{prompt.title}</span>
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <a href={sub.file_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <Download className="w-3 h-3" />
                        {sub.file_name}
                      </a>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={status} /></td>
                    <td className="px-4 py-3">
                      {aiScore != null ? (
                        <span className={`text-xs font-bold ${aiScore >= 70 ? 'text-red-600' : aiScore >= 40 ? 'text-amber-600' : 'text-green-600'}`}>
                          {aiScore}%
                        </span>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openReview(sub)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        <Eye className="w-3 h-3" /> Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Review modal */}
      <AnimatePresence>
        {reviewModal && (
          <Modal title={`Review — ${reviewModal.user_name || reviewModal.user_email}`} onClose={() => setReviewModal(null)} wide>
            <div className="space-y-5">
              {/* File link */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Submission</p>
                <a href={reviewModal.file_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                  <Download className="w-3.5 h-3.5" />
                  {reviewModal.file_name}
                </a>
              </div>

              {/* Review status */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Review Status</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_META).map(([val, meta]) => (
                    <button key={val} onClick={() => setReviewForm(f => ({ ...f, review_status: val }))}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${reviewForm.review_status === val ? meta.color : 'text-muted-foreground border-border hover:bg-muted'}`}>
                      <meta.icon className="w-3 h-3" />
                      {meta.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Detection Scores */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">AI Detection Scores (%)</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AI_PLATFORMS.map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                      <input
                        type="number" min={0} max={100} step={0.1}
                        placeholder="—"
                        value={reviewForm[key]}
                        onChange={e => setReviewForm(f => ({ ...f, [key]: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>
                {(() => {
                  const total = computeAiTotal(reviewForm);
                  if (total == null) return null;
                  return (
                    <p className={`mt-2 text-sm font-bold ${total >= 70 ? 'text-red-600' : total >= 40 ? 'text-amber-600' : 'text-green-600'}`}>
                      AI Total (avg): {total}%
                      {total >= 70 && ' — High risk'}
                      {total >= 40 && total < 70 && ' — Moderate risk'}
                      {total < 40 && ' — Low risk'}
                    </p>
                  );
                })()}
              </div>

              {/* Reviewer + Notes */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Reviewer Email</label>
                <input value={reviewForm.reviewer_email}
                  onChange={e => setReviewForm(f => ({ ...f, reviewer_email: e.target.value }))}
                  className={inputCls} placeholder="reviewer@usaeo.org" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                <textarea rows={3} value={reviewForm.notes}
                  onChange={e => setReviewForm(f => ({ ...f, notes: e.target.value }))}
                  className={inputCls} placeholder="Internal notes…" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setReviewModal(null)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
                <button onClick={saveReview} disabled={saving}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving…' : 'Save Review'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main portal ───────────────────────────────────────────────────────────────
const SUBTABS = [
  { id: 'submissions', label: 'Submissions' },
  { id: 'prompts',     label: 'Prompts'     },
];

export default function EssayPortal() {
  const [sub, setSub] = useState('submissions');
  const [prompts, setPrompts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s, r] = await Promise.all([
        base44.entities.EssayPrompt.list('prompt_number'),
        base44.entities.EssaySubmission.list('-submitted_at'),
        base44.entities.EssayReview.list('-updated_at'),
      ]);
      setPrompts(p);
      setSubmissions(s);
      setReviews(r);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const statusCounts = submissions.reduce((acc, sub) => {
    const r = reviews.find(r => r.submission_id === sub.id);
    const st = r?.review_status || 'to_grade';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Essay Competition</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{submissions.length} total submission{submissions.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={loadAll} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stat chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div key={key} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${meta.color}`}>
            <meta.icon className="w-3 h-3" />
            {statusCounts[key] || 0} {meta.label}
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {SUBTABS.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${sub === t.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : sub === 'submissions' ? (
        <SubmissionsTab submissions={submissions} reviews={reviews} prompts={prompts} onReload={loadAll} />
      ) : (
        <PromptsTab prompts={prompts} onReload={loadAll} />
      )}
    </div>
  );
}

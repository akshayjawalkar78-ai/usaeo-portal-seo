import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Pencil, Eye, EyeOff, X, ChevronUp, ChevronDown,
  AlignLeft, Heading2, Image, Video, Quote, Minus, Globe, FileText,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

// ── Block type config ──────────────────────────────────────────────
const BLOCK_TYPES = [
  { type: 'text',      label: 'Paragraph',  icon: AlignLeft },
  { type: 'heading',   label: 'Heading',    icon: Heading2 },
  { type: 'subheading',label: 'Subheading', icon: FileText },
  { type: 'image',     label: 'Image',      icon: Image },
  { type: 'video',     label: 'Video',      icon: Video },
  { type: 'quote',     label: 'Pull Quote', icon: Quote },
  { type: 'divider',   label: 'Divider',    icon: Minus },
];

function defaultBlock(type) {
  switch (type) {
    case 'text':       return { type, content: '' };
    case 'heading':    return { type, content: '' };
    case 'subheading': return { type, content: '' };
    case 'image':      return { type, url: '', alt: '', caption: '' };
    case 'video':      return { type, url: '' };
    case 'quote':      return { type, content: '' };
    case 'divider':    return { type };
    default:           return { type, content: '' };
  }
}

// ── Single block editor ────────────────────────────────────────────
function BlockEditor({ block, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const inputCls = 'w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';
  const textareaCls = `${inputCls} resize-none`;

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border">
        {BLOCK_TYPES.find(b => b.type === block.type)?.label ?? block.type}
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={onMoveUp} disabled={isFirst} className="p-1 hover:bg-muted rounded disabled:opacity-30">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={isLast} className="p-1 hover:bg-muted rounded disabled:opacity-30">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onRemove} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {(block.type === 'text') && (
          <textarea rows={4} value={block.content} onChange={e => onChange({ ...block, content: e.target.value })}
            placeholder="Paragraph text (HTML supported)" className={textareaCls} />
        )}
        {(block.type === 'heading' || block.type === 'subheading') && (
          <input type="text" value={block.content} onChange={e => onChange({ ...block, content: e.target.value })}
            placeholder={block.type === 'heading' ? 'Section heading' : 'Subheading'} className={inputCls} />
        )}
        {block.type === 'image' && (
          <>
            <input type="url" value={block.url} onChange={e => onChange({ ...block, url: e.target.value })}
              placeholder="Image URL (https://...)" className={inputCls} />
            <input type="text" value={block.alt || ''} onChange={e => onChange({ ...block, alt: e.target.value })}
              placeholder="Alt text" className={inputCls} />
            <input type="text" value={block.caption || ''} onChange={e => onChange({ ...block, caption: e.target.value })}
              placeholder="Caption (optional)" className={inputCls} />
            {block.url && (
              <img src={block.url} alt={block.alt || ''} className="w-full max-h-40 object-cover rounded-lg mt-1" onError={e => e.target.style.display = 'none'} />
            )}
          </>
        )}
        {block.type === 'video' && (
          <input type="url" value={block.url} onChange={e => onChange({ ...block, url: e.target.value })}
            placeholder="YouTube or Vimeo URL" className={inputCls} />
        )}
        {block.type === 'quote' && (
          <textarea rows={3} value={block.content} onChange={e => onChange({ ...block, content: e.target.value })}
            placeholder="Pull quote text" className={textareaCls} />
        )}
        {block.type === 'divider' && (
          <p className="text-xs text-muted-foreground italic">Horizontal rule / section break</p>
        )}
      </div>
    </div>
  );
}

// ── Article editor (create/edit) ───────────────────────────────────
function ArticleEditor({ article, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    section: article?.section || 'updates',
    author: article?.author || '',
    excerpt: article?.excerpt || '',
    thumbnail_url: article?.thumbnail_url || '',
    layout: article?.layout || 'standard',
    published: article?.published ?? false,
    published_at: article?.published_at ? article.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
  });
  const [blocks, setBlocks] = useState(() => {
    try { return JSON.parse(article?.content_json || '[]'); } catch { return []; }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setF = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
  const setFE = (k) => (e) => setF(k)(e.target.value);

  const addBlock = (type) => setBlocks(b => [...b, defaultBlock(type)]);
  const updateBlock = (i, val) => setBlocks(b => b.map((x, idx) => idx === i ? val : x));
  const removeBlock = (i) => setBlocks(b => b.filter((_, idx) => idx !== i));
  const moveBlock = (i, dir) => {
    const nb = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= nb.length) return;
    [nb[i], nb[j]] = [nb[j], nb[i]];
    setBlocks(nb);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        published_at: form.published ? new Date(form.published_at).toISOString() : null,
        content_json: JSON.stringify(blocks),
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        updated_at: new Date().toISOString(),
      };
      if (article?.id) {
        await base44.entities.NewsArticle.update(article.id, payload);
      } else {
        await base44.entities.NewsArticle.create({ ...payload, created_at: new Date().toISOString() });
      }
      onSave();
    } catch (err) {
      setError('Save failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{article?.id ? 'Edit Article' : 'New Article'}</h2>
        <button onClick={onCancel} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && <div className="bg-destructive/10 border border-red-200 text-destructive text-sm rounded-xl px-4 py-3">{error}</div>}

      {/* Meta fields */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Article Info</h3>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Title <span className="text-destructive">*</span></label>
          <input type="text" value={form.title} onChange={setFE('title')} placeholder="Article title" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Section</label>
            <select value={form.section} onChange={setFE('section')} className={`${inputCls} bg-white`}>
              <option value="updates">Updates</option>
              <option value="blog">Blog</option>
              <option value="publications">Publications</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Layout</label>
            <select value={form.layout} onChange={setFE('layout')} className={`${inputCls} bg-white`}>
              <option value="standard">Standard (narrow)</option>
              <option value="wide">Wide (full)</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Author</label>
          <input type="text" value={form.author} onChange={setFE('author')} placeholder="Author name" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Excerpt / Summary</label>
          <textarea rows={2} value={form.excerpt} onChange={setFE('excerpt')} placeholder="Short description shown in article cards" className={`${inputCls} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Thumbnail URL</label>
          <input type="url" value={form.thumbnail_url} onChange={setFE('thumbnail_url')} placeholder="https://..." className={inputCls} />
          {form.thumbnail_url && <img src={form.thumbnail_url} alt="" className="w-full max-h-28 object-cover rounded-lg" onError={e => e.target.style.display = 'none'} />}
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Publish Date</label>
            <input type="datetime-local" value={form.published_at} onChange={setFE('published_at')} className={inputCls} />
          </div>
          <div className="pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => setF('published')(e.target.checked)} className="rounded accent-primary" />
              <span className="text-sm font-semibold text-foreground">Published</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content blocks */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Content Blocks</h3>
        {blocks.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No blocks yet. Add blocks below to build your article.</p>
        )}
        <div className="space-y-3">
          {blocks.map((block, i) => (
            <BlockEditor
              key={i}
              block={block}
              onChange={val => updateBlock(i, val)}
              onRemove={() => removeBlock(i)}
              onMoveUp={() => moveBlock(i, -1)}
              onMoveDown={() => moveBlock(i, 1)}
              isFirst={i === 0}
              isLast={i === blocks.length - 1}
            />
          ))}
        </div>

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} type="button" onClick={() => addBlock(bt.type)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted hover:border-primary/30 transition-colors">
              <bt.icon className="w-3.5 h-3.5" /> {bt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-5 py-2.5 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
          {saving ? 'Saving...' : article?.id ? 'Update Article' : 'Publish Article'}
        </button>
      </div>
    </div>
  );
}

// ── Main AdminNews component ───────────────────────────────────────
export default function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | article object
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sectionFilter, setSectionFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.NewsArticle.list('-created_at');
      setArticles(data);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    await base44.entities.NewsArticle.delete(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const filtered = sectionFilter === 'all' ? articles : articles.filter(a => a.section === sectionFilter);

  if (editing) {
    return (
      <ArticleEditor
        article={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-foreground mb-2">Delete article?</h3>
            <p className="text-sm text-muted-foreground mb-5">"{deleteTarget.title}" will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg text-sm font-semibold hover:bg-destructive/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-foreground">News Articles</h2>
          <span className="text-sm text-muted-foreground">{articles.length} total</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            {['all','updates','blog','publications'].map(s => (
              <button key={s} onClick={() => setSectionFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${sectionFilter === s ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setEditing('new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Article
          </button>
        </div>
      </div>

      {loading && <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground">No articles yet. Create your first article above.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-border divide-y divide-border">
          {filtered.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4">
              {a.thumbnail_url && (
                <img src={a.thumbnail_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0"  loading="lazy" decoding="async" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm text-foreground truncate">{a.title}</p>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    a.section === 'updates' ? 'bg-primary/5 text-primary border border-orange-200' :
                    a.section === 'blog' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>{a.section}</span>
                  {!a.published && <span className="text-xs text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-full flex-shrink-0">Draft</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {a.author && `${a.author} · `}
                  {a.published_at ? new Date(a.published_at).toLocaleDateString() : 'No date'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={async () => {
                  await base44.entities.NewsArticle.update(a.id, { published: !a.published });
                  load();
                }} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                  {a.published ? <Eye className="w-3.5 h-3.5 text-success" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setEditing(a)} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(a)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

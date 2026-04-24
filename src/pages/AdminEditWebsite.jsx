import React, { useEffect, useMemo, useState } from 'react';
import { Bold, Italic, Save, Image as ImageIcon, Palette, ExternalLink, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PAGES = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'partners', label: 'Partners', path: '/partners' },
  { id: 'chapters', label: 'Chapters', path: '/chapters' },
  { id: 'competitions', label: 'Competitions', path: '/competitions' },
  { id: 'national-finals', label: 'National Finals', path: '/national-finals' },
  { id: 'curriculum', label: 'Curriculum', path: '/curriculum' },
  { id: 'research', label: 'Research', path: '/research' },
];

const PAGE_BLOCKS = {
  home: ['hero_title', 'hero_subtitle', 'stat_1', 'stat_2', 'stat_3', 'stat_4'],
  partners: ['hero_title', 'hero_subtitle', 'cta_label', 'cta_email'],
  chapters: ['hero_title', 'hero_subtitle'],
  competitions: ['hero_title', 'hero_subtitle'],
  'national-finals': ['hero_title', 'hero_subtitle', 'hero_image'],
  curriculum: ['hero_title', 'hero_subtitle'],
  research: ['hero_title', 'hero_subtitle'],
};

function ContentEditor({ value, onChange }) {
  const c = value || {};
  const set = (k, v) => onChange({ ...c, [k]: v });
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-foreground">Text / Value</label>
        <textarea rows={3} value={c.text || ''} onChange={e => set('text', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => set('bold', !c.bold)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${c.bold ? 'bg-foreground text-white border-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>
          <Bold className="w-3.5 h-3.5" /> Bold
        </button>
        <button type="button" onClick={() => set('italic', !c.italic)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${c.italic ? 'bg-foreground text-white border-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>
          <Italic className="w-3.5 h-3.5" /> Italic
        </button>
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border cursor-pointer">
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Text color</span>
          <input type="color" value={c.color || '#111111'} onChange={e => set('color', e.target.value)}
            className="w-5 h-5 border-none cursor-pointer" />
        </label>
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border cursor-pointer">
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Background</span>
          <input type="color" value={c.bg || '#ffffff'} onChange={e => set('bg', e.target.value)}
            className="w-5 h-5 border-none cursor-pointer" />
        </label>
      </div>
      <div>
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" /> Image URL (for image blocks)
        </label>
        <input type="url" value={c.imageUrl || ''} onChange={e => set('imageUrl', e.target.value)}
          placeholder="https://images.unsplash.com/…"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
    </div>
  );
}

export default function AdminEditWebsite() {
  const [pageId, setPageId] = useState(PAGES[0].id);
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState('hero_title');
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const page = useMemo(() => PAGES.find(p => p.id === pageId), [pageId]);
  const blockOptions = PAGE_BLOCKS[pageId] || ['hero_title', 'hero_subtitle'];
  const activeRow = blocks.find(b => b.block === activeBlock);

  const load = async () => {
    try {
      const rows = await base44.entities.SiteContent.filter({ page: pageId });
      setBlocks(rows || []);
      const row = (rows || []).find(r => r.block === activeBlock);
      setDraft(row?.content || {});
    } catch {
      setBlocks([]);
      setDraft({});
    }
  };

  // Reload when page changes
  useEffect(() => {
    setActiveBlock('hero_title');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  // Update draft when active block changes
  useEffect(() => {
    const row = blocks.find(b => b.block === activeBlock);
    setDraft(row?.content || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBlock]);

  const save = async () => {
    setSaving(true);
    try {
      if (activeRow) {
        await base44.entities.SiteContent.update(activeRow.id, { content: draft, updated_at: new Date().toISOString() });
      } else {
        await base44.entities.SiteContent.create({ page: pageId, block: activeBlock, content: draft });
      }
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Save failed: ' + (e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-semibold text-foreground">Edit Website Content</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Changes save to <code>site_content</code> table. Pages must use <code>&lt;EditableBlock&gt;</code> to display them.</p>
        </div>
        <a
          href={page?.path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Preview {page?.label} in new tab
        </a>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
        {/* Editor pane */}
        <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Page</label>
              <select value={pageId} onChange={e => setPageId(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 bg-white">
                {PAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Block</label>
              <select value={activeBlock} onChange={e => setActiveBlock(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 bg-white">
                {blockOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{pageId} / {activeBlock}</p>
            <ContentEditor value={draft} onChange={setDraft} />
          </div>

          <button type="button" onClick={save} disabled={saving}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save block'}</>}
          </button>
        </div>

        {/* Saved blocks panel */}
        <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved blocks on "{page?.label}"</p>
          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground">No blocks saved yet. Select a block and save to create one.</p>
          )}
          {blocks.map(b => (
            <div key={b.id}
              onClick={() => setActiveBlock(b.block)}
              className={`cursor-pointer rounded-xl border p-3 transition-colors ${activeBlock === b.block ? 'border-primary bg-orange-50' : 'border-border hover:border-primary/30'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">{b.block}</span>
                <span className="text-[10px] text-muted-foreground">{b.updated_at ? new Date(b.updated_at).toLocaleDateString() : ''}</span>
              </div>
              {b.content?.text && (
                <p className="text-sm text-muted-foreground truncate">{b.content.text}</p>
              )}
              {b.content?.imageUrl && (
                <p className="text-xs text-primary truncate">{b.content.imageUrl}</p>
              )}
            </div>
          ))}

          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Saved blocks are stored in Supabase. To display them on the live site, wrap page elements with <code className="bg-muted px-1 rounded">&lt;EditableBlock page="home" block="hero_title"&gt;</code>. The <code className="bg-muted px-1 rounded">EditableBlock</code> component is at <code className="bg-muted px-1 rounded">src/components/EditableBlock.jsx</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

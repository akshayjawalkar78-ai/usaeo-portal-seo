import React, { useEffect, useMemo, useState } from 'react';
import { Bold, Italic, Save, Image as ImageIcon, Palette, RefreshCw } from 'lucide-react';
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

// Blocks we expose for each page. Keep generic so content schema is flexible.
const DEFAULT_BLOCKS = ['hero_title', 'hero_subtitle', 'hero_image', 'page_bg', 'section_1', 'section_2'];

function ContentEditor({ value, onChange }) {
  const c = value || {};
  const set = (k, v) => onChange({ ...c, [k]: v });
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-foreground">Text</label>
        <textarea rows={3} value={c.text || ''} onChange={e => set('text', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => set('bold', !c.bold)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${c.bold ? 'bg-foreground text-white border-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>
          <Bold className="w-3.5 h-3.5" /> Bold
        </button>
        <button onClick={() => set('italic', !c.italic)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${c.italic ? 'bg-foreground text-white border-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}>
          <Italic className="w-3.5 h-3.5" /> Italic
        </button>
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border cursor-pointer">
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Text</span>
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
          <ImageIcon className="w-3.5 h-3.5" /> Image URL
        </label>
        <input type="url" value={c.imageUrl || ''} onChange={e => set('imageUrl', e.target.value)}
          placeholder="https://…"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
    </div>
  );
}

export default function AdminEditWebsite() {
  const [pageId, setPageId] = useState(PAGES[0].id);
  const [blocks, setBlocks] = useState([]);
  const [active, setActive] = useState(DEFAULT_BLOCKS[0]);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const page = useMemo(() => PAGES.find(p => p.id === pageId), [pageId]);
  const activeRow = blocks.find(b => b.block === active);

  const load = async () => {
    try {
      const rows = await base44.entities.SiteContent.filter({ page: pageId });
      setBlocks(rows || []);
      const row = (rows || []).find(r => r.block === active);
      setDraft(row?.content || {});
    } catch {
      setBlocks([]);
      setDraft({});
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pageId]);
  useEffect(() => { setDraft(activeRow?.content || {}); /* eslint-disable-next-line */ }, [active, blocks.length]);

  const save = async () => {
    setSaving(true);
    try {
      if (activeRow) {
        await base44.entities.SiteContent.update(activeRow.id, { content: draft, updated_at: new Date().toISOString() });
      } else {
        await base44.entities.SiteContent.create({ page: pageId, block: active, content: draft });
      }
      await load();
      setPreviewKey(k => k + 1);
    } catch (e) {
      alert('Save failed: ' + (e?.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Edit Website</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Edit page content and preview changes live. Requires pages to read from the <code>site_content</code> table via the <code>EditableBlock</code> component.</p>
        </div>
        <button onClick={() => setPreviewKey(k => k + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh preview
        </button>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        {/* Editor pane */}
        <div className="bg-white rounded-2xl border border-border p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground">Page</label>
            <select value={pageId} onChange={e => setPageId(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 bg-white">
              {PAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Block</label>
            <select value={active} onChange={e => setActive(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1 bg-white">
              {DEFAULT_BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="border-t border-border pt-4">
            <ContentEditor value={draft} onChange={setDraft} />
          </div>

          <button onClick={save} disabled={saving}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save block'}
          </button>

          {blocks.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Existing blocks on this page</p>
              <div className="space-y-1">
                {blocks.map(b => (
                  <button key={b.id} onClick={() => setActive(b.block)}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${active === b.block ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                    {b.block}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview pane */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-2 text-xs font-semibold text-muted-foreground flex items-center justify-between">
            <span>Preview · {page?.path}</span>
            <span className="text-[10px] uppercase tracking-wider">Live</span>
          </div>
          <iframe
            key={previewKey}
            src={`${page?.path}?preview=1`}
            title="Website preview"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            className="w-full h-[720px] border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}

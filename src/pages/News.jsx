import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { base44 } from '@/api/base44Client';

const SECTIONS = [
  { id: 'all', label: 'All' },
  { id: 'updates', label: 'Updates' },
  { id: 'blog', label: 'Blog' },
  { id: 'publications', label: 'Publications' },
];

function renderBlock(block, idx) {
  switch (block.type) {
    case 'heading':
      return <h2 key={idx} className="text-2xl font-sans font-semibold text-foreground mt-8 mb-3">{block.content}</h2>;
    case 'subheading':
      return <h3 key={idx} className="text-lg font-semibold text-foreground mt-6 mb-2">{block.content}</h3>;
    case 'text':
      return (
        <div key={idx} className="text-foreground/90 leading-relaxed mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />
      );
    case 'image':
      return (
        <figure key={idx} className="my-6">
          <img src={block.url} alt={block.alt || ''} className="w-full rounded-xl object-cover max-h-[480px]" />
          {block.caption && <figcaption className="text-center text-xs text-muted-foreground mt-2">{block.caption}</figcaption>}
        </figure>
      );
    case 'video': {
      const embedUrl = getVideoEmbed(block.url);
      return (
        <div key={idx} className="my-6 aspect-video rounded-xl overflow-hidden bg-muted">
          <iframe src={embedUrl} title="Video" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    case 'quote':
      return (
        <blockquote key={idx} className="my-6 border-l-4 border-primary pl-5 italic text-foreground/80 text-lg">
          {block.content}
        </blockquote>
      );
    case 'divider':
      return <hr key={idx} className="my-8 border-border" />;
    default:
      return null;
  }
}

function getVideoEmbed(url) {
  if (!url) return url;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function ArticleCard({ article }) {
  const blocks = (() => { try { return JSON.parse(article.content_json || '[]'); } catch { return []; } })();
  const firstImage = blocks.find(b => b.type === 'image')?.url;

  return (
    <Link to={`/news/${article.id}`} className="group block bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
      {(firstImage || article.thumbnail_url) && (
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img src={article.thumbnail_url || firstImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            article.section === 'updates' ? 'bg-primary/5 text-primary border border-orange-200' :
            article.section === 'blog' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            'bg-purple-50 text-purple-700 border border-purple-200'
          }`}>
            {article.section === 'updates' ? 'Updates' : article.section === 'blog' ? 'Blog' : 'Publications'}
          </span>
          {article.published_at && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
        <h3 className="font-sans font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
        {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>}
        {article.author && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" /> {article.author}
          </p>
        )}
      </div>
    </Link>
  );
}

function ArticleDetail({ article, onBack }) {
  const blocks = (() => { try { return JSON.parse(article.content_json || '[]'); } catch { return []; } })();
  const maxWidth = article.layout === 'wide' ? 'max-w-4xl' : 'max-w-2xl';

  return (
    <div className={`${maxWidth} mx-auto px-5 py-12`}>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to News
      </button>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          article.section === 'updates' ? 'bg-primary/5 text-primary border border-orange-200' :
          article.section === 'blog' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
          'bg-purple-50 text-purple-700 border border-purple-200'
        }`}>
          {article.section === 'updates' ? 'Updates' : article.section === 'blog' ? 'Blog' : 'Publications'}
        </span>
        {article.published_at && (
          <span className="text-xs text-muted-foreground">
            {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>
      <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-foreground mb-4 leading-tight">{article.title}</h1>
      {article.author && <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</p>}
      {article.excerpt && <p className="text-base text-muted-foreground mb-6 leading-relaxed border-l-2 border-border pl-4">{article.excerpt}</p>}
      {article.thumbnail_url && (
        <img src={article.thumbnail_url} alt={article.title} className="w-full rounded-xl mb-8 object-cover max-h-[400px]" />
      )}
      <div className="article-body">
        {blocks.map((block, idx) => renderBlock(block, idx))}
      </div>
    </div>
  );
}

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.NewsArticle.list('-published_at')
      .then(data => setArticles(data.filter(a => a.published)))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeSection === 'all' ? articles : articles.filter(a => a.section === activeSection);

  const updates = filtered.filter(a => a.section === 'updates');
  const blog = filtered.filter(a => a.section === 'blog');
  const publications = filtered.filter(a => a.section === 'publications');

  if (selected) {
    return (
      <PageLayout>
        <ArticleDetail article={selected} onBack={() => setSelected(null)} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-16 pb-10 px-5 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">USAEO</p>
            <h1 className="font-sans text-4xl sm:text-5xl text-foreground mb-4">News</h1>
            <p className="text-muted-foreground max-w-lg">Updates, articles, and research from the USAEO community.</p>
          </motion.div>

          {/* Section filter tabs */}
          <div className="flex items-center gap-1 mt-8 bg-muted rounded-xl p-1 w-fit">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === s.id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-5">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles yet.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && activeSection === 'all' && (
            <div className="space-y-14">
              {updates.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-sans text-2xl font-semibold text-foreground">Updates</h2>
                    <button onClick={() => setActiveSection('updates')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">All updates <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {updates.slice(0, 3).map(a => <div key={a.id} onClick={() => setSelected(a)} className="cursor-pointer"><ArticleCard article={a} /></div>)}
                  </div>
                </div>
              )}
              {blog.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-sans text-2xl font-semibold text-foreground">Blog</h2>
                    <button onClick={() => setActiveSection('blog')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">All posts <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blog.slice(0, 3).map(a => <div key={a.id} onClick={() => setSelected(a)} className="cursor-pointer"><ArticleCard article={a} /></div>)}
                  </div>
                </div>
              )}
              {publications.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-sans text-2xl font-semibold text-foreground">Publications</h2>
                    <button onClick={() => setActiveSection('publications')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">All publications <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {publications.slice(0, 3).map(a => <div key={a.id} onClick={() => setSelected(a)} className="cursor-pointer"><ArticleCard article={a} /></div>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && activeSection !== 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map(a => <div key={a.id} onClick={() => setSelected(a)} className="cursor-pointer"><ArticleCard article={a} /></div>)}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

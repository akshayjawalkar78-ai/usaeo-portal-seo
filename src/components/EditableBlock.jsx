import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Renders either the saved site_content row (if present) or the provided children/defaults.
// Usage:
//   <EditableBlock page="home" block="hero_title" as="h1" className="...">Fallback text</EditableBlock>
export default function EditableBlock({ page, block, as: Tag = 'div', className = '', children }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.SiteContent?.filter({ page, block })
      .then(rows => { if (!cancelled) setContent(rows?.[0]?.content || null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [page, block]);

  if (!content) {
    return <Tag className={className}>{children}</Tag>;
  }

  const style = {
    color: content.color || undefined,
    backgroundColor: content.bg || undefined,
    fontWeight: content.bold ? 700 : undefined,
    fontStyle: content.italic ? 'italic' : undefined,
  };

  if (content.imageUrl) {
    return <img src={content.imageUrl} alt="" className={className} style={style}  loading="lazy" decoding="async" />;
  }

  return (
    <Tag className={className} style={style}>
      {content.text || children}
    </Tag>
  );
}

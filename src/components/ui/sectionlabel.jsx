import React from 'react';

export default function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
      {children}
    </p>
  );
}

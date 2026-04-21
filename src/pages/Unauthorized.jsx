import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <span className="p-3 bg-orange-50 rounded-full">
            <ShieldAlert className="w-6 h-6 text-orange-500" />
          </span>
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Access denied</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This page requires admin access. Contact an administrator if you believe this is an error.
        </p>
        <Link to="/dashboard"
          className="inline-flex px-5 py-2 bg-foreground text-white rounded-full text-sm font-medium hover:bg-foreground/85 transition-colors">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

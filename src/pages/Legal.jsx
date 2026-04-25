import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

export default function Legal() {
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-5 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-2">Legal & Tax Information</h1>
        <p className="text-muted-foreground mb-10">Official nonprofit status and tax information for USA Economics Olympiad.</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Tax Identification</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">EIN / Charity ID:</span> 41-2939863
            </p>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Nonprofit Status</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Recognized as a <span className="font-medium text-foreground">501(c)(3)</span> tax-exempt organization under the Internal Revenue Code.</li>
              <li>Classified as a <span className="font-medium text-foreground">509(a)(2)</span> publicly supported organization.</li>
              <li>Operates as a <span className="font-medium text-foreground">public charity</span>.</li>
              <li>Listed on the IRS <span className="font-medium text-foreground">Publication 78</span> data (Tax Exempt Organization Search).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Donations</h2>
            <p className="text-sm text-muted-foreground">
              Contributions to USA Economics Olympiad are tax-deductible to the extent permitted by law. Please retain your donation receipt for tax records.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Contact</h2>
            <p className="text-sm text-muted-foreground">
              Questions about our nonprofit status?{' '}
              <a href="mailto:info@usaeo.org" className="text-primary hover:underline">info@usaeo.org</a>
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

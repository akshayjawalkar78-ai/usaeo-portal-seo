// Partner events — real data from YEL competition guide + YEL announcements.
// cutoff: May 3, 2026 — events before this date are "past", on/after are "upcoming".

export const PARTNER_COMPETITIONS = [
  // ── UPCOMING ───────────────────────────────────────────────────────────────
  {
    id: 'yel-student-scholars-research-2026',
    partner: 'Youth Economy Lab',
    partnerShort: 'YEL',
    partnerLogo: '/logos/YEL.png',
    partnerUrl: 'https://youtheconomylab.com/',
    coPartner: 'Synthica',
    coPartnerLogo: '/logos/synthica.png',
    coPartnerUrl: 'https://www.synthica.org/',
    title: 'YEL Student Scholars Research Competition',
    date: 'Dates TBA',
    isoDate: '2026-12-31',
    status: 'upcoming',
    badge: 'Ongoing · Virtual · Global',
    category: 'Research Proposal Competition',
    desc: 'Submit an original economics or finance research proposal (1-2 pages). Top 5 winners earn guaranteed admission to the Synthica Research Cohort (normally ~2% acceptance), academic publication mentorship, and signed certificates from YEL and Synthica. Open to high school students worldwide. Co-hosted with Synthica Research Group.',
    highlights: [
      'Top 5 → guaranteed Synthica Research Cohort admission',
      'Publication pathway to indexed academic journals',
      'Judged on research design, originality, methodology, and clarity (100 pts)',
      'Top 20 pitch live at a research seminar to Synthica professors',
    ],
    externalUrl: 'https://youtheconomylab.com/events',
  },
];

export const PARTNER_PROGRAMS = [
  // ── UPCOMING ───────────────────────────────────────────────────────────────
  {
    id: 'yel-summer-fellowship-2026',
    partner: 'Youth Economics Lab',
    partnerShort: 'YEL',
    partnerLogo: '/logos/YEL.png',
    partnerUrl: 'https://youtheconomylab.com/',
    title: 'YEL Research Fellowship',
    date: 'Dates TBA',
    isoDate: '2026-12-31',
    status: 'upcoming',
    badge: 'Ongoing · Virtual',
    category: 'Fellowship',
    desc: 'YEL pairs students with economists and PhD mentors for mentored original research, with a pathway to publication in the YEL student journal.',
    externalUrl: 'https://youtheconomylab.com/events',
  },
];

export const PARTNER_WORKSHOPS = [
  // ── UPCOMING ───────────────────────────────────────────────────────────────
  {
    id: 'yel-breaking-into-finance-may-2026',
    partner: 'Youth Economics Lab',
    partnerShort: 'YEL',
    partnerLogo: '/logos/YEL.png',
    partnerUrl: 'https://youtheconomylab.com/',
    title: 'Breaking into Finance 101',
    date: 'May 9, 2026',
    isoDate: '2026-05-09',
    time: '3:00 PM UTC',
    status: 'upcoming',
    instructor: 'Mr. Mukesh Agarwal',
    role: 'CFO, Spinneys Group; Former EY Executive',
    topic: 'Career pathways in finance and economics, the Spinneys IPO, breaking into Finance from high school',
    desc: 'Join CFO of Spinneys Group (one of the largest premium food retail chains in the Middle East and a former EY executive) as he breaks down his career journey, his role in launching the Spinneys IPO, and practical pathways for students to break into Finance and Economics. Free and open to all high school and university students and recent graduates.',
    zoomUrl: 'https://us06web.zoom.us/meeting/register/DV9X8YOpRWGFFiVD10lEpw',
    free: true,
    openTo: 'High school students, university students, recent graduates',
  },
];

export const UPCOMING_PARTNER_EVENTS = [
  ...PARTNER_COMPETITIONS.filter(e => e.status === 'upcoming'),
  ...PARTNER_PROGRAMS.filter(e => e.status === 'upcoming'),
  ...PARTNER_WORKSHOPS.filter(e => e.status === 'upcoming'),
];

export const UPCOMING_PARTNER_WORKSHOPS = PARTNER_WORKSHOPS.filter(e => e.status === 'upcoming');
export const PAST_PARTNER_WORKSHOPS = PARTNER_WORKSHOPS.filter(e => e.status === 'past');

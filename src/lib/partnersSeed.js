// Canonical partner list, shared by Home + Partners pages.
// `wordmark` renders the text next to the logo as a combination mark.
// `tags` are used to filter partners into the three "how they contribute" sections on the Partners page:
//   'academic' | 'awareness' | 'research'
export const PARTNERS = [
  {
    name: 'Stellar',
    logo: '/logos/Stellar.png',
    url: 'https://stellarlearning.app/',
    desc: 'Student learning tools',
    tags: ['academic'],
  },
  {
    name: 'Crackd',
    logo: '/logos/Crackd.png',
    url: 'https://crackd.it/',
    desc: 'Test prep platform',
    tags: ['academic'],
  },
  {
    name: 'Launchpoint',
    logo: '/logos/Launchpoint.svg',
    url: 'https://www.launchpointhq.com/',
    desc: 'Career launchpad',
    logoScale: 1.5,
    logoCrop: true,
    tags: ['research'],
  },
  {
    name: 'Fintech Scholars',
    logo: '/logos/Fintech-Scholars.png',
    url: 'https://www.fintechscholars.org/',
    desc: 'Financial literacy',
    tags: ['awareness'],
  },
  {
    name: 'Think Finance',
    logo: '/logos/Think-Finance.png',
    url: 'https://www.think-finance.org/',
    desc: 'Finance education',
    logoScale: 1.5,
    logoCrop: true,
    tags: ['awareness', 'academic'],
  },
  {
    name: 'YRI',
    logo: '/logos/YRI.png',
    url: 'https://www.yriscience.com/',
    desc: 'Youth research institute',
    tags: ['research'],
  },
  {
    name: 'FYC',
    logo: '/logos/FYC-Logo.png',
    url: 'https://linktr.ee/financialyouthclub',
    desc: 'Financial Youth Club',
    tags: ['awareness'],
  },
  {
    name: 'CFE',
    logo: '/logos/CFE.png',
    url: 'https://councilfe.org/',
    desc: 'Council for Financial Education',
    tags: ['awareness', 'academic'],
  },
  {
    name: 'Youth Economics Lab',
    logo: '/logos/yel.png',
    url: 'https://youtheconomylab.com/',
    desc: 'Student-led economics research',
    tags: ['research', 'academic'],
  },
  {
    name: 'Synthica',
    logo: '/logos/synthica.png',
    url: 'https://www.synthica.org/',
    desc: 'AI + economics tooling',
    wordmark: { text: 'Synthica', fontFamily: 'Garet, sans-serif', fontWeight: 300 },
    tags: ['research'],
  },
  {
    name: 'A-Warded',
    logo: '/logos/awarded.ico',
    url: 'https://a-warded.org/',
    desc: 'Student awards platform',
    wordmark: { text: 'A-Warded', fontFamily: 'Sora, sans-serif', fontWeight: 600 },
    tags: ['awareness'],
  },
  {
    name: 'Southeast Asian Economics Project',
    shortName: 'SEAE',
    logo: '/logos/seaecon.png',
    url: 'https://seaecon.org/',
    desc: 'Regional economics education',
    wordmark: { text: 'Southeast Asian Economics Project', fontFamily: 'Inter, sans-serif', fontWeight: 500 },
    tags: ['research', 'awareness'],
  },
];

export const PARTNER_BY_NAME = Object.fromEntries(PARTNERS.map(p => [p.name, p]));

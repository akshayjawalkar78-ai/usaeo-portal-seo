// Canonical partner list, shared by Home + Partners pages.
// `wordmark` renders the text next to the logo as a combination mark.
// `tags` are used to filter partners into the three "how they contribute" sections on the Partners page:
//   'academic' | 'awareness' | 'research'
export const PARTNERS = [
  {
    name: 'Stellar',
    logo: 'https://www.usaeo.org/imgs/sponsors/Stellar.png',
    url: 'https://stellarlearning.app/',
    desc: 'Student learning tools',
    tags: ['academic'],
  },
  {
    name: 'Crackd',
    logo: 'https://www.usaeo.org/imgs/sponsors/Crackd.png',
    url: 'https://crackd.it/',
    desc: 'Test prep platform',
    tags: ['academic'],
  },
  {
    name: 'Launchpoint',
    logo: 'https://www.usaeo.org/imgs/sponsors/Launchpoint.png',
    url: 'https://www.launchpointhq.com/',
    desc: 'Career launchpad',
    logoScale: 1.5,
    logoCrop: true,
    tags: ['research'],
  },
  {
    name: 'Fintech Scholars',
    logo: 'https://www.usaeo.org/imgs/sponsors/FintechScholars.png',
    url: 'https://www.fintechscholars.org/',
    desc: 'Financial literacy',
    tags: ['awareness'],
  },
  {
    name: 'Think Finance',
    logo: 'https://www.usaeo.org/imgs/sponsors/ThinkFinance.png',
    url: 'https://www.think-finance.org/',
    desc: 'Finance education',
    logoScale: 1.5,
    logoCrop: true,
    tags: ['awareness', 'academic'],
  },
  {
    name: 'YRI',
    logo: 'https://www.usaeo.org/imgs/sponsors/YRI.png',
    url: 'https://www.yriscience.com/',
    desc: 'Youth research institute',
    tags: ['research'],
  },
  {
    name: 'FYC',
    logo: 'https://www.usaeo.org/imgs/sponsors/FYC.png',
    url: 'https://linktr.ee/financialyouthclub',
    desc: 'Financial Youth Club',
    tags: ['awareness'],
  },
  {
    name: 'CFE',
    logo: 'https://www.usaeo.org/imgs/sponsors/CFE.png',
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
    tags: ['research', 'awareness'],
  },
];

export const PARTNER_BY_NAME = Object.fromEntries(PARTNERS.map(p => [p.name, p]));

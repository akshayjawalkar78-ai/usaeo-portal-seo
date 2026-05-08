export const SITE_URL = 'https://usaeo.org';
export const SITE_NAME = 'USA Economics Olympiad';
export const SITE_SHORT = 'USAEO';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logos/USAEOlogo.png`;

export const DEFAULT_TITLE = 'USA Economics Olympiad | Free Economics Competition for High School Students';
export const DEFAULT_DESCRIPTION = 'USAEO is a free, 501(c)(3) nonprofit national economics competition for high school students. Quiz Bowl, Essay, and National Finals - open to all.';

export const TITLE_TEMPLATE = '%s | USA Economics Olympiad';

export const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: SITE_SHORT,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE, width: 512, height: 512 },
  email: 'info@usaeo.org',
  description: 'USAEO is a 501(c)(3) nonprofit running a free national economics competition for high school students.',
  nonprofitStatus: 'Nonprofit501c3',
  areaServed: 'US',
  sameAs: [
    'https://www.instagram.com/usaolympiad/',
    'https://www.linkedin.com/company/usa-economics-olympiad',
    'https://www.tiktok.com/@usaeconolympiad',
  ],
};

export const PAGE_SEO = {
  '/': {
    title: 'USA Economics Olympiad | Free Economics Competition for High School Students',
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: 'About USAEO - Free High School Economics Olympiad Nonprofit',
    description: 'Learn about USA Economics Olympiad, a 501(c)(3) nonprofit running a free national economics competition open to all U.S. high school students.',
  },
  '/competitions': {
    title: 'Economics Competitions for High School Students | USAEO',
    description: 'Free national economics competitions: Quiz Bowl, Essay, National Qualifiers, and National Finals. Open to all high school students.',
  },
  '/competitions/quiz-bowl': {
    title: 'USAEO Quiz Bowl - High School Economics Team Competition',
    description: 'Free national high school economics quiz bowl. Team-based competition open to all students. Register your school today.',
  },
  '/competitions/essay': {
    title: 'USAEO Essay Competition - High School Economics Essay Contest',
    description: 'Free national economics essay competition for high school students. Submit your essay and compete for the national title.',
  },
  '/competitions/qualifiers': {
    title: 'USAEO National Qualifiers - Online Economics Olympiad Round',
    description: 'Free online qualifying round of the USA Economics Olympiad. Open to all high school students nationwide.',
  },
  '/competitions/finals': {
    title: 'USAEO National Finals - High School Economics Olympiad Finals',
    description: 'In-person National Finals of the USA Economics Olympiad. Top high school competitors face off for the national title.',
  },
  '/competitions/partner-competitions': {
    title: 'Partner Economics Competitions | USAEO',
    description: 'Partner economics competitions affiliated with USA Economics Olympiad for high school students.',
  },
  '/partner-programs': {
    title: 'Partner Economics Programs | USAEO',
    description: 'Partner economics programs and learning resources affiliated with USA Economics Olympiad.',
  },
  '/news': {
    title: 'USAEO News and Announcements',
    description: 'Latest news, announcements, and articles from the USA Economics Olympiad.',
  },
  '/workshops': {
    title: 'Free Economics Workshops for High School Students | USAEO',
    description: 'Free economics workshops and learning sessions hosted by USA Economics Olympiad. Open to all high school students.',
  },
  '/curriculum': {
    title: 'Free Economics Curriculum for High School Students | USAEO',
    description: 'Free six-unit open economics curriculum from USA Economics Olympiad. High school economics resources, no cost, open to all.',
  },
  '/research': {
    title: 'Student Economics Research | USAEO',
    description: 'High school economics research opportunities and resources from USA Economics Olympiad.',
  },
  '/chapters': {
    title: 'USAEO School Chapters - Local High School Economics Clubs',
    description: 'Find or start a USA Economics Olympiad chapter at your high school. Local economics clubs nationwide.',
  },
  '/team': {
    title: 'Our Team | USA Economics Olympiad',
    description: 'Meet the leadership and team behind the USA Economics Olympiad nonprofit.',
  },
  '/partners': {
    title: 'Partners | USA Economics Olympiad',
    description: 'USAEO partner organizations supporting free economics education for high school students nationwide.',
  },
  '/careers/apply': {
    title: 'Apply to Join USAEO - Volunteer & Team Roles',
    description: 'Apply to volunteer or join the USA Economics Olympiad team. Help expand free economics education for high school students.',
  },
  '/legal': {
    title: 'Legal | USA Economics Olympiad',
    description: 'Privacy policy and terms of service for USA Economics Olympiad.',
  },
  '/register/quiz-bowl': {
    title: 'Register for USAEO Quiz Bowl',
    description: 'Register your school or team for the free USAEO national high school economics Quiz Bowl.',
  },
  '/register/essay': {
    title: 'Register for USAEO Essay Competition',
    description: 'Register for the free USAEO national high school economics essay competition.',
  },
  '/register/chapter': {
    title: 'Start a USAEO Chapter at Your School',
    description: 'Register a new USA Economics Olympiad chapter at your high school. Free, open to all schools.',
  },
};

export function getPageSeo(pathname) {
  return PAGE_SEO[pathname] || { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}

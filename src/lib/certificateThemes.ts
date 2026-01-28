// Certificate design themes for each course
// Based on the reference images provided

export interface CertificateTheme {
  name: string;
  courseTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  decorativeElements: string[];
  fontStyle: 'vintage' | 'modern' | 'art-deco' | 'cyberpunk' | 'elegant';
}

export const certificateThemes: Record<number, CertificateTheme> = {
  1: {
    name: 'The Solo Singularity',
    courseTitle: 'The Solo Singularity',
    primaryColor: '#8B4513', // Saddle brown
    secondaryColor: '#DAA520', // Goldenrod
    accentColor: '#CD853F', // Peru
    backgroundColor: '#FDF5E6', // Old lace
    borderColor: '#8B4513',
    textColor: '#3D2914',
    decorativeElements: ['compass', 'navigation', 'vintage-border'],
    fontStyle: 'vintage',
  },
  2: {
    name: 'Signal in the Noise',
    courseTitle: 'Signal in the Noise',
    primaryColor: '#1E3A5F', // Navy blue
    secondaryColor: '#4A90A4', // Steel blue
    accentColor: '#87CEEB', // Sky blue
    backgroundColor: '#F0F8FF', // Alice blue
    borderColor: '#1E3A5F',
    textColor: '#0D1B2A',
    decorativeElements: ['waves', 'nautical', 'anchor'],
    fontStyle: 'elegant',
  },
  3: {
    name: 'Neon Identity',
    courseTitle: 'Neon Identity',
    primaryColor: '#FF00FF', // Magenta
    secondaryColor: '#00FFFF', // Cyan
    accentColor: '#FF1493', // Deep pink
    backgroundColor: '#0D0D1A', // Very dark blue
    borderColor: '#FF00FF',
    textColor: '#FFFFFF',
    decorativeElements: ['circuits', 'neon-lines', 'digital-grid'],
    fontStyle: 'cyberpunk',
  },
  4: {
    name: 'The Ghost Machine',
    courseTitle: 'The Ghost Machine',
    primaryColor: '#B87333', // Copper
    secondaryColor: '#8B7355', // Burly wood
    accentColor: '#CD7F32', // Bronze
    backgroundColor: '#F5F5DC', // Beige
    borderColor: '#8B7355',
    textColor: '#3C2415',
    decorativeElements: ['gears', 'cogs', 'steampunk-border'],
    fontStyle: 'vintage',
  },
  5: {
    name: 'The Infinite Loop',
    courseTitle: 'The Infinite Loop',
    primaryColor: '#C4A35A', // Metallic gold
    secondaryColor: '#1A1A2E', // Dark navy
    accentColor: '#E6BE8A', // Champagne
    backgroundColor: '#1A1A2E',
    borderColor: '#C4A35A',
    textColor: '#F4F0E6',
    decorativeElements: ['art-deco-lines', 'geometric', 'sunburst'],
    fontStyle: 'art-deco',
  },
  6: {
    name: 'Digital Gravity',
    courseTitle: 'Digital Gravity',
    primaryColor: '#228B22', // Forest green
    secondaryColor: '#8FBC8F', // Dark sea green
    accentColor: '#90EE90', // Light green
    backgroundColor: '#F0FFF0', // Honeydew
    borderColor: '#228B22',
    textColor: '#1B4D1B',
    decorativeElements: ['leaves', 'organic-curves', 'nature-border'],
    fontStyle: 'elegant',
  },
  7: {
    name: 'Zero-Point Energy',
    courseTitle: 'Zero-Point Energy',
    primaryColor: '#1C3D1C', // Dark green (money)
    secondaryColor: '#85BB65', // Dollar bill green
    accentColor: '#C4A35A', // Gold
    backgroundColor: '#F5F5DC', // Beige (parchment)
    borderColor: '#1C3D1C',
    textColor: '#1C3D1C',
    decorativeElements: ['guilloche', 'bank-note-pattern', 'seal'],
    fontStyle: 'vintage',
  },
  8: {
    name: 'The Neuro-Link',
    courseTitle: 'The Neuro-Link',
    primaryColor: '#DAA520', // Goldenrod
    secondaryColor: '#B8860B', // Dark goldenrod
    accentColor: '#FFD700', // Gold
    backgroundColor: '#1A1A2E', // Dark navy
    borderColor: '#DAA520',
    textColor: '#F4F0E6',
    decorativeElements: ['geometric-gold', 'art-deco-corners', 'zigzag'],
    fontStyle: 'art-deco',
  },
  9: {
    name: 'Future State',
    courseTitle: 'Future State',
    primaryColor: '#4169E1', // Royal blue
    secondaryColor: '#6495ED', // Cornflower blue
    accentColor: '#00CED1', // Dark turquoise
    backgroundColor: '#F8F9FA', // Light gray
    borderColor: '#4169E1',
    textColor: '#1A1A2E',
    decorativeElements: ['timeline', 'modern-lines', 'nodes'],
    fontStyle: 'modern',
  },
  10: {
    name: 'The Final Transmission',
    courseTitle: 'The Final Transmission',
    primaryColor: '#8B0000', // Dark red (curtain)
    secondaryColor: '#B22222', // Fire brick
    accentColor: '#FFD700', // Gold (trim)
    backgroundColor: '#FFF8DC', // Cornsilk
    borderColor: '#8B0000',
    textColor: '#2F0909',
    decorativeElements: ['curtains', 'stage', 'spotlight'],
    fontStyle: 'elegant',
  },
};

export function getThemeByOrderNumber(orderNumber: number): CertificateTheme {
  return certificateThemes[orderNumber] || certificateThemes[1];
}

export function getThemeByCourseTitle(title: string): CertificateTheme {
  const entry = Object.values(certificateThemes).find(
    theme => theme.courseTitle.toLowerCase() === title.toLowerCase()
  );
  return entry || certificateThemes[1];
}

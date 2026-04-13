export interface Theme {
  gradient: [string, string, string];
  grid: boolean;
  textColor: string;
  highlightColor: string;
}

const themes: Record<string, Theme> = {
  'bright-green': {
    gradient: ['#48e08a', '#2dc97a', '#1aaf66'],
    grid: true,
    textColor: '#022c22', // deep green-black (better than pure black)
    highlightColor: '#ffffff', // white pops hard on green
  },

  'dark-grid': {
    gradient: ['#020617', '#0f172a', '#1e293b'],
    grid: true,
    textColor: '#f8fafc',
    highlightColor: '#38bdf8', // sky-400
  },

  'green-gradient': {
    gradient: ['#051a0f', '#0d3d1a', '#166534'],
    grid: true,
    textColor: '#ecfdf5',
    highlightColor: '#4ade80', // green-400
  },

  'light-blue-gradient': {
    gradient: ['#0c2340', '#0ea5e9', '#e0f2fe'],
    grid: true,
    textColor: '#ffffff',
    highlightColor: '#38bdf8',
  },

  'dark-blue-gradient': {
    gradient: ['#0c1b3d', '#1e3a8a', '#3b82f6'],
    grid: true,
    textColor: '#f0f9ff',
    highlightColor: '#93c5fd', // softer blue highlight
  },

  'forest-dark': {
    gradient: ['#0f2818', '#1a3a2a', '#2d5a3d'],
    grid: true,
    textColor: '#ecfdf5',
    highlightColor: '#6ee7b7', // mint accent
  },

  'ocean-dark': {
    gradient: ['#0a1929', '#132f4c', '#1a4d7a'],
    grid: true,
    textColor: '#e0f2fe',
    highlightColor: '#7dd3fc',
  },

  'slate-dark': {
    gradient: ['#1a202c', '#2d3748', '#4a5568'],
    grid: true,
    textColor: '#f1f5f9',
    highlightColor: '#cbd5f5', // subtle, premium feel
  },

  'midnight-dark': {
    gradient: ['#0f0920', '#1a0933', '#2d0d4d'],
    grid: true,
    textColor: '#f5f3ff',
    highlightColor: '#a78bfa', // purple accent fits theme
  },

  'emerald-gradient': {
    gradient: ['#05260f', '#065f46', '#10b981'],
    grid: true,
    textColor: '#ecfdf5',
    highlightColor: '#34d399',
  },
};

export function getThemes(): string[] {
  return Object.keys(themes);
}
export function getTheme(name: string): Theme {
  const theme = themes[name];
  if (!theme) throw new Error(`Theme not found: ${name}`);
  return theme;
}

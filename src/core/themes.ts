const themes: Record<string, Theme> = {
  'dark-grid': {
    gradient: ['#020617', '#0f172a', '#1e293b'],
    textColor: '#f8fafc',
    highlightColor: '#38bdf8',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'bright-green': {
    gradient: ['#48e08a', '#2dc97a', '#1aaf66'],
    textColor: '#022c22',
    highlightColor: '#ffffff',
    gridLineTheme: 'dark',
    badgeTheme: 'dark',
  },

  'green-gradient': {
    gradient: ['#051a0f', '#0d3d1a', '#166534'],
    textColor: '#ecfdf5',
    highlightColor: '#4ade80',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'light-blue-gradient': {
    gradient: ['#0c2340', '#0ea5e9', '#e0f2fe'],
    textColor: '#ffffff',
    highlightColor: '#38bdf8',
    gridLineTheme: 'light', // because top is dark
    badgeTheme: 'light',
  },

  'dark-blue-gradient': {
    gradient: ['#0c1b3d', '#1e3a8a', '#3b82f6'],
    textColor: '#f0f9ff',
    highlightColor: '#93c5fd',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'forest-dark': {
    gradient: ['#0f2818', '#1a3a2a', '#2d5a3d'],
    textColor: '#ecfdf5',
    highlightColor: '#6ee7b7',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'ocean-dark': {
    gradient: ['#0a1929', '#132f4c', '#1a4d7a'],
    textColor: '#e0f2fe',
    highlightColor: '#7dd3fc',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'slate-dark': {
    gradient: ['#1a202c', '#2d3748', '#4a5568'],
    textColor: '#f1f5f9',
    highlightColor: '#cbd5f5',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'midnight-dark': {
    gradient: ['#0f0920', '#1a0933', '#2d0d4d'],
    textColor: '#f5f3ff',
    highlightColor: '#a78bfa',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },

  'emerald-gradient': {
    gradient: ['#05260f', '#065f46', '#10b981'],
    textColor: '#ecfdf5',
    highlightColor: '#34d399',
    gridLineTheme: 'light',
    badgeTheme: 'light',
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

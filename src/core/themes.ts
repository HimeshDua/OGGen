export interface Theme {
  gradient: [string, string, string];
  grid: boolean;
}

const themes: Record<string, Theme> = {
  'bright-green': {
    gradient: ['#48e08a', '#2dc97a', '#1aaf66'],
    grid: true,
  },
  'dark-grid': {
    gradient: ['#020617', '#0f172a', '#1e293b'],
    grid: true,
  },
  'green-gradient': {
    gradient: ['#051a0f', '#0d3d1a', '#166534'],
    grid: true,
  },
  'light-blue-gradient': {
    gradient: ['#0c2340', '#0ea5e9', '#e0f2fe'],
    grid: true,
  },
  'dark-blue-gradient': {
    gradient: ['#0c1b3d', '#1e3a8a', '#3b82f6'],
    grid: true,
  },
  'forest-dark': {
    gradient: ['#0f2818', '#1a3a2a', '#2d5a3d'],
    grid: true,
  },
  'ocean-dark': {
    gradient: ['#0a1929', '#132f4c', '#1a4d7a'],
    grid: true,
  },
  'slate-dark': {
    gradient: ['#1a202c', '#2d3748', '#4a5568'],
    grid: true,
  },
  'midnight-dark': {
    gradient: ['#0f0920', '#1a0933', '#2d0d4d'],
    grid: true,
  },
  'emerald-gradient': {
    gradient: ['#05260f', '#065f46', '#10b981'],
    grid: true,
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

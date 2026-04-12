export interface Theme {
  gradient: [string, string, string];
  grid: boolean;
}

const themes: Record<string, Theme> = {
  'dark-grid': {
    gradient: ['#020617', '#0f172a', '#1e293b'],
    grid: true,
  },
};

export function getTheme(name: string): Theme {
  const theme = themes[name];
  if (!theme) throw new Error(`Theme not found: ${name}`);
  return theme;
}

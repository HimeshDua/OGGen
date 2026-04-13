interface Theme {
  gradient: [string, string, string];
  textColor: 'auto' | 'light' | 'dark';
  highlightColor: string; // pure hex only
  gridLineTheme: 'light' | 'dark';
  badgeTheme: 'light' | 'dark';
}

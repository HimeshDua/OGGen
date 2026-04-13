interface Theme {
  gradient: [string, string, string];
  textColor: string;
  highlightColor: string; // pure hex only
  gridLineTheme: 'light' | 'dark';
  badgeTheme: 'light' | 'dark';
}

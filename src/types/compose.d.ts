interface ComposeOptions {
  screenshot: Buffer;
  output: {og: string; host: string};
  width: number;
  height: number;
  theme: Theme;
  title?: string;
  badge?: string;
  textColor: 'auto' | 'light' | 'dark';
  compactMode: boolean;
  showGrid: boolean;
}

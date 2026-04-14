interface GenerateOptions {
  url: string;
  theme: string;
  title?: string;
  badge?: string;
  width: number;
  height: number;
  browserTheme: 'light' | 'dark';
  textColor: 'auto' | 'light' | 'dark';
  compactMode: boolean;
  showGrid: boolean;
}

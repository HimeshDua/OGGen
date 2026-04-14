type BasicTheme = 'light' | 'dark';
type getGridPatternsType = {
  showGrid: boolean;
  gridLineTheme: BasicTheme;
};
export const getGridPatterns = ({showGrid, gridLineTheme}: getGridPatternsType) => {
  if (!showGrid) return '';

  const stroke = gridStroke(gridLineTheme);

  return `
  <defs>
    <!-- Grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40"
        fill="none"
        stroke="${stroke}"
        stroke-width="1"/>
    </pattern>

    <!-- Radial fade mask -->
    <radialGradient id="fade" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>

    <mask id="grid-mask">
      <rect width="100%" height="100%" fill="url(#fade)" />
    </mask>
  </defs>

  <!-- Apply mask -->
  <rect width="100%" height="100%" fill="url(#grid)" mask="url(#grid-mask)" />
  `;
};

const gridStroke = (gridLineTheme: BasicTheme) => {
  return gridLineTheme === 'light' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
};

type GradientSvgType = {
  height: number;
  width: number;
  gradient: string[];
  gridPattern: string;
};

export const getGradientSvg = ({height, width, gradient, gridPattern}: GradientSvgType) => {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="${gradient[0]}"/>
          <stop offset="50%"  stop-color="${gradient[1]}"/>
          <stop offset="100%" stop-color="${gradient[2]}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      ${gridPattern}
    </svg>`;
};

export const getBadgeStroke = (badgeTheme: BasicTheme, highlightColor: string) => {
  return badgeTheme === 'dark' ? highlightColor : `${highlightColor}20`;
};

export const getFillColor = (textColor: ComposeOptions['textColor'], themeHexColor: string) => {
  return textColor === 'auto' ? themeHexColor : textColor;
};

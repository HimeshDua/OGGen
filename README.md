<div align="center">

# oggen

**Open Graph image generation — private, local, and actually yours.**

[![Made with Bun](https://img.shields.io/badge/runtime-bun-black?style=flat-square&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/language-typescript-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

</div>

---

Most OG image tools fall into one of two traps: hosted services that ship your URLs to someone else's server, or browser-based workflows where you're manually screenshotting and cropping one page at a time. **oggen** is neither.

It's a local CLI that spins up a headless Chromium instance, navigates to your URLs, composites a polished gradient overlay with your title and badge on top of a live screenshot of your actual site, and writes production-ready 1200×630 PNGs directly to disk. Run it once for a single page or point it at a JSON file to process an entire site in parallel — either way, nothing leaves your machine.

---

## How it works

oggen launches a headless Playwright browser, navigates to each URL, captures a screenshot at 1200×630, and passes it to a Sharp compositing pipeline. That pipeline layers a gradient background, an optional grid overlay, your title text, and a badge label on top of the screenshot — then writes the result to the `OG/` directory, organized by hostname.

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/HimeshDua/oggen.git
cd oggen
```

**2. Install dependencies**

```bash
bun install
```

> On first install, Playwright will download a Chromium binary. This may take a minute or two — expected behaviour.

If the browser doesn't download automatically:

```bash
bunx playwright install chromium
```

**Requirements:** [Bun](https://bun.sh) v1.3.0+

---

## Usage

### Generate a single page

```bash
bun generate --url=yourwebsite.com
```

oggen will open an interactive prompt to walk you through all options before capturing the image.

---

### Generate multiple pages in batch

```bash
bun batch --input=og.json
```

The `--input` flag accepts a filename inside the `routes/` directory at the project root.

**`routes/og.json` — example:**

```json
[
  {
    "url": "https://yourwebsite.com",
    "title": "Home",
    "badge": "Portfolio"
  },
  {
    "url": "https://yourwebsite.com/about",
    "title": "About Me",
    "badge": "Info"
  },
  {
    "url": "https://yourwebsite.com/projects",
    "title": "Projects",
    "badge": "Work"
  },
  {
    "url": "https://your-second-website.com",
    "title": "Landing Page",
    "badge": "SaaS"
  }
]
```

Each object requires `url`. The `title` and `badge` fields are optional:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `url` | `string` | ✅ | Full URL of the page to capture |
| `title` | `string` | No | Main heading rendered on the OG image |
| `badge` | `string` | No | Small label shown on the image (category, site name, etc.) |

---

## Interactive prompts

Both `generate` and `batch` walk you through the same set of options before capturing:

| Prompt | Options | Description |
|--------|---------|-------------|
| Browser theme | Light / Dark | Sets the color scheme of the headless browser during screenshot |
| Theme | See [Themes](#themes) | Gradient background applied to the image |
| Title | Free text | Main heading rendered on the image (optional) |
| Badge | Free text | Small pill label overlaid on the design (optional) |
| Text color | Auto / Black / White | Overrides the theme's default text color |
| Grid overlay | Yes / No | Toggles a subtle grid pattern over the gradient background |
| Compact layout | Yes / No | Adjusts vertical spacing and title positioning |

---

## Output

Generated images are saved in the `OG/` directory at the project root, automatically grouped into folders by each website's **hostname**:

```
OG/
├── your-website.com/
│   ├── index.png
│   ├── about.png
│   └── projects.png
└── your-second-website.com/
    └── index.png
```

This keeps images from different sites cleanly separated and makes it easy to drop an entire folder into any project's `public/` directory.

---

## Themes

oggen ships with the following built-in gradient themes:

| Theme name | Style |
|------------|-------|
| `dark-grid` | Deep navy slate with sky blue highlight |
| `bright-green` | Vibrant green with dark text |
| `green-gradient` | Deep forest green |
| `light-blue-gradient` | Dark-to-light blue sweep |
| `dark-blue-gradient` | Dark navy to electric blue |
| `forest-dark` | Muted forest green |
| `ocean-dark` | Deep ocean tones |
| `slate-dark` | Cool grey slate |
| `midnight-dark` | Deep purple midnight |
| `emerald-gradient` | Rich emerald green |

### Adding a custom theme

Open `src/core/themes.ts`. Themes are defined as entries in a `Record<string, Theme>` object. Add your own key:

```ts
// src/core/themes.ts

const themes: Record<string, Theme> = {
  // ... existing themes

  'midnight': {
    gradient: ['#0f0c29', '#302b63', '#24243e'],
    textColor: '#ffffff',
    highlightColor: '#a78bfa',
    gridLineTheme: 'light',
    badgeTheme: 'light',
  },
};
```

| Property | Type | Description |
|----------|------|-------------|
| `gradient` | `string[]` | Array of 2–3 hex color stops for the background gradient |
| `textColor` | `string` | Default foreground color for title and badge text |
| `highlightColor` | `string` | Accent color used for badge border and glow tint |
| `gridLineTheme` | `'light' \| 'dark'` | Grid line opacity variant — use `'light'` on dark backgrounds |
| `badgeTheme` | `'light' \| 'dark'` | Badge border color variant |

Your custom theme will appear in the interactive prompt next time you run a generation command — no other changes needed.

---

## Commands

| Command | What it does |
|---------|-------------|
| `bun generate --url=<url>` | Interactively generate a single OG image |
| `bun generate --url=<url> --http` | Add http attribute at the end to generate OG Image from localhost |
| `bun batch --input=<file.json>` | Batch-generate from a JSON config in `routes/` |
| `bun run build` | Compile TypeScript → `dist/` |
| `bun run test` | Run the test suite |

---

## Project Structure

```
oggen/
├── OG/               # Output directory — generated images live here
├── routes/           # Place your batch JSON config files here
├── src/
│   ├── cli/
│   │   ├── index.ts  # Single-page interactive generator
│   │   └── batch.ts  # Batch generator with concurrency control
│   ├── core/
│   │   ├── capture.ts   # Playwright browser + screenshot logic
│   │   ├── compose.ts   # Sharp compositing pipeline
│   │   ├── generate.ts  # Orchestrates capture → compose → output
│   │   └── themes.ts    # Theme definitions — add custom gradients here
│   ├── types/           # Shared TypeScript type definitions
│   └── utils/           # Filename builder and compose helpers
├── package.json
└── tsconfig.json
```

---

## Stack

| Package | Role |
|---------|------|
| [Bun](https://bun.sh) | Runtime + package manager |
| [Playwright](https://playwright.dev) | Headless Chromium — navigates URLs and screenshots them |
| [Sharp](https://sharp.pixelplumbing.com) | SVG compositing, image masking, and PNG output |
| [Commander](https://github.com/tj/commander.js) | `--flag` argument parsing |
| [Prompts](https://github.com/terkelg/prompts) | Interactive theme and option selection |
| [p-limit](https://github.com/sindresorhus/p-limit) | Concurrency cap (3 at a time) for batch mode |
| [Chalk](https://github.com/chalk/chalk) | Coloured terminal output |
| [Vitest](https://vitest.dev) | Unit testing |

---

## Using generated images

Once your images are in `OG/`, copy them into your project's public directory and reference them in your `<head>`:

```html
<meta property="og:image" content="https://yourwebsite.com/og/about.png" />
```

For Next.js, drop the hostname folder into `public/og/` and use `generateMetadata`:

```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    openGraph: {
      images: ["/og/about.png"],
    },
  };
}
```

---

## Author

Built by [Himesh Dua](https://himeshdua.vercel.app) · [GitHub](https://github.com/HimeshDua)

---

## License

MIT

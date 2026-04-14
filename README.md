<div align="center">

# oggen

**Open Graph image generation — private, local, and actually yours.**

[![Made with Bun](https://img.shields.io/badge/runtime-bun-black?style=flat-square&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/language-typescript-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

</div>

---

Generating OG images used to mean opening your browser, navigating each URL one by one, taking a screenshot, cropping it to spec, and hoping the result looks decent. **oggen** replaces that entire workflow with a single CLI command.

Give it a URL — or a whole list of them — and it captures production-quality 1200×630 Open Graph images directly on your machine. No browser tabs. No hosted service. No data leaving your computer.

---

## How it works

oggen spins up a headless Playwright browser, navigates to each URL you provide, applies your chosen theme and customizations, screenshots the result, and saves the image to the `OG/` directory — organized neatly by hostname so nothing ever gets mixed up.

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

> On first install, Playwright will download a Chromium binary. This may take a minute or two - Expected Behaviour.

If the browser doesn't download automatically:

```bash
bunx playwright install chromium
```

**Requirements:** [Bun](https://bun.sh) v1.3.0+

---

## Usage

### Generate a single page

```bash
bun generate --output=yourwebsite.com
```

oggen will open an interactive prompt to walk you through theme, color, title, and badge options before capturing the image.

---

### Generate multiple pages in batch

```bash
bun batch --input=og.json
```

The `--input` flag accepts a file path to a JSON file containing an array of page objects. That file **must live inside the `routes/` directory** in the project root.

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

Each object requires three properties:

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Full URL of the page to capture |
| `title` | `string` | Main heading rendered on the OG image |
| `badge` | `string` | Small label/tag shown on the image (category, site name, etc.) |

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

oggen ships with multiple gradient themes. During generation (both single and batch), you'll be prompted to select from:

- **Layout** — choose how title, badge, and visual elements are arranged
- **Theme** — pick from the built-in gradient collection
- **Colors** — override foreground/background colors at any time
- **Title** — the main text rendered on the image
- **Badge** — the small label overlaid on the design

### Adding a custom theme

Open `src/themes.ts`. The themes are defined as objects inside a `collections` array. Add your own entry to the array:

```ts
// src/themes.ts

export const collections = [
  // ... existing themes

  {
    name: "midnight",
    gradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    foreground: "#ffffff",
    accent: "#a78bfa",
  },
];
```

Your custom theme will appear in the interactive prompt next time you run a generation command — no other changes needed.

---

## Commands

| Command | What it does |
|---------|-------------|
| `bun generate --output=<url>` | Interactively generate a single OG image |
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
│   └── themes.ts     # Theme definitions — add custom gradients here
├── package.json
└── tsconfig.json
```

---

## Stack

| Package | Role |
|---------|------|
| [Bun](https://bun.sh) | Runtime + package manager |
| [Playwright](https://playwright.dev) | Headless Chromium — navigates URLs and screenshots them |
| [Sharp](https://sharp.pixelplumbing.com) | Image compression and output formatting |
| [Commander](https://github.com/tj/commander.js) | `--flag` argument parsing |
| [Prompts](https://github.com/terkelg/prompts) | Interactive theme/layout selection |
| [Zod](https://zod.dev) | JSON input validation |
| [p-limit](https://github.com/sindresorhus/p-limit) | Concurrency cap for batch mode |
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

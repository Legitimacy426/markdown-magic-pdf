export type ThemeId = "modern" | "academic" | "minimal" | "terminal";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  css: string;
}

const baseCss = `
  *, *::before, *::after { box-sizing: border-box; }
  .md-doc { color: #1a1a1a; line-height: 1.65; word-wrap: break-word; }
  .md-doc h1, .md-doc h2, .md-doc h3, .md-doc h4 { line-height: 1.25; margin-top: 1.6em; margin-bottom: 0.6em; font-weight: 700; }
  .md-doc h1 { font-size: 2.1em; }
  .md-doc h2 { font-size: 1.55em; }
  .md-doc h3 { font-size: 1.25em; }
  .md-doc h4 { font-size: 1.05em; }
  .md-doc p { margin: 0.8em 0; }
  .md-doc a { color: #2563eb; text-decoration: underline; }
  .md-doc ul, .md-doc ol { padding-left: 1.6em; margin: 0.8em 0; }
  .md-doc li { margin: 0.25em 0; }
  .md-doc li > input[type="checkbox"] { margin-right: 0.5em; }
  .md-doc blockquote { border-left: 4px solid #d4d4d8; color: #525252; padding: 0.4em 1em; margin: 1em 0; font-style: italic; background: #fafafa; }
  .md-doc code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.92em; background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 4px; }
  .md-doc pre { background: #0f172a; color: #e2e8f0; padding: 1em 1.2em; border-radius: 8px; overflow-x: auto; font-size: 0.9em; line-height: 1.5; }
  .md-doc pre code { background: transparent; color: inherit; padding: 0; font-size: inherit; }
  .md-doc table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.95em; }
  .md-doc th, .md-doc td { border: 1px solid #e4e4e7; padding: 0.55em 0.8em; text-align: left; }
  .md-doc th { background: #f4f4f5; font-weight: 600; }
  .md-doc img { max-width: 100%; height: auto; border-radius: 6px; margin: 0.6em 0; }
  .md-doc hr { border: none; border-top: 1px solid #e4e4e7; margin: 2em 0; }
  .md-doc h1, .md-doc h2, .md-doc h3, .md-doc table, .md-doc pre, .md-doc blockquote, .md-doc img { page-break-inside: avoid; }
  .md-doc h1, .md-doc h2 { page-break-after: avoid; }
`;

export const THEMES: Record<ThemeId, Theme> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif, great for docs",
    css:
      baseCss +
      `
      .md-doc { font-family: -apple-system, "Inter", "Segoe UI", Roboto, sans-serif; color: #18181b; }
      .md-doc h1 { border-bottom: 2px solid #18181b; padding-bottom: 0.3em; }
      .md-doc h2 { color: #27272a; }
    `,
  },
  academic: {
    id: "academic",
    name: "Academic",
    description: "Serif, justified — papers & essays",
    css:
      baseCss +
      `
      .md-doc { font-family: "Georgia", "Cambria", "Times New Roman", serif; text-align: justify; color: #1c1917; line-height: 1.75; }
      .md-doc h1 { text-align: center; font-weight: 700; }
      .md-doc h2 { font-style: italic; font-weight: 600; }
      .md-doc p { text-indent: 1.4em; margin: 0.4em 0; }
      .md-doc blockquote { font-style: italic; border-left-color: #78716c; }
    `,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Spare and elegant",
    css:
      baseCss +
      `
      .md-doc { font-family: "Helvetica Neue", Arial, sans-serif; color: #111; line-height: 1.7; }
      .md-doc h1 { font-weight: 300; font-size: 2.4em; letter-spacing: -0.02em; }
      .md-doc h2 { font-weight: 400; color: #333; }
      .md-doc h3 { font-weight: 500; color: #555; }
      .md-doc a { color: #111; }
    `,
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    description: "Mono everything — for engineers",
    css:
      baseCss +
      `
      .md-doc { font-family: ui-monospace, "JetBrains Mono", "Fira Code", Menlo, monospace; color: #0a0a0a; font-size: 0.95em; }
      .md-doc h1::before { content: "# "; color: #16a34a; }
      .md-doc h2::before { content: "## "; color: #16a34a; }
      .md-doc h3::before { content: "### "; color: #16a34a; }
      .md-doc a { color: #2563eb; }
    `,
  },
};

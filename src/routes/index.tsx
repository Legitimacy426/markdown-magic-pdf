import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { THEMES, type ThemeId } from "@/lib/pdf-themes";
import { SAMPLE_MARKDOWN } from "@/lib/sample-markdown";
import { FileDown, FileUp, FileText, Loader2, Trash2, Eye, Code2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Markdown to PDF — Fast, beautiful conversions" },
      { name: "description", content: "Paste or upload Markdown and export a polished, print-ready PDF in seconds. Live preview, multiple themes, page-size controls." },
      { property: "og:title", content: "Markdown to PDF" },
      { property: "og:description", content: "Convert Markdown into clean, professional PDFs with a live preview and beautiful themes." },
    ],
  }),
  component: Index,
});

type PageSize = "a4" | "letter" | "legal";
type Orientation = "portrait" | "landscape";

function Index() {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [theme, setTheme] = useState<ThemeId>("modern");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<number>(15);
  const [filename, setFilename] = useState<string>("document");
  const [exporting, setExporting] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const html = useMemo(() => renderMarkdown(markdown), [markdown]);
  const currentTheme = THEMES[theme];

  const stats = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    return { words, chars: markdown.length };
  }, [markdown]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleExport();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, theme, pageSize, orientation, margin, filename]);

  async function handleFile(file: File) {
    const text = await file.text();
    setMarkdown(text);
    const base = file.name.replace(/\.(md|markdown|txt)$/i, "");
    if (base) setFilename(base);
  }

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const container = document.createElement("div");
      container.innerHTML = `<style>${currentTheme.css}</style><div class="md-doc">${html}</div>`;
      const safeName = (filename.trim() || "document").replace(/\.pdf$/i, "");
      await html2pdf()
        .set({
          margin,
          filename: `${safeName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "mm", format: pageSize, orientation },
          pagebreak: { mode: ["css", "legacy"] },
        } as Parameters<ReturnType<typeof html2pdf>["set"]>[0])
        })
        .from(container)
        .save();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <style>{currentTheme.css}</style>

      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">Markdown to PDF</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Write, preview, export.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt,text/markdown"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:bg-accent"
            >
              <FileUp className="h-4 w-4" />
              <span className="hidden sm:inline">Upload .md</span>
            </button>
            <button
              onClick={() => void handleExport()}
              disabled={exporting || !markdown.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-surface-muted">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 sm:px-6">
          <Field label="Theme">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeId)}
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
            >
              {Object.values(THEMES).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Page">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </Field>
          <Field label="Layout">
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as Orientation)}
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </Field>
          <Field label="Margin">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={30}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-24 accent-[color:var(--brand)]"
              />
              <span className="w-10 text-sm tabular-nums text-muted-foreground">{margin}mm</span>
            </div>
          </Field>
          <Field label="Filename">
            <div className="flex items-center rounded-md border border-border bg-surface">
              <input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="document"
                className="w-36 bg-transparent px-2 py-1 text-sm outline-none"
              />
              <span className="pr-2 text-xs text-muted-foreground">.pdf</span>
            </div>
          </Field>
          <div className="ml-auto text-xs text-muted-foreground tabular-nums">
            {stats.words.toLocaleString()} words · {stats.chars.toLocaleString()} chars
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="flex border-b border-border bg-surface md:hidden">
        <TabBtn active={mobileView === "edit"} onClick={() => setMobileView("edit")} icon={<Code2 className="h-4 w-4" />}>
          Editor
        </TabBtn>
        <TabBtn active={mobileView === "preview"} onClick={() => setMobileView("preview")} icon={<Eye className="h-4 w-4" />}>
          Preview
        </TabBtn>
      </div>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-0 px-0 md:flex-row">
        <section
          className={`flex flex-1 flex-col border-border md:border-r ${mobileView === "edit" ? "flex" : "hidden md:flex"}`}
        >
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Markdown</span>
            <button
              onClick={() => setMarkdown("")}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
              title="Clear editor"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            placeholder="# Start writing Markdown…"
            className="min-h-[60vh] flex-1 resize-none bg-surface p-5 font-mono text-sm leading-relaxed text-foreground outline-none md:min-h-0"
          />
        </section>

        <section
          className={`flex flex-1 flex-col bg-surface-muted ${mobileView === "preview" ? "flex" : "hidden md:flex"}`}
        >
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
            <span className="text-xs text-muted-foreground">{currentTheme.name} · {pageSize.toUpperCase()}</span>
          </div>
          <div className="flex-1 overflow-auto p-4 sm:p-8">
            <div
              className="mx-auto max-w-[820px] rounded-md bg-white p-10 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_10px_40px_-20px_rgba(0,0,0,0.25)] sm:p-14"
              style={{ minHeight: "60vh" }}
            >
              <div className="md-doc" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <p className="mx-auto mt-4 max-w-[820px] text-center text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">⌘/Ctrl + S</kbd> to export
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2.5 text-sm font-medium transition ${
        active ? "border-brand text-foreground" : "border-transparent text-muted-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

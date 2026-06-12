import { marked } from "marked";
import hljs from "highlight.js";

let configured = false;

function configure() {
  if (configured) return;
  configured = true;
  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      code(this: unknown, { text, lang }: { text: string; lang?: string }) {
        const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
        const highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
      },
    },
  });
}

export function renderMarkdown(md: string): string {
  configure();
  return marked.parse(md, { async: false }) as string;
}

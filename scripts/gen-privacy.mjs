// Generates public/privacy.html (the hosted policy linked from Google Play) from src/screens/Privacy.tsx.
import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("src/screens/Privacy.tsx", "utf8");
const block = (lang) => {
  const m = src.match(new RegExp(lang + ': \\{\\s*title: "([^"]+)",\\s*updated: "([^"]+)",\\s*body: \\[([\\s\\S]*?)\\],\\s*\\}'));
  if (!m) throw new Error(`Could not find the ${lang} policy in Privacy.tsx`);
  const body = [...m[3].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1].replace(/\\"/g, '"'));
  return { title: m[1], updated: m[2], body };
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const sec = (l, b) =>
  `<section lang="${l}" id="${l}"><h1>${esc(b.title)}</h1><p class="u">${esc(b.updated)}</p>${b.body.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sakhi Privacy Policy</title>
<!-- Generated from src/screens/Privacy.tsx by "npm run privacy". Edit that file, not this one. -->
<style>:root{--bg:#fbf7f8;--ink:#2a1d22;--muted:#7a6870;--accent:#c2416b}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#161114;--ink:#f5ecef;--muted:#b7a5ad;--accent:#f0789c}}
:root[data-theme="dark"]{--bg:#161114;--ink:#f5ecef;--muted:#b7a5ad;--accent:#f0789c}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,"Noto Sans","Noto Sans Devanagari",sans-serif}
main{max-width:720px;margin:0 auto;padding:32px 16px 64px}nav a{color:var(--accent);margin-right:16px}
h1{font-size:26px;margin:32px 0 4px}.u{color:var(--muted);font-size:14px;margin-top:0}</style></head>
<body><main><nav><a href="#en">English</a><a href="#hi">हिन्दी</a></nav>${sec("en", block("en"))}${sec("hi", block("hi"))}</main></body></html>
`;
writeFileSync("public/privacy.html", html);
console.log("wrote public/privacy.html");

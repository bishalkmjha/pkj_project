// Assembles the full website in site-dist/:
//   /               landing page (website/)
//   /app/           the Sakhi web app (the Vite build in dist/)
//   /privacy.html   privacy policy (the URL to give Google Play)
// Run `npm run build:site`, then upload site-dist/ to any static host.
import { cpSync, existsSync, rmSync } from "fs";

if (!existsSync("dist/index.html")) throw new Error("Run `npm run build` first (dist/ is missing).");
rmSync("site-dist", { recursive: true, force: true });
cpSync("website", "site-dist", { recursive: true });
cpSync("dist", "site-dist/app", { recursive: true });
cpSync("dist/privacy.html", "site-dist/privacy.html");
cpSync("public/icon.svg", "site-dist/icon.svg");
console.log("site-dist/ ready: landing page, /app/ and /privacy.html");

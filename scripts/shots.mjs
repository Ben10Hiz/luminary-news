import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = process.argv[3] || "/home/claude/shots2";
const BASE = process.argv[2] || "http://localhost:3000";
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(`${p.url()}: ${e.message}`));
p.on("console", (m) => {
  if (m.type() === "error") errs.push(`console ${p.url()}: ${m.text()}`);
});

for (const [name, url] of [
  ["home", "/"],
  ["story", "/story/sample-newsroom-opens"],
  ["story2", "/story/sample-latency-report"],
  ["section", "/section/research"],
  ["about", "/about"],
]) {
  await p.goto(BASE + url, { waitUntil: "load" });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("shot", name);
}

const m = await b.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  deviceScaleFactor: 2,
});
const mp = await m.newPage();
await mp.goto(BASE + "/", { waitUntil: "load" });
await mp.waitForTimeout(1000);
await mp.screenshot({ path: `${OUT}/mobile-home.png`, fullPage: true });
console.log("shot mobile-home");

console.log(errs.length ? "PAGE ERRORS:\n" + errs.join("\n") : "no page errors");
await b.close();

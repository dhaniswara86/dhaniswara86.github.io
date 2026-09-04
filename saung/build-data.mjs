import fs from "node:fs";

const source = fs.readFileSync("layanan-administrasi-ctas.md", "utf8");

const decode = (value) => value
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ");

const clean = (value) => decode(value)
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const rows = [...source.matchAll(/<tr\s+data-prefix="([^"]+)"[^>]*data-timeline="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/gi)];

const services = rows.map((match, index) => {
  const cells = [...match[3].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cell[1]);
  const laws = [...(cells[3] || "").matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((law) => clean(law[1]));
  return {
    id: index + 1,
    prefix: match[1],
    code: clean(cells[0] || ""),
    name: clean(cells[1] || ""),
    timeline: clean(cells[2] || "-") || "-",
    timelineDefined: match[2] === "defined",
    laws
  };
});

const output = `window.SAUNG_SERVICES = ${JSON.stringify(services, null, 2)};\n`;
fs.writeFileSync("assets/js/saung-data.js", output);
console.log(`Generated ${services.length} services.`);

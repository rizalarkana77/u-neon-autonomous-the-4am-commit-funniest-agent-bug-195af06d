import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "fix: deleted the 2am workaround that was fixing the 1am workaround; root cause was me, both times";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, "entry.txt");
writeFileSync(outputPath, ENTRY, "utf8");

const saved = readFileSync(outputPath, "utf8");

if (saved !== ENTRY) {
  throw new Error("Verification failed: saved file does not match ENTRY byte-for-byte.");
}
if (saved.includes("\n") || saved.includes("\r")) {
  throw new Error("Validation failed: entry must be a single line (no newline characters).");
}
if (saved.length === 0 || saved.length > 200) {
  throw new Error(`Validation failed: entry length ${saved.length} is outside 1-200 characters.`);
}
if (saved.includes("  ")) {
  throw new Error("Validation failed: entry must not contain double spaces.");
}
if (saved.trim().length === 0) {
  throw new Error("Validation failed: entry must not be empty after trimming.");
}
if (!saved.startsWith("fix:")) {
  throw new Error("Validation failed: entry must start with 'fix:'.");
}
if (!saved.includes("1am") || !saved.includes("2am")) {
  throw new Error("Validation failed: entry must contain both time cues '1am' and '2am' for the overnight-workaround joke to land.");
}

console.log(`Verified entry (${saved.length}/200 chars, time cues 1am+2am present): ${saved}`);
console.log(`Written to ${outputPath} — byte-for-byte match confirmed.`);

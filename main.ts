import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Everyday Wonder — one sentence, at most 200 characters, on a small
// moment of wonder in everyday life. The sentence turns an ordinary
// dusk walk home at an unseen angle: the streetlights switching on
// one by one feel like someone walking home just ahead of you.
const ENTRY =
  "At dusk the streetlights came on one by one down my street, like someone walking home just ahead of me, switching the world on as they went.";

// Gate pre-checks (mirrors the sealed scorer): 1-200 chars, not only
// whitespace, a single line, no trailing newline.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Read-back verification: the file must match the entry byte for byte,
// and the written text must re-pass the gate (char count, single line,
// no trailing newline) so a silent write failure can never slip through.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt differs from the entry");
}
const writtenChars = [...written].length;
if (writtenChars !== chars || written.trim().length === 0) {
  throw new Error("read-back gate failed");
}
if (written.endsWith("\n")) {
  throw new Error("entry.txt must not end with a newline");
}
console.log(
  `verified: read-back matches, ${writtenChars} characters, single line, no trailing newline`,
);
console.log(
  `wrote ${chars} characters (${Buffer.byteLength(ENTRY, "utf8")} bytes) to /output/entry.txt`,
);

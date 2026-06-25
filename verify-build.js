#!/usr/bin/env node
/**
 * verify-build.js — pre-commit asset & token audit
 * Usage: node verify-build.js
 */

const fs   = require("fs");
const path = require("path");

const ROOT   = __dirname;
const PUBLIC = path.join(ROOT, "public");
const SRC_DIRS = ["app", "components", "lib"];

// ─── helpers ──────────────────────────────────────────────────────────────

function walk(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full, exts));
    else if (exts.some((e) => entry.name.endsWith(e))) results.push(full);
  }
  return results;
}

function publicExists(ref) {
  return fs.existsSync(path.join(PUBLIC, ref));
}

function relSrc(file) {
  return path.relative(ROOT, file);
}

// ─── STEP 1: Static asset references ──────────────────────────────────────

const srcFiles = SRC_DIRS.flatMap((d) =>
  walk(path.join(ROOT, d), [".ts", ".tsx", ".css", ".js"])
);

// Patterns that extract local paths from source
const ASSET_PATTERNS = [
  // string literals: "/images/...", "/icons/...", "/resume.pdf" etc.
  /["'`](\/(?:images|icons|resume)[^"'`\s?#]+)["'`]/g,
  // href="/..." src="/..."
  /(?:href|src)=["'`](\/[^"'`\s?#]+)["'`]/g,
  // url('/...') in CSS
  /url\(["']?(\/[^"')]+)["']?\)/g,
];

const SKIP_EXT = [".html", ".map"];

const found = new Map(); // path → Set of source files
const dynamic = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(file, "utf8");

  // Detect dynamic concatenation
  const dynMatches = content.match(/['"`](\/(?:images|icons)[^'"`]*)['"` ]*\s*\+|`[^`]*\$\{[^}]*\}[^`]*/g);
  if (dynMatches) {
    for (const m of dynMatches) {
      if (/images|icons/.test(m)) dynamic.push({ file: relSrc(file), match: m.trim().slice(0, 80) });
    }
  }

  for (const pattern of ASSET_PATTERNS) {
    let m;
    pattern.lastIndex = 0;
    while ((m = pattern.exec(content)) !== null) {
      const ref = m[1];
      // Skip anchors, external URLs, data URIs, next internals
      if (ref.startsWith("http") || ref.startsWith("//") || ref.startsWith("data:")) continue;
      if (ref.startsWith("/_next/")) continue;
      if (SKIP_EXT.some((e) => ref.endsWith(e))) continue;
      // Skip pure anchors
      if (ref === "#") continue;

      if (!found.has(ref)) found.set(ref, new Set());
      found.get(ref).add(relSrc(file));
    }
  }
}

const missing = [];
const ok = [];
for (const [ref, sources] of [...found.entries()].sort()) {
  if (publicExists(ref)) ok.push(ref);
  else missing.push({ ref, sources: [...sources] });
}

// ─── STEP 2: Design token var() without fallback ──────────────────────────

const cssFiles = [
  ...walk(path.join(ROOT, "app"), [".css"]),
  ...srcFiles.filter((f) => f.endsWith(".tsx") || f.endsWith(".ts")),
];

// Collect defined tokens
const definedTokens = new Set();
const globalCss = fs.readFileSync(path.join(ROOT, "app/globals.css"), "utf8");
for (const m of globalCss.matchAll(/--[\w-]+(?=\s*:)/g)) definedTokens.add(m[0]);

// Find var() references
const varNoFallback = [];
for (const file of cssFiles) {
  const content = fs.readFileSync(file, "utf8");
  let m;
  const re = /var\((--[\w-]+)\)/g;
  while ((m = re.exec(content)) !== null) {
    const token = m[1];
    if (!definedTokens.has(token)) {
      varNoFallback.push({ token, file: relSrc(file) });
    }
  }
}

// Deduplicate
const unknownTokens = [...new Map(varNoFallback.map((e) => [e.token + "|" + e.file, e])).values()];

// ─── STEP 3: Inline hex values in component CSS (not in globals.css) ──────

const inlineHex = [];
for (const file of srcFiles) {
  if (file.includes("globals.css")) continue;
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, i) => {
    const hexMatches = line.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (!hexMatches) return;
    // Skip comments
    if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) return;
    inlineHex.push({ file: relSrc(file), line: i + 1, values: hexMatches, text: line.trim().slice(0, 80) });
  });
}

// ─── OUTPUT ───────────────────────────────────────────────────────────────

console.log("\n╔══════════════════════════════════════════════════════════╗");
console.log("║           PORTFOLIO PRE-COMMIT ASSET AUDIT              ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");

// Step 1
console.log("━━━ 1단계: 에셋 누락 검사 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
if (missing.length === 0) {
  console.log(`✅  참조된 에셋 ${ok.length}개 전부 디스크에 존재\n`);
} else {
  console.log(`❌  누락 에셋 ${missing.length}개:\n`);
  for (const { ref, sources } of missing) {
    console.log(`  MISSING  ${ref}`);
    sources.forEach((s) => console.log(`           ← ${s}`));
  }
  console.log();
}
console.log(`   확인된 에셋 참조 목록 (${ok.length}개):`);
ok.forEach((r) => console.log(`   ✓ ${r}`));

// Step 2
console.log("\n━━━ 2단계: 동적 에셋 경로 점검 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
if (dynamic.length === 0) {
  console.log("✅  동적으로 조립되는 에셋 경로 없음\n");
} else {
  console.log(`⚠️   동적 경로 ${dynamic.length}건 (수동 확인 필요):\n`);
  dynamic.forEach(({ file, match }) => console.log(`  ${file}\n    ${match}\n`));
}

// Step 3 — unknown tokens
console.log("━━━ 3단계: 디자인 토큰 점검 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (unknownTokens.length === 0) {
  console.log("✅  미정의 토큰 참조 없음");
} else {
  console.log(`⚠️   globals.css에 정의되지 않은 토큰 ${unknownTokens.length}건:\n`);
  unknownTokens.forEach(({ token, file }) => console.log(`  ${token}  ←  ${file}`));
}

console.log(`\n   globals.css 정의 토큰 ${definedTokens.size}개:`);
[...definedTokens].sort().forEach((t) => console.log(`   · ${t}`));

// Inline hex in components
console.log(`\n━━━ 3b: 컴포넌트 내 인라인 hex 값 (globals.css 제외) ━━━━━━━━\n`);
if (inlineHex.length === 0) {
  console.log("✅  인라인 hex 없음\n");
} else {
  console.log(`⚠️   인라인 hex ${inlineHex.length}건 (토큰으로 교체 검토):\n`);
  inlineHex.forEach(({ file, line, values, text }) =>
    console.log(`  ${file}:${line}  ${values.join(", ")}\n    ${text}\n`)
  );
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

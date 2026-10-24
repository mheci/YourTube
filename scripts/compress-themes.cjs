#!/usr/bin/env node
// Theme table normalization pass: rewrites the 200-row Nr literal from fully
// quoted object-per-var blocks into positional arrays keyed by a single
// _THEME_VARS header. Zero behavioural change: the mapped result is frozen
// deep-equality-verified against the old table before writing.
"use strict";
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const file = path.resolve(__dirname, "../src/60-cards-feed.js");
let s = fs.readFileSync(file, "utf8");

const VARS = [
  "base-background", "raised-background", "menu-background",
  "general-background-a", "general-background-b", "general-background-c",
  "text-primary", "text-secondary", "text-disabled",
  "badge-chip-background", "outline", "call-to-action",
  "call-to-action-inverse", "icon-active-other", "icon-inactive",
  "10-percent-layer", "shadow",
];

const start = s.indexOf("const Nr = [");
const end = s.indexOf("\n  ];", start);
assert(start > 40 && end > start, "Nr table anchors");
const literal = s.slice(start + "const Nr =".length, end + "\n  ]".length)
  .replace(/\r?\n/g, "");
const oldTable = new Function("return (" + literal + ")")();
assert.strictEqual(oldTable.length, 201, "201 themes read");

// verify every row maps losslessly to the 17-declared-order vars
for (const t of oldTable) {
  if (t.id === "none") continue;
  assert(t.vars, `${t.id} has vars`);
  const keys = Object.keys(t.vars);
  assert.deepStrictEqual(
    new Set(keys), new Set(VARS),
    `${t.id} var key set matches VARS exactly (got: ${keys.join(",")})`,
  );
}

// emit the compressed region
const rows = oldTable.map((t) => {
  if (t.id === "none") return `    [${JSON.stringify(t.id)}, ${JSON.stringify(t.name)}, ${JSON.stringify(t.mode)}, null],`;
  return `    [${JSON.stringify(t.id)}, ${JSON.stringify(t.name)}, ${JSON.stringify(t.mode)}, ${JSON.stringify(VARS.map((k) => t.vars[k]))}],`;
}).join("\n");

const NEW_BLOCK = `const _THEME_VARS = ${JSON.stringify(VARS)};
  const Nr = (${"["}
${rows}
  ]).map((r) =>
    r[3]
      ? {
          id: r[0],
          name: r[1],
          mode: r[2],
          vars: Object.fromEntries(r[3].map((v, i) => [_THEME_VARS[i], v])),
        }
      : { id: r[0], name: r[1], mode: r[2], vars: null },
  );`;

const before = s.slice(0, start);
const after = s.slice(end + "\n  ];".length);
s = before + NEW_BLOCK + after;

// re-read to deep-equality verify against oldTable
{
  const m = /const _THEME_VARS = (\[[^\]]+\]);/.exec(s);
  const m2 = /const Nr = \(\[([\s\S]*?)\n  \]\)\.map/.exec(s);
  assert(m && m2, "rescan anchors");
  const vars = JSON.parse(m[1]);
  const rowsNew = JSON.parse("[" + m2[1].replace(/,\s*$/, "").replace(/\n\s*/g, " ") + "]");
  const rebuilt = rowsNew.map((r) =>
    r[3]
      ? { id: r[0], name: r[1], mode: r[2], vars: Object.fromEntries(r[3].map((v, i) => [vars[i], v])) }
      : { id: r[0], name: r[1], mode: r[2], vars: null },
  );
  assert.deepStrictEqual(rebuilt, oldTable, "round-trip: compressed table decodes to the exact old table");
}

fs.writeFileSync(file, s);
console.log(`compress-themes: 60-cards-feed.js ${(literal.length) } -> ${NEW_BLOCK.length} chars in table region (-${literal.length - NEW_BLOCK.length})`);

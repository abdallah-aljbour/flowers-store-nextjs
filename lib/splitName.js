// Display-only: split a bilingual product name into its Arabic and Latin parts.
// "سحر البلور Crystal Elegance" → { ar: "سحر البلور", en: "Crystal Elegance" }
// Never use the result for alt text, SEO strings or stored data.
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const LATIN = /[A-Za-zÀ-ɏ]/;

export function splitName(name = "") {
  const ar = [];
  const en = [];

  // Words without letters (numbers, punctuation) follow the previous word's script
  let last = ar;
  for (const word of String(name).trim().split(/\s+/)) {
    if (ARABIC.test(word)) last = ar;
    else if (LATIN.test(word)) last = en;
    last.push(word);
  }

  return { ar: ar.join(" ").trim(), en: en.join(" ").trim() };
}

export default splitName;

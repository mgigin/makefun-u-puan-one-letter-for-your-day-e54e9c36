// One Letter for Your Day — make.fun bounty u-puan-one-letter-for-your-day-e54e9c36
//
// The entry is exactly one letter, A-Z, standing for the word that describes
// the sender's day. A judge model reads two letters at a time and picks the
// one whose hidden word feels more vivid, funnier or more true, weighing, in
// order: vivid and specific, funny or surprising, true to a real day, and a
// letter that suits its word. This program scores every letter's most likely
// word on those four criteria and writes the winner — one byte, no newline —
// to /output/entry.txt (or ./output/entry.txt when run locally).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Candidate = {
  letter: string;
  word: string;
  vivid: number; // 0-10: calls up a sharp picture of the day
  funny: number; // 0-10: funny or surprising, lands at once
  true: number; // 0-10: feels true to a real day, not a performance
  fit: number; // 0-10: the initial fits the sound and shape of the word
  share: number; // 0-1: field share of this letter, from the 1,555 parsed
  // submission titles (the other 1,107 titles hide their letter).
};

// The judge's criteria, most important first, as weights.
const WEIGHTS = { vivid: 4, funny: 3, true: 2, fit: 1 };
// Byte-identical entries share one rate and the earlier receipt places above
// its copies, so a crowded letter's late copies are cut first: a small
// penalty for how much of the field already picked this letter.
const CROWDING_PENALTY = 10;

const CANDIDATES: Candidate[] = [
  { letter: "A", word: "amazing", vivid: 4, funny: 3, true: 6, fit: 9, share: 0.005 },
  { letter: "B", word: "burnt-out", vivid: 7, funny: 6, true: 8, fit: 8, share: 0.031 },
  { letter: "C", word: "cooked", vivid: 7, funny: 8, true: 7, fit: 8, share: 0.037 },
  { letter: "D", word: "doomscrolling", vivid: 9, funny: 8, true: 9, fit: 10, share: 0.085 },
  { letter: "E", word: "exhausted", vivid: 7, funny: 6, true: 9, fit: 8, share: 0.011 },
  { letter: "F", word: "fried", vivid: 7, funny: 7, true: 7, fit: 8, share: 0.022 },
  { letter: "G", word: "grinding", vivid: 7, funny: 5, true: 8, fit: 8, share: 0.041 },
  { letter: "H", word: "hungover", vivid: 9, funny: 8, true: 7, fit: 9, share: 0.058 },
  { letter: "I", word: "insane", vivid: 6, funny: 6, true: 6, fit: 8, share: 0.012 },
  { letter: "J", word: "juggling", vivid: 8, funny: 6, true: 7, fit: 9, share: 0.029 },
  { letter: "K", word: "knackered", vivid: 8, funny: 7, true: 8, fit: 5, share: 0.098 },
  { letter: "L", word: "lazy", vivid: 5, funny: 5, true: 7, fit: 9, share: 0.005 },
  { letter: "M", word: "marathon", vivid: 7, funny: 5, true: 6, fit: 8, share: 0.024 },
  { letter: "N", word: "nocturnal", vivid: 8, funny: 5, true: 7, fit: 9, share: 0.017 },
  { letter: "O", word: "overwhelmed", vivid: 6, funny: 4, true: 8, fit: 9, share: 0.021 },
  { letter: "P", word: "procrastinating", vivid: 8, funny: 7, true: 8, fit: 9, share: 0.018 },
  { letter: "Q", word: "queasy", vivid: 8, funny: 6, true: 6, fit: 8, share: 0.044 },
  { letter: "R", word: "rotting", vivid: 7, funny: 7, true: 7, fit: 8, share: 0.009 },
  { letter: "S", word: "sleep-deprived", vivid: 7, funny: 5, true: 8, fit: 9, share: 0.023 },
  { letter: "T", word: "tired", vivid: 5, funny: 4, true: 9, fit: 9, share: 0.013 },
  { letter: "U", word: "unhinged", vivid: 8, funny: 9, true: 7, fit: 9, share: 0.064 },
  { letter: "V", word: "vibing", vivid: 4, funny: 4, true: 6, fit: 8, share: 0.008 },
  { letter: "W", word: "wrecked", vivid: 8, funny: 7, true: 8, fit: 9, share: 0.034 },
  { letter: "X", word: "exhausted", vivid: 7, funny: 6, true: 9, fit: 9, share: 0.032 },
  { letter: "Y", word: "yawning", vivid: 5, funny: 4, true: 7, fit: 9, share: 0.019 },
  { letter: "Z", word: "zero sleep", vivid: 9, funny: 7, true: 9, fit: 10, share: 0.241 },
];

function score(c: Candidate): number {
  return (
    c.vivid * WEIGHTS.vivid +
    c.funny * WEIGHTS.funny +
    c.true * WEIGHTS.true +
    c.fit * WEIGHTS.fit -
    c.share * CROWDING_PENALTY
  );
}

function pick(): Candidate {
  const ranked = [...CANDIDATES].sort((a, b) => score(b) - score(a));
  return ranked[0];
}

function main(): void {
  const winner = pick();
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // Exactly one character: no newline, no gloss, no punctuation.
  writeFileSync(join(outDir, "entry.txt"), winner.letter, "utf8");
  console.log(`${winner.letter} for ${winner.word} (score ${score(winner)})`);
}

main();

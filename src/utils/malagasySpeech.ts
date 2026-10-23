/**
 * Malagasy speech helper for authentic phonetic pronunciation in Web Speech API
 */

export function getMalagasyOrdinal(n: number): string {
  const ordinals: Record<number, string> = {
    1: 'voalohany',
    2: 'faharoa',
    3: 'fahatelo',
    4: 'fahefatra',
    5: 'fahadimy',
    6: 'fahenina',
    7: 'fahafito',
    8: 'fahavalo',
    9: 'fahasivy',
    10: 'fahafolo',
    11: 'faha iraika ambin’ny folo',
    12: 'faha roa ambin’ny folo',
    13: 'faha telo ambin’ny folo',
    14: 'faha efatra ambin’ny folo',
    15: 'faha dimy ambin’ny folo',
    16: 'faha enina ambin’ny folo',
    17: 'faha fito ambin’ny folo',
    18: 'faha valo ambin’ny folo',
    19: 'faha sivy ambin’ny folo',
    20: 'faha roapolo',
  };

  return ordinals[n] || `faha ${n}`;
}

/**
 * Prepares raw 1865 Malagasy biblical text for natural, smooth text-to-speech pronunciation:
 * - Smooths elision apostrophes (amin' ny -> amin ny) so TTS doesn't say "apostrophe" or pause awkwardly.
 * - Formats verse numbering in natural spoken Malagasy ("Andininy voalohany...", "Andininy faharoa...").
 */
export function formatMalagasyForSpeech(rawText: string, verseNumber: number): string {
  const ordinal = getMalagasyOrdinal(verseNumber);

  let cleaned = rawText
    // Replace typographic apostrophes with simple apostrophes
    .replace(/[’‘`´]/g, "'")
    // Fix common Malagasy contracted prepositions and elisions so speech engines pronounce them smoothly
    .replace(/amin'\s*ny/gi, 'amin ny')
    .replace(/tamin'\s*ny/gi, 'tamin ny')
    .replace(/tambonin'\s*ny/gi, 'tambonin ny')
    .replace(/ambonin'\s*ny/gi, 'ambonin ny')
    .replace(/ambanin'\s*ny/gi, 'ambanin ny')
    .replace(/an'\s*i\s+/gi, 'ani ')
    .replace(/zanani-lahy/gi, 'zananilahy')
    .replace(/zanani-vavy/gi, 'zananivavy')
    // Remove odd hyphens in compound words for smoother flow
    .replace(/boki-taranaka/gi, 'bokitaranaka')
    // Remove isolated single quotes
    .replace(/'\s+/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();

  return `Andininy ${ordinal}. ${cleaned}`;
}

import { DailyVerse, ReadingPlanDay } from '../types/bible';
import { BOOKS_META } from './booksMeta';

export const DAILY_VERSES: DailyVerse[] = [
  {
    bookNumber: 43,
    bookName: 'Jaona',
    chapterNumber: 3,
    verseNumber: 16,
    text: 'Fa toy izany no nitiavan’ Andriamanitra izao tontolo izao: nomeny ny Zanani-lahy Tokana, mba tsy ho very izay rehetra mino Azy, fa hanana fiainana mandrakizay.',
    theme: 'Fitiavan’Andriamanitra',
  },
  {
    bookNumber: 19,
    bookName: 'Salamo',
    chapterNumber: 23,
    verseNumber: 1,
    text: 'Jehovah no Mpiandry ahy, tsy hanan-java-mahory aho.',
    theme: 'Fiadanana sy Fiahiana',
  },
  {
    bookNumber: 45,
    bookName: 'Romana',
    chapterNumber: 8,
    verseNumber: 28,
    text: 'Ary fantatsika fa ny zavatra rehetra dia miara-miasa hahasoa izay tia an’ Andriamanitra, dia izay voantso araka ny fikasany.',
    theme: 'Finoana sy Fitokisana',
  },
  {
    bookNumber: 50,
    bookName: 'Filipiana',
    chapterNumber: 4,
    verseNumber: 13,
    text: 'Mahay ny zavatra rehetra aho ao amin’ Ilay mampahatanjaka ahy.',
    theme: 'Herim-po',
  },
  {
    bookNumber: 20,
    bookName: 'Ohabolana',
    chapterNumber: 3,
    verseNumber: 5,
    text: 'Matokia an’ i Jehovah amin’ ny fonao rehetra, ary aza miankina amin’ ny fahalalanao manokana.',
    theme: 'Fahendrena',
  },
  {
    bookNumber: 23,
    bookName: 'Isaia',
    chapterNumber: 41,
    verseNumber: 10,
    text: 'Aza matahotra ianao, fa momba anao Aho; ary aza miherikerika foana, fa Izaho no Andriamanitrao; Mampahery anao Aho sady mamonjy anao; Eny, mitana anao amin’ ny tanana ankavanan’ ny fahamarinako Aho.',
    theme: 'Fampiononana',
  },
  {
    bookNumber: 24,
    bookName: 'Jeremia',
    chapterNumber: 29,
    verseNumber: 11,
    text: 'Fa Izaho mahalala ny hevitra iheverako anareo, hoy Jehovah, dia hevitra hahatonga fiadanana, fa tsy loza, mba hanome anareo fanantenana amin’ ny andro ho avy.',
    theme: 'Fanantenana',
  },
  {
    bookNumber: 40,
    bookName: 'Matio',
    chapterNumber: 11,
    verseNumber: 28,
    text: 'Mankanesa atỳ amiko, ianareo rehetra izay miasa fatratra sy mavesatra entana, fa Izaho no hanome anareo fitsaharana.',
    theme: 'Fahasoavana',
  },
  {
    bookNumber: 40,
    bookName: 'Matio',
    chapterNumber: 6,
    verseNumber: 33,
    text: 'Fa katsaho aloha ny fanjakan’ Andriamanitra sy ny fahamarinany, dia hanampy ho anareo izany rehetra izany.',
    theme: 'Laharam-pahamehana',
  },
  {
    bookNumber: 19,
    bookName: 'Salamo',
    chapterNumber: 119,
    verseNumber: 105,
    text: 'Fanilon’ ny tongotro sy fanazavana ny lalako ny teninao.',
    theme: 'Ny Tenin’Andriamanitra',
  },
  {
    bookNumber: 19,
    bookName: 'Salamo',
    chapterNumber: 46,
    verseNumber: 1,
    text: 'Andriamanitra no fialofantsika sy herintsika; Mpamonjy mora azo indrindra amin’ ny fahoriana Izy.',
    theme: 'Fialofana',
  },
  {
    bookNumber: 58,
    bookName: 'Hebreo',
    chapterNumber: 11,
    verseNumber: 1,
    text: 'Ary ny finoana no fizahan-toetra ny zavatra antenaina, fanehoana ny zavatra tsy hita.',
    theme: 'Ny Finoana',
  },
];

export const READING_PLANS: ReadingPlanDay[] = [
  {
    day: 1,
    title: 'Andro 1: Ny Famoronana sy ny Fahazavana',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 1, bookName: 'Genesisy', chapterNumber: 1, label: 'Gen 1' },
      { bookNumber: 19, bookName: 'Salamo', chapterNumber: 1, label: 'Sal 1' },
      { bookNumber: 43, bookName: 'Jaona', chapterNumber: 1, label: 'Jao 1' },
    ],
  },
  {
    day: 2,
    title: 'Andro 2: Ny Fanekena sy ny Fitokisana',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 1, bookName: 'Genesisy', chapterNumber: 12, label: 'Gen 12' },
      { bookNumber: 19, bookName: 'Salamo', chapterNumber: 23, label: 'Sal 23' },
      { bookNumber: 45, bookName: 'Romana', chapterNumber: 4, label: 'Rom 4' },
    ],
  },
  {
    day: 3,
    title: 'Andro 3: Fanafahana sy Fanavotana',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 2, bookName: 'Eksodosy', chapterNumber: 14, label: 'Eks 14' },
      { bookNumber: 19, bookName: 'Salamo', chapterNumber: 103, label: 'Sal 103' },
      { bookNumber: 48, bookName: 'Galatiana', chapterNumber: 5, label: 'Gal 5' },
    ],
  },
  {
    day: 4,
    title: 'Andro 4: Ny Didy sy ny Lalàn’ny Fitiavana',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 2, bookName: 'Eksodosy', chapterNumber: 20, label: 'Eks 20' },
      { bookNumber: 19, bookName: 'Salamo', chapterNumber: 19, label: 'Sal 19' },
      { bookNumber: 40, bookName: 'Matio', chapterNumber: 22, label: 'Mat 22' },
    ],
  },
  {
    day: 5,
    title: 'Andro 5: Ny Fahendrena marina',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 20, bookName: 'Ohabolana', chapterNumber: 3, label: 'Ohab 3' },
      { bookNumber: 19, bookName: 'Salamo', chapterNumber: 111, label: 'Sal 111' },
      { bookNumber: 59, bookName: 'Jakoba', chapterNumber: 1, label: 'Jak 1' },
    ],
  },
  {
    day: 6,
    title: 'Andro 6: Fampaherezana sy Famonjena',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 23, bookName: 'Isaia', chapterNumber: 53, label: 'Isa 53' },
      { bookNumber: 19, bookName: 'Salamo', chapterNumber: 91, label: 'Sal 91' },
      { bookNumber: 42, bookName: 'Lioka', chapterNumber: 24, label: 'Lio 24' },
    ],
  },
  {
    day: 7,
    title: 'Andro 7: Ny Fiangonana sy ny Fanantenana',
    testament: 'Fianarana fototra',
    passages: [
      { bookNumber: 44, bookName: "Asan'ny Apostoly", chapterNumber: 2, label: 'Asan 2' },
      { bookNumber: 49, bookName: 'Efesiana', chapterNumber: 2, label: 'Efe 2' },
      { bookNumber: 66, bookName: 'Apokalypsy', chapterNumber: 21, label: 'Apok 21' },
    ],
  },
];

// Map of common shorthand names / abbreviations
const BOOK_ALIASES: Record<string, number> = {
  gen: 1, genesisy: 1, gn: 1,
  eks: 2, eksodosy: 2, ex: 2, exode: 2,
  lev: 3, levitikosy: 3, lv: 3,
  nom: 4, nomery: 4, nb: 4,
  deo: 5, deoteronomia: 5, dt: 5,
  jos: 6, josoa: 6,
  mpi: 7, mpitsara: 7, jg: 7,
  rot: 8, rota: 8, rt: 8,
  '1sam': 9, '1samoela': 9, '1 sam': 9, '1 samoela': 9, '1s': 9,
  '2sam': 10, '2samoela': 10, '2 sam': 10, '2 samoela': 10, '2s': 10,
  '1mpan': 11, '1mpanjaka': 11, '1 mpan': 11, '1 r': 11,
  '2mpan': 12, '2mpanjaka': 12, '2 mpan': 12, '2 r': 12,
  '1tan': 13, '1tantara': 13, '1 ch': 13,
  '2tan': 14, '2tantara': 14, '2 ch': 14,
  ezr: 15, ezra: 15,
  neh: 16, nehemia: 16,
  est: 17, estera: 17,
  job: 18, joba: 18,
  sal: 19, salamo: 19, ps: 19, psaumes: 19,
  ohab: 20, ohabolana: 20, pr: 20, prov: 20,
  mpit: 21, mpitoriteny: 21, ec: 21,
  ton: 22, tononkira: 22, "tononkiran'i solomona": 22, ct: 22,
  isa: 23, isaia: 23, is: 23,
  jer: 24, jeremia: 24,
  fito: 25, fitomaniana: 25, lm: 25,
  ezek: 26, ezekiela: 26, ez: 26,
  dan: 27, daniela: 27,
  hos: 28, hosea: 28,
  joe: 29, joela: 29, jl: 29,
  amo: 30, amosa: 30, am: 30,
  oba: 31, obadia: 31, ob: 31,
  jon: 32, jona: 32,
  mik: 33, mika: 33, mi: 33,
  nah: 34, nahoma: 34, na: 34,
  hab: 35, habakoka: 35,
  zef: 36, zefania: 36,
  hag: 37, hagay: 37,
  zak: 38, zakaria: 38,
  mal: 39, malakia: 39,
  mat: 40, matio: 40, mt: 40,
  mar: 41, marka: 41, mc: 41,
  lio: 42, lioka: 42, lc: 42,
  jao: 43, jaona: 43, jn: 43, jean: 43,
  asan: 44, "asan'ny apostoly": 44, as: 44, act: 44,
  rom: 45, romana: 45, rm: 45,
  '1kor': 46, '1korintiana': 46, '1 co': 46, '1 cor': 46,
  '2kor': 47, '2korintiana': 47, '2 co': 47, '2 cor': 47,
  gal: 48, galatiana: 48, ga: 48,
  efe: 49, efesiana: 49, ep: 49,
  fil: 50, filipiana: 50, ph: 50,
  kol: 51, kolosiana: 51, col: 51,
  '1tes': 52, '1tesaloniana': 52, '1 th': 52,
  '2tes': 53, '2tesaloniana': 53, '2 th': 53,
  '1tim': 54, '1timoty': 54, '1 ti': 54,
  '2tim': 55, '2timoty': 55, '2 ti': 55,
  tit: 56, titosy: 56, tt: 56,
  file: 57, filemona: 57, phm: 57,
  heb: 58, hebreo: 58,
  jak: 59, jakoba: 59, jc: 59,
  '1pet': 60, '1petera': 60, '1 p': 60,
  '2pet': 61, '2petera': 61, '2 p': 61,
  '1jao': 62, '1jaona': 62, '1 jn': 62,
  '2jao': 63, '2jaona': 63, '2 jn': 63,
  '3jao': 64, '3jaona': 64, '3 jn': 64,
  jod: 65, joda: 65, jd: 65,
  apo: 66, apok: 66, apokalypsy: 66, ap: 66, rev: 66,
};

/**
 * Parses user strings like "Jaona 3:16", "Jao 3 16", "Sal 23", "Rom 8:28", "Gen 1"
 */
export function parseBibleReference(input: string): {
  bookNumber: number;
  chapterNumber: number;
  verseNumber?: number;
} | null {
  const cleaned = input.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cleaned) return null;

  // Regex pattern matching: [Prefix Book] [Chapter](: or space or ,)[Verse]
  // e.g. "jao 3:16", "1 kor 13:4", "sal 23", "genesisy 1:1"
  const match = cleaned.match(/^([1-3]?\s*[a-z’']+)\s+(\d+)(?:[:,\s](\d+))?$/i);
  if (!match) return null;

  const bookPart = match[1].replace(/\s+/g, '');
  const chapterPart = parseInt(match[2], 10);
  const versePart = match[3] ? parseInt(match[3], 10) : undefined;

  // Look up in alias map
  let bookNumber = BOOK_ALIASES[bookPart];
  if (!bookNumber) {
    // Try matching prefix against official names
    const found = BOOKS_META.find((b) =>
      b.name.toLowerCase().replace(/\s+/g, '').startsWith(bookPart)
    );
    if (found) {
      bookNumber = found.book_number;
    }
  }

  if (!bookNumber) return null;

  const meta = BOOKS_META[bookNumber - 1];
  if (!meta) return null;

  const validChapter = Math.max(1, Math.min(chapterPart, meta.chapters));

  return {
    bookNumber,
    chapterNumber: validChapter,
    verseNumber: versePart,
  };
}

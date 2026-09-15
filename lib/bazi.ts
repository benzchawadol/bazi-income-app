// ---------------------------------------------------------------------------
// Bazi (Four Pillars of Destiny) calculation engine
// ---------------------------------------------------------------------------
// Rules implemented:
//  - Year pillar: sexagenary cycle anchored so that 1984 = 甲子 (Jiǎ Zǐ),
//    with the Bazi year switching over at Lichun (立春, ~Feb 4), not Jan 1.
//  - Month pillar: month boundaries follow the 12 "Jie" (节) solar terms,
//    approximated with their well-known average Gregorian dates (±1 day
//    accuracy in most years). Month stem derived from the "Five Tigers"
//    (五虎遁) rule based on the year stem.
//  - Day pillar: computed from an exact Julian Day Number, using the
//    verified anchor (JDN + 49) % 60 = 0 -> 甲子.
//  - Hour pillar: 2-hour branch slots starting at 23:00 (子时). Hour stem
//    derived from the "Five Rats" (五鼠遁) rule based on the day stem.
//    A birth time of 23:00-23:59 rolls the day pillar to the next
//    calendar day, per traditional convention.
//
// Because precise solar-term timing requires astronomical ephemeris data,
// this engine uses well-established average dates for month/year
// boundaries. That is standard practice for general-audience Bazi tools
// and is accurate for the vast majority of birth dates/times, but can be
// off by up to a day for births that fall exactly on a boundary. This is
// an entertainment tool, not a professional astrological service.
// ---------------------------------------------------------------------------

export type Element = "wood" | "fire" | "earth" | "metal" | "water";

export const STEMS_ZH = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const STEMS_TH = [
  "เจี่ย (甲)",
  "อี่ (乙)",
  "ปิ่ง (丙)",
  "ติง (丁)",
  "อู้ (戊)",
  "กี่ (己)",
  "เกง (庚)",
  "ซิน (辛)",
  "หยิ่ม (壬)",
  "กุ่ย (癸)",
] as const;

export const BRANCHES_ZH = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const BRANCHES_TH = [
  "จื้อ/หนู (子)",
  "โฉ่ว/วัว (丑)",
  "อิ๋ง/เสือ (寅)",
  "เบ๋า/กระต่าย (卯)",
  "เซิ้ง/มังกร (辰)",
  "จื้อ(สี่)/งู (巳)",
  "อู่/ม้า (午)",
  "บี่/แพะ (未)",
  "เซิน/ลิง (申)",
  "อิ๋ว/ไก่ (酉)",
  "สีว/หมา (戌)",
  "ไห่/หมู (亥)",
] as const;

export const STEM_ELEMENT: Element[] = [
  "wood", "wood", "fire", "fire", "earth", "earth", "metal", "metal", "water", "water",
];
export const STEM_YIN_YANG: ("yang" | "yin")[] = [
  "yang", "yin", "yang", "yin", "yang", "yin", "yang", "yin", "yang", "yin",
];
export const BRANCH_ELEMENT: Element[] = [
  "water", "earth", "wood", "wood", "earth", "fire", "fire", "earth", "metal", "metal", "earth", "water",
];

// Hidden stems (地支藏干) with relative weights [main, middle, residual]
const HIDDEN_STEMS: { idx: number; weight: number }[][] = [
  [{ idx: 9, weight: 1.0 }], // 子: 癸
  [{ idx: 5, weight: 0.6 }, { idx: 9, weight: 0.3 }, { idx: 7, weight: 0.1 }], // 丑: 己癸辛
  [{ idx: 0, weight: 0.6 }, { idx: 2, weight: 0.3 }, { idx: 4, weight: 0.1 }], // 寅: 甲丙戊
  [{ idx: 1, weight: 1.0 }], // 卯: 乙
  [{ idx: 4, weight: 0.6 }, { idx: 1, weight: 0.3 }, { idx: 9, weight: 0.1 }], // 辰: 戊乙癸
  [{ idx: 2, weight: 0.6 }, { idx: 4, weight: 0.3 }, { idx: 6, weight: 0.1 }], // 巳: 丙戊庚
  [{ idx: 3, weight: 0.7 }, { idx: 5, weight: 0.3 }], // 午: 丁己
  [{ idx: 5, weight: 0.6 }, { idx: 3, weight: 0.3 }, { idx: 1, weight: 0.1 }], // 未: 己丁乙
  [{ idx: 6, weight: 0.6 }, { idx: 8, weight: 0.3 }, { idx: 4, weight: 0.1 }], // 申: 庚壬戊
  [{ idx: 7, weight: 1.0 }], // 酉: 辛
  [{ idx: 4, weight: 0.6 }, { idx: 7, weight: 0.3 }, { idx: 3, weight: 0.1 }], // 戌: 戊辛丁
  [{ idx: 8, weight: 0.7 }, { idx: 0, weight: 0.3 }], // 亥: 壬甲
];

export interface Pillar {
  stemIdx: number;
  branchIdx: number;
  stemZh: string;
  branchZh: string;
  stemTh: string;
  branchTh: string;
  element: Element; // element of the stem (used for the "headline" element of the pillar)
  yinYang: "yang" | "yin";
  label: string; // e.g. "ปีเกิด"
}

export interface BaziResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: { stemIdx: number; element: Element; yinYang: "yang" | "yin" };
  elementCounts: Record<Element, number>; // raw weighted counts
  elementPercent: Record<Element, number>; // 0-100, sums to 100
  tenGodByElement: Record<Element, TenGod>;
  usedNextDayForZiHour: boolean;
}

export type TenGod = "companion" | "output" | "resource" | "wealth" | "authority";

const GEN_MAP: Record<Element, Element> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};
const CTRL_MAP: Record<Element, Element> = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function toJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

// Average Gregorian (month, day) boundaries for the 12 "Jie" (节) solar terms
// that start each Bazi month, sorted in calendar (Jan->Dec) order. Each entry
// is the date on which the branch to its right *begins*. Dates before the
// first entry (Jan 1-5) still belong to the 子 month that started at the
// previous 大雪 (~Dec 7 of the prior year).
const MONTH_BOUNDARIES: { key: number; branchIdx: number }[] = [
  { key: 106, branchIdx: 1 },  // 丑 小寒 (Jan 6)
  { key: 204, branchIdx: 2 },  // 寅 立春 (Feb 4)
  { key: 306, branchIdx: 3 },  // 卯 惊蛰 (Mar 6)
  { key: 405, branchIdx: 4 },  // 辰 清明 (Apr 5)
  { key: 506, branchIdx: 5 },  // 巳 立夏 (May 6)
  { key: 606, branchIdx: 6 },  // 午 芒种 (Jun 6)
  { key: 707, branchIdx: 7 },  // 未 小暑 (Jul 7)
  { key: 808, branchIdx: 8 },  // 申 立秋 (Aug 8)
  { key: 908, branchIdx: 9 },  // 酉 白露 (Sep 8)
  { key: 1008, branchIdx: 10 }, // 戌 寒露 (Oct 8)
  { key: 1107, branchIdx: 11 }, // 亥 立冬 (Nov 7)
  { key: 1207, branchIdx: 0 },  // 子 大雪 (Dec 7)
];

const LICHUN_MONTH = 2;
const LICHUN_DAY = 4;

export interface BirthInput {
  year: number; // Gregorian (AD) year
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
}

function buildPillar(stemIdx: number, branchIdx: number, label: string): Pillar {
  stemIdx = mod(stemIdx, 10);
  branchIdx = mod(branchIdx, 12);
  return {
    stemIdx,
    branchIdx,
    stemZh: STEMS_ZH[stemIdx],
    branchZh: BRANCHES_ZH[branchIdx],
    stemTh: STEMS_TH[stemIdx],
    branchTh: BRANCHES_TH[branchIdx],
    element: STEM_ELEMENT[stemIdx],
    yinYang: STEM_YIN_YANG[stemIdx],
    label,
  };
}

export function calculateBazi(input: BirthInput): BaziResult {
  const { year, month, day, hour, minute } = input;

  // --- Year pillar (switches at Lichun ~Feb 4) ---
  const beforeLichun =
    month < LICHUN_MONTH || (month === LICHUN_MONTH && day < LICHUN_DAY);
  const baziYear = beforeLichun ? year - 1 : year;
  const yearStemIdx = mod(baziYear - 4, 10);
  const yearBranchIdx = mod(baziYear - 4, 12);
  const yearPillar = buildPillar(yearStemIdx, yearBranchIdx, "ปีเกิด");

  // --- Month pillar (switches at each Jie solar term boundary) ---
  // Default: before Jan 6, still in the 子 month that began at the previous
  // year's 大雪 (~Dec 7). Then walk boundaries in ascending calendar order,
  // keeping the branch of the last boundary crossed.
  const birthKey = month * 100 + day;
  let monthBranchIdx = 0; // 子, default for Jan 1-5
  for (const b of MONTH_BOUNDARIES) {
    if (birthKey >= b.key) monthBranchIdx = b.branchIdx;
  }

  const monthOrder = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 寅..丑
  const monthIndexInCycle = monthOrder.indexOf(monthBranchIdx);
  const yearStemMod5 = mod(yearStemIdx, 5);
  const tigerMonthStemBase = [2, 4, 6, 8, 0][yearStemMod5]; // 丙戊庚壬甲
  const monthStemIdx = mod(tigerMonthStemBase + monthIndexInCycle, 10);
  const monthPillar = buildPillar(monthStemIdx, monthBranchIdx, "เดือนเกิด");

  // --- Day pillar (exact, via Julian Day Number) ---
  // 23:00-23:59 belongs to the next day's early Zi hour by convention.
  let dayY = year, dayM = month, dayD = day;
  let usedNextDayForZiHour = false;
  if (hour === 23) {
    usedNextDayForZiHour = true;
    const d = new Date(Date.UTC(year, month - 1, day));
    d.setUTCDate(d.getUTCDate() + 1);
    dayY = d.getUTCFullYear();
    dayM = d.getUTCMonth() + 1;
    dayD = d.getUTCDate();
  }
  const jdn = toJDN(dayY, dayM, dayD);
  const dayIdx60 = mod(jdn + 49, 60);
  const dayStemIdx = mod(dayIdx60, 10);
  const dayBranchIdx = mod(dayIdx60, 12);
  const dayPillar = buildPillar(dayStemIdx, dayBranchIdx, "วันเกิด");

  // --- Hour pillar ---
  const effHour = hour === 24 ? 0 : hour;
  let hourBranchIdx: number;
  if (effHour === 23 || effHour === 0) hourBranchIdx = 0;
  else hourBranchIdx = Math.floor((effHour + 1) / 2);
  const dayStemMod5 = mod(dayStemIdx, 5);
  const ziHourStemBase = [0, 2, 4, 6, 8][dayStemMod5]; // 甲丙戊庚壬
  const hourStemIdx = mod(ziHourStemBase + hourBranchIdx, 10);
  const hourPillar = buildPillar(hourStemIdx, hourBranchIdx, "ชั่วโมงเกิด");

  // --- Five elements weighted count across all 8 characters ---
  const counts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  for (const p of pillars) {
    counts[STEM_ELEMENT[p.stemIdx]] += 1.0;
    for (const hs of HIDDEN_STEMS[p.branchIdx]) {
      counts[STEM_ELEMENT[hs.idx]] += hs.weight;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percent: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  (Object.keys(counts) as Element[]).forEach((k) => {
    percent[k] = total > 0 ? Math.round((counts[k] / total) * 1000) / 10 : 0;
  });

  // --- Ten Gods mapped by element, relative to Day Master ---
  const meElement = STEM_ELEMENT[dayStemIdx];
  const tenGodByElement = {} as Record<Element, TenGod>;
  (Object.keys(counts) as Element[]).forEach((x) => {
    if (x === meElement) tenGodByElement[x] = "companion";
    else if (GEN_MAP[x] === meElement) tenGodByElement[x] = "resource";
    else if (GEN_MAP[meElement] === x) tenGodByElement[x] = "output";
    else if (CTRL_MAP[meElement] === x) tenGodByElement[x] = "wealth";
    else if (CTRL_MAP[x] === meElement) tenGodByElement[x] = "authority";
  });

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster: { stemIdx: dayStemIdx, element: meElement, yinYang: STEM_YIN_YANG[dayStemIdx] },
    elementCounts: counts,
    elementPercent: percent,
    tenGodByElement,
    usedNextDayForZiHour,
  };
}

import { BaziResult, Element, TenGod } from "./bazi";

const ELEMENT_TH: Record<Element, string> = {
  wood: "ไม้ (木)",
  fire: "ไฟ (火)",
  earth: "ดิน (土)",
  metal: "ทอง/โลหะ (金)",
  water: "น้ำ (水)",
};

export const ELEMENT_TH_SHORT: Record<Element, string> = {
  wood: "ไม้",
  fire: "ไฟ",
  earth: "ดิน",
  metal: "โลหะ",
  water: "น้ำ",
};

const CAREER_BY_DAY_MASTER: Record<Element, string> = {
  wood:
    "เจ้าชะตาธาตุไม้ มักมีความคิดสร้างสรรค์ ชอบเติบโตและพัฒนาตนเองอย่างต่อเนื่อง เหมาะกับงานด้านการศึกษา การวางแผน สายงานสีเขียว/สิ่งแวดล้อม งานไม้-เฟอร์นิเจอร์-กระดาษ หรือธุรกิจที่ต้องอาศัยการขยายตัวและวิสัยทัศน์ระยะยาว",
  fire:
    "เจ้าชะตาธาตุไฟ มีความกระตือรือร้น มีเสน่ห์ และแสดงออกเก่ง เหมาะกับงานสื่อ บันเทิง การตลาด การขาย งานที่เกี่ยวข้องกับพลังงาน แสงไฟ เทคโนโลยี หรือการเป็นที่สนใจของสาธารณชน",
  earth:
    "เจ้าชะตาธาตุดิน มีความมั่นคง หนักแน่น น่าเชื่อถือ เหมาะกับงานด้านอสังหาริมทรัพย์ การเกษตร งานบริหารจัดการ งานราชการ/สายมั่นคง หรืองานที่ต้องอาศัยความอดทนและความสม่ำเสมอ",
  metal:
    "เจ้าชะตาธาตุทอง มีความเฉียบคม มีระเบียบวินัย ตัดสินใจแม่นยำ เหมาะกับงานด้านการเงิน การบัญชี กฎหมาย วิศวกรรม งานที่ต้องใช้ความละเอียดแม่นยำ หรืองานที่เกี่ยวกับโลหะ/เครื่องจักร",
  water:
    "เจ้าชะตาธาตุน้ำ มีไหวพริบ ปรับตัวเก่ง มองการณ์ไกล เหมาะกับงานด้านการค้า โลจิสติกส์ การสื่อสาร การเงินระหว่างประเทศ งานที่ต้องเดินทางหรือปรับเปลี่ยนตามสถานการณ์",
};

const TEN_GOD_NOTE: Record<TenGod, string> = {
  companion:
    "มีพลังตัวตนสูง มั่นใจ พึ่งพาตนเองได้ดี แต่ควรระวังการแข่งขันหรือการแบ่งปันผลประโยชน์กับผู้อื่น",
  output:
    "มีความคิดสร้างสรรค์และความสามารถในการแสดงออกสูง รายได้มักมาจากฝีมือ ทักษะ หรือผลงานของตนเอง",
  resource:
    "ได้รับการสนับสนุนจากผู้ใหญ่ ครูบาอาจารย์ หรือโอกาสด้านการศึกษา/ความรู้ค่อนข้างดี ช่วยเสริมความมั่นคงในอาชีพ",
  wealth:
    "มีศักยภาพด้านการสะสมทรัพย์สินและเงินทอง เนื่องจากเป็นธาตุที่เจ้าชะตาควบคุมได้เอง (เปรียบเสมือน 'ทรัพย์' ตามหลักปาจื้อ)",
  authority:
    "มีแรงกดดันด้านหน้าที่การงานหรือกฎระเบียบ แต่หากบริหารจัดการดีจะช่วยเสริมตำแหน่งหน้าที่และความก้าวหน้า",
};

function topElementByRole(result: BaziResult, role: TenGod): { element: Element; percent: number } | null {
  const entries = Object.entries(result.tenGodByElement) as [Element, TenGod][];
  const match = entries.find(([, r]) => r === role);
  if (!match) return null;
  return { element: match[0], percent: result.elementPercent[match[0]] };
}

type CareerRole = "output" | "resource" | "authority";

// Same 25% / 12% cutoffs already used for the wealth level in buildFinanceSummary,
// reused here so "high/mid/low" means the same thing everywhere in this file.
function roleImpactLevel(percent: number): "high" | "mid" | "low" {
  if (percent >= 25) return "high";
  if (percent >= 12) return "mid";
  return "low";
}

const LEVEL_LABEL: Record<"high" | "mid" | "low", string> = {
  high: "เด่นชัด",
  mid: "ค่อนข้างเด่น",
  low: "อยู่บ้าง",
};

const ROLE_NOTE_TEMPLATE: Record<
  CareerRole,
  (levelLabel: string, elementLabel: string, percent: number) => string
> = {
  output: (level, el, pct) =>
    `มีความคิดสร้างสรรค์และความสามารถในการแสดงออก${level} รายได้มักมาจากฝีมือ ทักษะ หรือผลงานของตนเอง (ธาตุ${el} ${pct}% ของผัง)`,
  resource: (level, el, pct) =>
    `ได้รับการสนับสนุนจากผู้ใหญ่ ครูบาอาจารย์ หรือโอกาสด้านการศึกษา/ความรู้${level} ช่วยเสริมความมั่นคงในอาชีพ (ธาตุ${el} ${pct}% ของผัง)`,
  authority: (level, el, pct) =>
    `มีแรงกดดันด้านหน้าที่การงานหรือกฎระเบียบ${level} แต่หากบริหารจัดการดีจะช่วยเสริมตำแหน่งหน้าที่และความก้าวหน้า (ธาตุ${el} ${pct}% ของผัง)`,
};

function buildRoleNote(role: CareerRole, element: Element, percent: number): string {
  const level = LEVEL_LABEL[roleImpactLevel(percent)];
  return ROLE_NOTE_TEMPLATE[role](level, ELEMENT_TH_SHORT[element], percent);
}

export function buildCareerSummary(result: BaziResult): string {
  const base = CAREER_BY_DAY_MASTER[result.dayMaster.element];
  const roles: CareerRole[] = ["output", "resource", "authority"];
  let strongest: { role: CareerRole; element: Element; percent: number } | null = null;
  for (const r of roles) {
    const t = topElementByRole(result, r);
    if (t && (!strongest || t.percent > strongest.percent)) {
      strongest = { role: r, element: t.element, percent: t.percent };
    }
  }
  const extra = strongest ? " " + buildRoleNote(strongest.role, strongest.element, strongest.percent) : "";
  return base + extra;
}

export function buildFinanceSummary(result: BaziResult): string {
  const wealth = topElementByRole(result, "wealth");
  const companion = topElementByRole(result, "companion");
  const authority = topElementByRole(result, "authority");

  const parts: string[] = [];

  if (wealth) {
    const level = wealth.percent >= 25 ? "ค่อนข้างโดดเด่น" : wealth.percent >= 12 ? "อยู่ในเกณฑ์ปานกลาง" : "ค่อนข้างน้อย";
    parts.push(
      `ธาตุ${ELEMENT_TH_SHORT[wealth.element]}ซึ่งเปรียบเสมือนตัวแทน "ทรัพย์" ของเจ้าชะตา (ธาตุที่เจ้าชะตาควบคุมได้) มีสัดส่วนอยู่ที่ประมาณ ${wealth.percent}% ของดวงชะตา ถือว่า${level} บ่งบอกถึงศักยภาพด้านการสะสมทรัพย์สินและโอกาสด้านการเงินในภาพรวม`
    );
  }

  if (companion && companion.percent >= 25) {
    parts.push(
      "อย่างไรก็ตาม มีพลังธาตุเดียวกับตัวเจ้าชะตาในสัดส่วนสูง ควรระมัดระวังเรื่องการใช้จ่ายร่วมกับผู้อื่น หุ้นส่วน หรือการแข่งขันแย่งชิงผลประโยชน์"
    );
  }

  if (authority && authority.percent >= 25) {
    parts.push(
      "มีแรงกดดันจากหน้าที่การงาน/กฎเกณฑ์ในสัดส่วนสูง หากสามารถบริหารจัดการได้ดีจะช่วยให้รายได้มีความมั่นคงในระยะยาวผ่านตำแหน่งหน้าที่ที่ชัดเจน"
    );
  }

  parts.push("ควรพิจารณาวางแผนการเงินอย่างรอบคอบ และใช้ข้อมูลนี้เป็นแนวทางประกอบการตัดสินใจเท่านั้น");

  return parts.join(" ");
}

export { ELEMENT_TH };

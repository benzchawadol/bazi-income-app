import { Element, Pillar } from "@/lib/bazi";

const ELEMENT_COLOR: Record<Element, string> = {
  wood: "text-wood",
  fire: "text-fire",
  earth: "text-earth",
  metal: "text-metal",
  water: "text-water",
};

const ELEMENT_BG: Record<Element, string> = {
  wood: "bg-wood/15",
  fire: "bg-fire/15",
  earth: "bg-earth/15",
  metal: "bg-metal/15",
  water: "bg-water/15",
};

const ELEMENT_LABEL_TH: Record<Element, string> = {
  wood: "ไม้",
  fire: "ไฟ",
  earth: "ดิน",
  metal: "โลหะ",
  water: "น้ำ",
};

export default function PillarBox({ pillar }: { pillar: Pillar }) {
  return (
    <div className="pillar-box parchment-bg shadow-parchment p-3 sm:p-4 flex flex-col items-center gap-2 text-ink">
      <span className="font-serif text-sm sm:text-base tracking-wide text-parchment-800/80">
        {pillar.label}
      </span>
      <div className="flex flex-col items-center gap-1">
        <span className="font-serif text-4xl sm:text-5xl leading-none">{pillar.stemZh}</span>
        <span className="font-serif text-4xl sm:text-5xl leading-none">{pillar.branchZh}</span>
      </div>
      <div className="text-[11px] sm:text-xs text-center leading-tight text-parchment-900/80">
        <div>{pillar.stemTh}</div>
        <div>{pillar.branchTh}</div>
      </div>
      <span
        className={`mt-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${ELEMENT_COLOR[pillar.element]} ${ELEMENT_BG[pillar.element]}`}
      >
        ธาตุ{ELEMENT_LABEL_TH[pillar.element]} · {pillar.yinYang === "yang" ? "หยาง" : "อิน"}
      </span>
    </div>
  );
}

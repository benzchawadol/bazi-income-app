"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

const beToAd = (be: number) => be - 543;
const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

function LuxuryPillar({ pillar, isUnknown, delay }: { pillar: any; isUnknown?: boolean; delay: number }) {
  if (!pillar || isUnknown) {
    return (
      <div className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-yellow-500/[0.08] to-amber-700/[0.08] border border-yellow-500/20 p-[1px]">
        <div className="rounded-[19px] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] p-5 h-full text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <div className="text-[10px] tracking-[0.3em] text-yellow-200/40 mb-3">HOUR · เวลา</div>
          <div className="text-2xl font-serif font-bold text-yellow-200/80">ไม่ทราบ</div>
          <div className="text-[11px] text-yellow-200/40 mt-2">ชั่วโมงเกิด</div>
          <div className="mt-4 text-[10px] text-white/30">* วิเคราะห์ด้วย 3 เสาหลัก</div>
        </div>
      </div>
    );
  }
  const elementColor: any = { wood: "#22c55e", fire: "#ef4444", earth: "#eab308", metal: "#e5e7eb", water: "#60a5fa" };
  return (
    <div className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] p-[1px] hover:border-yellow-500/20 transition-all duration-500" style={{ animationDelay: `${delay}ms` }}>
      <div className="rounded-[19px] bg-gradient-to-b from-[#1e1e1e] to-[#111] p-5 h-full text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="text-[10px] tracking-[0.3em] text-white/30 mb-3">{pillar.label?.toUpperCase() || "PILLAR"}</div>
        <div className="font-serif text-[22px] leading-none font-bold text-[#f5e6c8]">{pillar.stemZh}<span className="text-white/20 mx-1">·</span>{pillar.branchZh}</div>
        <div className="mt-1 text-[12px] text-white/60">{pillar.stemTh?.split(" ")[0]} {pillar.branchTh?.split(" ")[0]}</div>
        <div className="mt-3 flex justify-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-[10px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: elementColor[pillar.element] || "#fff" }} />
            {pillar.element} · {pillar.yinYang}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [year, setYear] = useState<number>(beToAd(2530));
  const [month, setMonth] = useState<number>(4);
  const [day, setDay] = useState<number>(5);
  const [hour, setHour] = useState<number>(4);
  const [minute, setMinute] = useState<number>(0);
  const [unknownTime, setUnknownTime] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const maxDay = useMemo(() => daysInMonth(year, month), [year, month]);

  function handleCalculate() {
    setError(null);
    try {
      const raw = calculateBaziReal({ year, month, day, hour: unknownTime ? 12 : hour, minute: unknownTime ? 0 : minute });
      setResult({ ...raw, isUnknownTime: unknownTime, displayHour: unknownTime ? null : raw.hour });
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const elementList = result ? [
    { k: "wood", label: "ไม้", p: result.elementPercent?.wood || 0, color: "#22c55e" },
    { k: "fire", label: "ไฟ", p: result.elementPercent?.fire || 0, color: "#ef4444" },
    { k: "earth", label: "ดิน", p: result.elementPercent?.earth || 0, color: "#eab308" },
    { k: "metal", label: "ทอง", p: result.elementPercent?.metal || 0, color: "#e5e7eb" },
    { k: "water", label: "น้ำ", p: result.elementPercent?.water || 0, color: "#60a5fa" },
  ].sort((a,b)=>b.p-a.p) : [];

  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-yellow-500/30">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(120,80,20,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
      </div>

      <div className="relative max-w-[720px] mx-auto px-4 py-10 sm:py-16">
        {/* Header Luxury */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] tracking-[0.2em] text-yellow-200/60 mb-4">PREMIUM BAZI · LUXURY EDITION</div>
          <h1 className="font-serif text-[32px] sm:text-[42px] leading-none tracking-wide text-[#f5e6c8]">คำนวณดวงจีน ปาจื้อ</h1>
          <div className="mt-3 flex justify-center items-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/30" />
            <p className="text-[12px] tracking-widest text-white/30">FOUR PILLARS OF DESTINY</p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/30" />
          </div>
        </div>

        {/* Input Card Luxury */}
        <div className="relative rounded-[24px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-[1px]">
          <div className="rounded-[23px] bg-[#121212] p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "วัน", value: day, setter: setDay, max: maxDay },
                { label: "เดือน", value: month, setter: setMonth, max: 12 },
              ].map((f: any) => (
                <label key={f.label} className="flex flex-col gap-2">
                  <span className="text-[10px] tracking-[0.2em] text-white/30">{f.label.toUpperCase()}</span>
                  <select value={f.value} onChange={e=>f.setter(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-500/30 focus:outline-none">
                    {Array.from({length: f.max}, (_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </label>
              ))}
              <label className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] text-white/30">ปี พ.ศ.</span>
                <input type="number" value={year+543} onChange={e=>setYear(beToAd(parseInt(e.target.value)||0))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-500/30 focus:outline-none" />
              </label>
            </div>

            <div className="mt-6 rounded-2xl bg-black/40 border border-yellow-500/10 p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] tracking-[0.2em] text-white/40">เวลาเกิด</span>
                <label className="flex items-center gap-2 text-[12px] text-yellow-300 cursor-pointer">
                  <input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} className="rounded bg-black border-yellow-500/30 text-yellow-500" />
                  ไม่ทราบเวลาเกิด
                </label>
              </div>
              <div className={`grid grid-cols-2 gap-3 transition-all ${unknownTime ? "opacity-20 pointer-events-none" : ""}`}>
                <select value={hour} onChange={e=>setHour(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm">
                  {Array.from({length:24}, (_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}:00 น.</option>)}
                </select>
                <select value={minute} onChange={e=>setMinute(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm">
                  {Array.from({length:60}, (_,i)=>i).map(m=><option key={m} value={m}>{String(m).padStart(2,"0")} นาที</option>)}
                </select>
              </div>
              {unknownTime && <div className="mt-3 text-[11px] text-yellow-200/50">* ระบบจะวิเคราะห์ด้วย 3 เสาหลักอันทรงพลัง (ปี เดือน วัน) ให้ความแม่นยำ 75% ตามตำราหลวงจีน</div>}
            </div>

            <button onClick={handleCalculate} className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold tracking-wide py-4 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all active:scale-[0.98]">
              เปิดดวงชะตา · คำนวณบัดนี้
            </button>
            {error && <div className="mt-4 text-sm text-red-300">{error}</div>}
          </div>
        </div>

        {/* LUXURY RESULT */}
        {result && (
          <div ref={reportRef} className="mt-12 space-y-8">
            {/* Four Pillars Luxury */}
            <div>
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl text-[#f5e6c8]">แผนผังสี่เสาหลัก</h2>
                <p className="text-[11px] tracking-[0.3em] text-white/30 mt-2">FOUR PILLARS · {result.isUnknownTime ? "THREE PILLARS READING" : "COMPLETE DESTINY MAP"}</p>
                <div className="mx-auto mt-3 h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <LuxuryPillar pillar={result.year} delay={0} />
                <LuxuryPillar pillar={result.month} delay={100} />
                <LuxuryPillar pillar={result.day} delay={200} />
                <LuxuryPillar pillar={result.displayHour} isUnknown={result.isUnknownTime} delay={300} />
              </div>
            </div>

            {/* Day Master - Hero Card */}
            <div className="relative rounded-[24px] bg-gradient-to-br from-yellow-500/[0.08] via-[#121212] to-[#121212] border border-yellow-500/20 p-[1px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.15),transparent_60%)]" />
              <div className="relative rounded-[23px] bg-[#121212] p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] text-yellow-200/40">DAY MASTER · ตัวตนที่แท้จริง</div>
                    <div className="mt-2 font-serif text-3xl text-[#f5e6c8]">{result.day?.stemTh} {result.day?.branchTh}</div>
                    <div className="mt-1 text-sm text-white/50">ธาตุ {result.day?.element} · {result.day?.yinYang === "yang" ? "หยาง" : "หยิน"} · พลังแห่ง {result.day?.element === "wood" ? "การเติบโตและปัญญา" : result.day?.element === "fire" ? "ชื่อเสียงและความเจิดจรัส" : result.day?.element === "earth" ? "ความมั่นคงและทรัพย์" : result.day?.element === "metal" ? "ความเด็ดขาดและอำนาจ" : "ความลื่นไหลและสติปัญญา"}</div>
                  </div>
                  <div className="hidden sm:block text-6xl font-serif text-white/[0.04]">{result.day?.stemZh}{result.day?.branchZh}</div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                    <div className="text-[10px] text-white/30">พลังตัวตน</div>
                    <div className="mt-1 text-sm text-white/80">{result.elementPercent?.[result.day?.element] ? `${result.elementPercent[result.day.element].toFixed(1)}%` : "แข็งแกร่ง"}</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                    <div className="text-[10px] text-white/30">ธาตุเด่น</div>
                    <div className="mt-1 text-sm text-white/80">{elementList[0]?.label} {elementList[0]?.p.toFixed(0)}%</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                    <div className="text-[10px] text-white/30">โหมดชีวิต</div>
                    <div className="mt-1 text-sm text-white/80">{result.isUnknownTime ? "3 เสา · ลึกซึ้ง" : "4 เสา · สมบูรณ์"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Five Elements Luxury Bars */}
            <div className="rounded-[24px] bg-[#121212] border border-white/[0.06] p-6 sm:p-8">
              <h3 className="font-serif text-lg text-[#f5e6c8]">สมดุลเบญจธาตุ · รหัสพลังชีวิต</h3>
              <div className="mt-6 space-y-4">
                {elementList.map((el:any) => (
                  <div key={el.k} className="group">
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-white/40 tracking-widest">{el.label.toUpperCase()} · {el.k.toUpperCase()}</span>
                      <span className="text-white/60">{el.p.toFixed(1)}%</span>
                    </div>
                    <div className="h-[8px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125" style={{ width: `${el.p}%`, background: `linear-gradient(90deg, ${el.color}, ${el.color}aa)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wealth Code - Premium */}
            <div className="rounded-[24px] bg-gradient-to-br from-[#1a1600] via-[#121212] to-[#121212] border border-yellow-500/20 p-[1px]">
              <div className="rounded-[23px] bg-[#0f0e0a] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-bold">¥</div>
                  <div>
                    <h3 className="font-serif text-lg text-[#f5e6c8]">รหัสลับความมั่งคั่ง · Wealth Code</h3>
                    <p className="text-[11px] text-yellow-200/40">ถอดรหัสจาก {result.isUnknownTime ? "3 เสาหลัก" : "4 เสาหลัก"} ตามตำราฮ่องเต้</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-xl bg-white/[0.03] border border-yellow-500/10 p-4">
                    <div className="text-yellow-200/50 text-[10px] tracking-widest">อาชีพเรียกทรัพย์</div>
                    <div className="mt-2 text-white/90 leading-relaxed">ที่ปรึกษา · ครีเอทีฟ · การศึกษา · งานที่ใช้ {result.day?.element === "wood" ? "ความคิดสร้างสรรค์และคำพูด" : "ความเชี่ยวชาญเฉพาะทาง"} เป็นทุน</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-yellow-500/10 p-4">
                    <div className="text-yellow-200/50 text-[10px] tracking-widest">พลังหนุนดวง</div>
                    <div className="mt-2 text-white/90 leading-relaxed">สีมงคล: ขาว ทอง ฟ้า<br/>ทิศมงคล: ตะวันตก / เหนือ<br/>ธาตุเสริม: ทอง น้ำ</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-yellow-500/10 p-4">
                    <div className="text-yellow-200/50 text-[10px] tracking-widest">คำเตือนจักรวาล</div>
                    <div className="mt-2 text-white/90 leading-relaxed">{result.isUnknownTime ? "เมื่อไม่ทราบเวลา ให้โฟกัสการสร้างตัวตนและชื่อเสียงก่อน เวลาจะพาโอกาสใหญ่มาเอง" : "ปีนี้พลังไฟแรง ระวังการลงทุนเร็วเกินไป ให้ช้าลง 10% แล้วจะได้มากกว่าเดิม"}</div>
                  </div>
                </div>
                <div className="mt-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-center">
                  <div className="text-[11px] tracking-[0.2em] text-yellow-200/60">คำทำนายพิเศษสำหรับคุณ</div>
                  <div className="mt-2 font-serif text-[15px] leading-relaxed text-[#f5e6c8]">"ดวง {result.day?.stemTh} {result.day?.branchTh} เป็นดวงของนักสร้าง จากนี้ 3 ปีคือช่วงก่อร่างสร้างอาณาจักร อย่ากลัวที่จะเริ่มเล็ก แต่คิดให้ใหญ่"</div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] tracking-[0.3em] text-white/20 py-4">LUXURY BAZI · DESIGNED FOR DESTINY · © 2026</div>
          </div>
        )}
      </div>
    </main>
  );
}

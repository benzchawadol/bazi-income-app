"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

type CalendarType = "be" | "ad";
const beToAd = (be: number) => be - 543;
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export default function Home() {
  const [year, setYear] = useState<number>(beToAd(1996));
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
      // ถ้าไม่ทราบเวลา เราใช้เที่ยง (12:00) คำนวณไปก่อนเพื่อให้ได้ ปี เดือน วัน ที่ถูกต้อง
      const calcHour = unknownTime ? 12 : hour;
      const calcMinute = unknownTime ? 0 : minute;
      const raw = calculateBaziReal({ year, month, day, hour: calcHour, minute: calcMinute });
      
      if (unknownTime) {
        setResult({ ...raw, hour: null, isUnknownTime: true });
      } else {
        setResult({ ...raw, isUnknownTime: false });
      }
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      setError(e.message || "คำนวณไม่ได้");
    }
  }

  const PillarCard = ({ pillar, label }: { pillar: any, label: string }) => {
    if (!pillar) {
      return (
        <div className="border border-yellow-500/50 bg-yellow-500/10 rounded-lg p-3 text-center">
          <div className="text-[10px] text-yellow-200/60 mb-1">{label}</div>
          <div className="font-bold text-yellow-400">ไม่ทราบ</div>
          <div className="text-[10px] text-yellow-200/50 mt-1">ชั่วโมงเกิด</div>
        </div>
      );
    }
    return (
      <div className="border border-white/15 bg-white/[0.03] rounded-lg p-3 text-center">
        <div className="text-[10px] text-white/50 mb-1">{label}</div>
        <div className="font-bold text-white text-[13px] leading-tight">{pillar.stemTh}</div>
        <div className="font-bold text-white/80 text-[13px] leading-tight">{pillar.branchTh}</div>
        <div className="text-[10px] text-white/40 mt-1">{pillar.element} · {pillar.yinYang}</div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl text-center mb-6 font-serif">คำนวณดวงจีน ปาจื้อ</h1>

        <div className="flex gap-2 mb-4">
          <label className="flex flex-col gap-1 text-sm flex-1">
            วัน
            <select value={day} onChange={e=>setDay(parseInt(e.target.value,10))} className="rounded-md bg-white text-black px-2 py-2">
              {Array.from({length: maxDay}, (_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm flex-1">
            เดือน
            <select value={month} onChange={e=>setMonth(parseInt(e.target.value,10))} className="rounded-md bg-white text-black px-2 py-2">
              {Array.from({length:12}, (_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm flex-1">
            ปี (พ.ศ.)
            <input type="number" value={year+543} onChange={e=>setYear(beToAd(parseInt(e.target.value)||0))} className="rounded-md bg-white text-black px-2 py-2" />
          </label>
        </div>

        <div className="flex flex-col gap-2 border border-yellow-500/20 rounded-md p-3 bg-black/20 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">เวลาเกิด</span>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer text-yellow-400">
              <input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} className="rounded" />
              ไม่ทราบเวลาเกิด
            </label>
          </div>
          <div className={`flex gap-2 ${unknownTime ? "opacity-30 pointer-events-none" : ""}`}>
            <label className="flex flex-col gap-1 text-sm text-gray-300 flex-1">
              ชั่วโมง
              <select value={hour} onChange={e=>setHour(parseInt(e.target.value,10))} disabled={unknownTime} className="rounded-md bg-white text-black px-2 py-2">
                {Array.from({length:24}, (_,i)=>i).map(h=><option key={h} value={h}>{h.toString().padStart(2,"0")}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300 flex-1">
              นาที
              <select value={minute} onChange={e=>setMinute(parseInt(e.target.value,10))} disabled={unknownTime} className="rounded-md bg-white text-black px-2 py-2">
                {Array.from({length:60}, (_,i)=>i).map(m=><option key={m} value={m}>{m.toString().padStart(2,"0")}</option>)}
              </select>
            </label>
          </div>
          {unknownTime && <p className="text-[11px] text-gray-400">* จะคำนวณแบบ 3 เสาหลัก (ไม่รวมเสาชั่วโมง) ความแม่นยำ 75%</p>}
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button onClick={handleCalculate} className="mt-2 w-full rounded-lg bg-[#f5e6c8] px-6 py-3 font-bold text-black">
          คำนวณดวงชะตา
        </button>

        {result && (
          <div ref={reportRef} className="mt-8 rounded-xl bg-black/60 border border-yellow-700/30 p-4">
            <h2 className="font-serif text-center text-white mb-4">
              สี่เสาหลัก (Four Pillars) {result.isUnknownTime ? "(3 เสา - ไม่ทราบเวลา)" : ""}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <PillarCard pillar={result.year} label="ปีเกิด" />
              <PillarCard pillar={result.month} label="เดือน" />
              <PillarCard pillar={result.day} label="วันเกิด" />
              <PillarCard pillar={result.hour} label="เวลา" />
            </div>
            {result.isUnknownTime ? (
              <p className="mt-4 text-[11px] text-center text-yellow-200/70">
                * วิเคราะห์อาชีพและความมั่งคั่งด้วย 3 เสาหลัก (ปี เดือน วัน) ตามหลักสำหรับผู้ไม่ทราบเวลาเกิด
              </p>
            ) : (
              <div className="mt-4 text-[11px] text-center text-white/40">
                ธาตุหลัก: {result.dayMaster?.element} | ธาตุเด่น: ไม้ {result.elementPercent?.wood}% ไฟ {result.elementPercent?.fire}%
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

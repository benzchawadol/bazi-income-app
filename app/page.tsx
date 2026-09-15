"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

type CalendarType = "be" | "ad";
const beToAd = (be: number) => be - 543;
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export default function Home() {
  const [year, setYear] = useState<number>(beToAd(1996));
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(12);
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
      console.log("RAW RESULT FROM lib/bazi.ts:", raw);
      // ถ้าไม่ทราบเวลา เราจะซ่อนเสาชั่วโมง
      if (unknownTime) {
        setResult({ ...raw, hour: null, hourPillar: null, isUnknownTime: true, _raw: raw });
      } else {
        setResult({ ...raw, isUnknownTime: false, _raw: raw });
      }
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl text-center mb-4">DEBUG - หาโครงสร้างดวงจริง</h1>
        
        <div className="flex gap-2 mb-2">
          <select value={day} onChange={e=>setDay(parseInt(e.target.value))} className="bg-white text-black p-2 rounded">
            {Array.from({length: maxDay}, (_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          <select value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="bg-white text-black p-2 rounded">
            {Array.from({length:12}, (_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <input type="number" value={year+543} onChange={e=>setYear(beToAd(parseInt(e.target.value)||0))} className="bg-white text-black p-2 rounded w-24" />
        </div>

        <div className="flex gap-2 mb-4 items-center">
          <select value={hour} onChange={e=>setHour(parseInt(e.target.value))} disabled={unknownTime} className="bg-white text-black p-2 rounded disabled:opacity-30">
            {Array.from({length:24}, (_,i)=>i).map(h=><option key={h} value={h}>{h.toString().padStart(2,"0")}</option>)}
          </select>
          <select value={minute} onChange={e=>setMinute(parseInt(e.target.value))} disabled={unknownTime} className="bg-white text-black p-2 rounded disabled:opacity-30">
            {Array.from({length:60}, (_,i)=>i).map(m=><option key={m} value={m}>{m.toString().padStart(2,"0")}</option>)}
          </select>
          <label className="text-yellow-400 text-sm flex items-center gap-1">
            <input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} />
            ไม่ทราบเวลา
          </label>
        </div>

        <button onClick={handleCalculate} className="bg-[#f5e6c8] text-black px-6 py-2 rounded">คำนวณ</button>

        {error && <p className="text-red-300 mt-2">{error}</p>}

        {result && (
          <div ref={reportRef} className="mt-6 bg-white/10 p-4 rounded text-xs overflow-auto">
            <h3 className="text-sm font-bold mb-2">โครงสร้างดวงจริงจาก lib/bazi.ts:</h3>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(result._raw, null, 2)}</pre>
            <div className="mt-4 p-2 bg-black/50 rounded">
              <p>Keys: {Object.keys(result._raw).join(", ")}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

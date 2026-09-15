"use client";
import { useState, useRef, useMemo } from "react";

// --- Types & Helpers (ใช้ของเดิมคุณได้เลย) ---
type CalendarType = "be" | "ad";
type BaziResult = any;

const CURRENT_AD_YEAR = new Date().getFullYear();
const beToAd = (be: number) => be - 543;
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

// Mock - ถ้าคุณมี lib/bazi อยู่แล้ว ให้ import ของคุณแทน
const calculateBazi = (input: any): BaziResult => {
  // ใส่ logic คำนวณเดิมของคุณตรงนี้
  // ตอนนี้ mock ไว้ก่อนเพื่อให้ไม่พัง
  return { 
    year: { stem: "ปี", branch: "ชวด" },
    month: { stem: "เดือน", branch: "เถาะ" },
    day: { stem: "วัน", branch: "มะเส็ง" },
    hour: input.hour == null ? { stem: "ไม่ทราบ", branch: "ไม่ทราบ" } : { stem: "เวลา", branch: "ระกา" },
    isUnknownTime: input.hour == null
  };
};

export default function Home() {
  const [calendarType, setCalendarType] = useState<CalendarType>("be");
  const [year, setYear] = useState<number>(beToAd(1996));
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [unknownTime, setUnknownTime] = useState<boolean>(false);

  const [result, setResult] = useState<BaziResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const maxDay = useMemo(() => {
    const adYear = calendarType === "be" ? beToAd(year) : year;
    return daysInMonth(adYear, month);
  }, [year, month, calendarType]);

  function handleCalculate() {
    setError(null);
    const adYear = calendarType === "be" ? beToAd(year) : year;
    if (!adYear || adYear < 1 || adYear > 2500) {
      setError("กรุณากรอกปีเกิดให้ถูกต้อง");
      return;
    }
    if (day > daysInMonth(adYear, month)) {
      setError("วันที่ไม่ถูกต้องสำหรับเดือนนี้");
      return;
    }
    try {
      const finalHour = unknownTime ? null : hour;
      const finalMinute = unknownTime ? null : minute;
      
      const r = calculateBazi({ 
        year: adYear, 
        month, 
        day, 
        hour: finalHour, 
        minute: finalMinute,
        isUnknownTime: unknownTime 
      });
      setResult(r);
    } catch (e: any) {
      setError(e.message || "เกิดข้อผิดพลาดในการคำนวณ");
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl text-center mb-6">คำนวณดวงจีน ปาจื้อ</h1>
        
        {/* วันเกิด - ใช้ของเดิมคุณ */}
        <div className="flex gap-2 mb-4">
          <label className="flex flex-col gap-1 text-sm flex-1">
            วัน
            <select value={day} onChange={(e) => setDay(parseInt(e.target.value, 10))} className="rounded-md bg-white text-black px-2 py-1.5">
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm flex-1">
            เดือน
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))} className="rounded-md bg-white text-black px-2 py-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm flex-1">
            ปี (พ.ศ.)
            <input type="number" value={calendarType === "be" ? year + 543 : year} onChange={(e) => setYear(calendarType === "be" ? beToAd(parseInt(e.target.value) || 0) : parseInt(e.target.value) || 0)} className="rounded-md bg-white text-black px-2 py-1.5" />
          </label>
        </div>

        {/* --- กล่องเวลาเกิดที่แก้แล้ว + ไม่ทราบเวลาเกิด --- */}
        <div className="flex flex-col gap-2 border border-yellow-500/20 rounded-md p-3 bg-black/20 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">เวลาเกิด</span>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer text-yellow-400">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="rounded"
              />
              ไม่ทราบเวลาเกิด
            </label>
          </div>

          <div className={`flex gap-2 ${unknownTime ? "opacity-30 pointer-events-none" : ""}`}>
            <label className="flex flex-col gap-1 text-sm text-gray-300 flex-1">
              เวลาเกิด (ชั่วโมง)
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                disabled={unknownTime}
                className="rounded-md bg-white text-black px-2 py-1.5"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300 flex-1">
              นาทีเกิด
              <select
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                disabled={unknownTime}
                className="rounded-md bg-white text-black px-2 py-1.5"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {unknownTime && (
            <p className="text-[11px] text-gray-400">* จะคำนวณแบบ 3 เสาหลัก (ไม่รวมเสาชั่วโมง) ความแม่นยำ 75%</p>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          onClick={handleCalculate}
          className="mt-5 w-full sm:w-auto rounded-lg bg-[#f5e6c8] px-6 py-2.5 font-semibold text-black shadow-md"
        >
          คำนวณดวงชะตา
        </button>

        {/* --- Results --- */}
        {result && (
          <div ref={reportRef} className="mt-8 rounded-xl bg-black/60 border border-yellow-700/40 p-5 sm:p-6">
            <h2 className="font-serif text-lg sm:text-xl text-white mb-4 text-center">
              สี่เสาหลัก (Four Pillars) {result.isUnknownTime && "(3 เสา - ไม่ทราบเวลา)"}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <div className="border p-2 text-center">ปี: {result.year?.branch}</div>
              <div className="border p-2 text-center">เดือน: {result.month?.branch}</div>
              <div className="border p-2 text-center">วัน: {result.day?.branch}</div>
              <div className="border p-2 text-center">
                เวลา: {result.isUnknownTime ? "ไม่ทราบ" : result.hour?.branch}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

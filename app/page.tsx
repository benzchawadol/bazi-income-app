"use client";

import { useMemo, useRef, useState } from "react";
import { calculateBazi, BaziResult } from "@/lib/bazi";
import { buildCareerSummary, buildFinanceSummary } from "@/lib/summary";
import { adToBe, beToAd, daysInMonth, THAI_MONTHS } from "@/lib/thaiDate";
import PillarBox from "@/components/PillarBox";
import ElementsPieChart from "@/components/ElementsPieChart";
import DownloadPdfButton from "@/components/DownloadPdfButton";

type CalendarType = "be" | "ad";

const CURRENT_AD_YEAR = new Date().getFullYear();

export default function Home() {
  const [calendarType, setCalendarType] = useState<CalendarType>("be");
  const [year, setYear] = useState<number>(adToBe(1996));
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
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
      const r = calculateBazi({ year: adYear, month, day, hour, minute });
      setResult(r);
    } catch (e) {
      setError("เกิดข้อผิดพลาดในการคำนวณ กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }

  const career = result ? buildCareerSummary(result) : "";
  const finance = result ? buildFinanceSummary(result) : "";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
          ดวงป้าจื้อ (八字) สี่เสาชะตา และธาตุทั้งห้า
        </h1>
        <p className="mt-2 text-sm text-parchment-200/80">
          กรอกวันเวลาเกิด เพื่อคำนวณปี เดือน วัน ชั่วโมงเกิดตามหลักปาจื้อ พร้อมสัดส่วนธาตุทั้งห้า
          และคำทำนายด้านอาชีพการงาน-การเงินโดยย่อ
        </p>
      </header>

      {/* --- Form --- */}
      <section className="rounded-xl border border-parchment-700/40 bg-parchment-900/40 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-parchment-200">ระบบปีที่ใช้กรอก:</span>
          <div className="inline-flex rounded-lg border border-parchment-600/50 overflow-hidden text-sm">
            <button
              className={`px-3 py-1.5 ${calendarType === "be" ? "bg-parchment-500 text-ink" : "bg-transparent text-parchment-200"}`}
              onClick={() => {
                setYear((y) => (calendarType === "ad" ? adToBe(y) : y));
                setCalendarType("be");
              }}
            >
              พ.ศ.
            </button>
            <button
              className={`px-3 py-1.5 ${calendarType === "ad" ? "bg-parchment-500 text-ink" : "bg-transparent text-parchment-200"}`}
              onClick={() => {
                setYear((y) => (calendarType === "be" ? beToAd(y) : y));
                setCalendarType("ad");
              }}
            >
              ค.ศ.
            </button>
          </div>
          {calendarType === "be" && (
            <span className="text-xs text-parchment-300/70">
              (= ค.ศ. {beToAd(year) || "-"})
            </span>
          )}
          {calendarType === "ad" && (
            <span className="text-xs text-parchment-300/70">
              (= พ.ศ. {adToBe(year) || "-"})
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="flex flex-col gap-1 text-sm text-parchment-200">
            ปี ({calendarType === "be" ? "พ.ศ." : "ค.ศ."})
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value || "0", 10))}
              className="rounded-md bg-parchment-50 text-ink px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-parchment-200">
            เดือน
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="rounded-md bg-parchment-50 text-ink px-2 py-1.5"
            >
              {THAI_MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-parchment-200">
            วัน
            <select
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value, 10))}
              className="rounded-md bg-parchment-50 text-ink px-2 py-1.5"
            >
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <label className="flex flex-col gap-1 text-sm text-parchment-200 flex-1">
              ชั่วโมง
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                className="rounded-md bg-parchment-50 text-ink px-2 py-1.5"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-parchment-200 flex-1">
              นาที
              <select
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                className="rounded-md bg-parchment-50 text-ink px-2 py-1.5"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          onClick={handleCalculate}
          className="mt-5 w-full sm:w-auto rounded-lg bg-parchment-500 px-6 py-2.5 font-semibold text-ink shadow-md transition hover:bg-parchment-400"
        >
          คำนวณดวงชะตา
        </button>
      </section>

      {/* --- Results --- */}
      {result && (
        <>
          <div ref={reportRef} className="mt-8 rounded-xl bg-ink/60 border border-parchment-700/40 p-5 sm:p-6">
            <h2 className="font-serif text-lg sm:text-xl text-parchment-100 mb-4 text-center">
              สี่เสาชะตา (Four Pillars)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <PillarBox pillar={result.year} />
              <PillarBox pillar={result.month} />
              <PillarBox pillar={result.day} />
              <PillarBox pillar={result.hour} />
            </div>
            {result.usedNextDayForZiHour && (
              <p className="mt-3 text-center text-xs text-parchment-300/70">
                * เวลาเกิด 23:00 น. ขึ้นไป นับเป็นชั่วโมงจื้อ (子) ของวันถัดไปตามหลักปาจื้อ
                จึงใช้วันที่ถัดไปในการคำนวณเสาวัน
              </p>
            )}

            <h2 className="font-serif text-lg sm:text-xl text-parchment-100 mt-8 mb-2 text-center">
              สัดส่วนธาตุทั้งห้า (Five Elements)
            </h2>
            <ElementsPieChart percent={result.elementPercent} />

            <h2 className="font-serif text-lg sm:text-xl text-parchment-100 mt-8 mb-3 text-center">
              สรุปดวงชะตาโดยย่อ
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-parchment-900/50 border border-parchment-700/40 p-4">
                <h3 className="font-semibold text-parchment-100 mb-2">การงาน / อาชีพ</h3>
                <p className="text-sm leading-relaxed text-parchment-200">{career}</p>
              </div>
              <div className="rounded-lg bg-parchment-900/50 border border-parchment-700/40 p-4">
                <h3 className="font-semibold text-parchment-100 mb-2">การเงิน / โชคลาภ</h3>
                <p className="text-sm leading-relaxed text-parchment-200">{finance}</p>
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-parchment-300/60">
              ผลลัพธ์นี้จัดทำขึ้นเพื่อความบันเทิงเท่านั้น (For Entertainment Purposes Only)
              ไม่สามารถใช้ทดแทนคำปรึกษาจากผู้เชี่ยวชาญด้านโหราศาสตร์จีน การแพทย์ กฎหมาย
              หรือการเงินโดยตรง กรุณาใช้วิจารณญาณประกอบการตัดสินใจ
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <DownloadPdfButton targetRef={reportRef} fileName="bazi-report" />
          </div>
        </>
      )}

      <footer className="mt-12 text-center text-[11px] text-parchment-400/60 leading-relaxed">
        เครื่องมือนี้ใช้การประมาณค่าวันเปลี่ยนเดือนตามปฏิทินสุริยคติจีน (24 solar terms)
        ด้วยวันที่เฉลี่ย ซึ่งอาจคลาดเคลื่อนได้ประมาณ ±1 วันในบางปี
        <br />
        เนื้อหาทั้งหมดจัดทำขึ้นเพื่อความบันเทิงเท่านั้น (Entertainment purposes only)
      </footer>
    </main>
  );
}

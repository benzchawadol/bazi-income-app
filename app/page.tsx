"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

const beToAd = (be:number)=>be-543;
const daysInMonth = (y:number,m:number)=>new Date(y,m,0).getDate();

const zodiacData: any = {
  "子": { th: "ชวด/หนู", emoji: "🐀", color: "#60a5fa", img: "/bazi/rat.webp" },
  "丑": { th: "ฉลู/วัว", emoji: "🐂", color: "#eab308", img: "/bazi/ox.webp" },
  "寅": { th: "ขาล/เสือ", emoji: "🐅", color: "#22c55e", img: "/bazi/tiger.webp" },
  "卯": { th: "เถาะ/กระต่าย", emoji: "🐰", color: "#22c55e", img: "/bazi/rabbit.webp" },
  "辰": { th: "มะโรง/มังกร", emoji: "🐉", color: "#eab308", img: "/bazi/dragon.webp" },
  "巳": { th: "มะเส็ง/งู", emoji: "🐍", color: "#ef4444", img: "/bazi/snake.webp" },
  "午": { th: "มะเมีย/ม้า", emoji: "🐴", color: "#ef4444", img: "/bazi/horse.webp" },
  "未": { th: "มะแม/แพะ", emoji: "🐐", color: "#eab308", img: "/bazi/goat.webp" },
  "申": { th: "วอก/ลิง", emoji: "🐒", color: "#e5e7eb", img: "/bazi/monkey.webp" },
  "酉": { th: "ระกา/ไก่", emoji: "🐓", color: "#e5e7eb", img: "/bazi/rooster.webp" },
  "戌": { th: "จอ/สุนัข", emoji: "🐕", color: "#eab308", img: "/bazi/dog.webp" },
  "亥": { th: "กุน/หมู", emoji: "🐖", color: "#60a5fa", img: "/bazi/pig.webp" },
};

export default function Home() {
  const [year,setYear]=useState(beToAd(2530));
  const [month,setMonth]=useState(4); const [day,setDay]=useState(5);
  const [hour,setHour]=useState(4); const [unknownTime,setUnknownTime]=useState(false);
  const [result,setResult]=useState<any>(null);
  const [isUnlocked,setIsUnlocked]=useState(false);
  const [showPayModal,setShowPayModal]=useState(false);
  const reportRef=useRef<HTMLDivElement>(null);
  const maxDay=useMemo(()=>daysInMonth(year,month),[year,month]);

  function handleCalculate(){
    try{
      const raw=calculateBaziReal({year,month,day,hour:unknownTime?12:hour,minute:0});
      setResult({...raw,isUnknownTime:unknownTime,displayHour:unknownTime?null:raw.hour});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth"}),200);
    }catch(e:any){alert(e.message);}
  }

  function handleUnlock(){
    setIsUnlocked(true);
    localStorage.setItem("bazi_paid","true");
    setShowPayModal(false);
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <link href="https://fonts.googleapis.com/css2?family=Chonburi&family=Noto+Serif+Thai:wght@400;600;700&family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`.font-chonburi{font-family:'Chonburi',cursive}.font-noto{font-family:'Noto Serif Thai',serif}.font-sarabun{font-family:'Sarabun',sans-serif}@media print{.no-print{display:none!important}}`}</style>
      <div className="fixed inset-0 pointer-events-none"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15),transparent_60%)]" /></div>
      <div className="relative max-w-[900px] mx-auto px-4 py-8 font-sarabun">
        <div className="text-center mb-8 no-print">
          <div className="inline-flex px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] tracking-[0.2em] text-yellow-200/60">FREEMIUM · ดูฟรี 4 เสา + ปลดล็อคลึก 199 บาท</div>
          <h1 className="mt-4 font-chonburi text-3xl sm:text-4xl text-[#f5e6c8]">คำนวณดวงจีน ปาจื้อ</h1>
          <p className="mt-2 text-xs text-white/30 font-noto">ครบ 12 นักษัตร · 60 กะจื้อ · ฟอนต์ไทยสวยพรีเมียม</p>
        </div>

        <div className="no-print rounded-[20px] bg-white/[0.04] border border-white/10 p-5 mb-8">
          <div className="grid grid-cols-3 gap-3">
            <select value={day} onChange={e=>setDay(+e.target.value)} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm"><>{Array.from({length:maxDay},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</></select>
            <select value={month} onChange={e=>setMonth(+e.target.value)} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm"><>{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}</></select>
            <input type="number" value={year+543} onChange={e=>setYear(beToAd(+e.target.value||0))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm" />
          </div>
          <div className="mt-3 flex gap-3">
            <select value={hour} disabled={unknownTime} onChange={e=>setHour(+e.target.value)} className="flex-1 rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm disabled:opacity-20"><>{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>)}</></select>
            <label className="flex items-center gap-2 text-xs text-yellow-300"><input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} /> ไม่ทราบเวลา</label>
          </div>
          <button onClick={handleCalculate} className="mt-4 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-3 font-noto">เปิดดวงชะตา · คำนวณบัดนี้</button>
        </div>

        {result && (
          <div ref={reportRef} className="space-y-8">
            <div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-6">
              <h2 className="font-chonburi text-center text-xl text-[#f5e6c8]">แผนผังสี่เสาหลัก · ดูฟรี</h2>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[result.year,result.month,result.day,result.displayHour].map((p:any,i:number)=>{
                  if(!p) return <div key={i} className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center"><div className="text-3xl">❓</div><div className="mt-2 font-bold text-yellow-300">ไม่ทราบ</div></div>;
                  const z=zodiacData[p.branchZh]||{th:p.branchZh,emoji:"✨",color:"#fff"};
                  return (
                    <div key={i} className="rounded-[20px] bg-[#0a0a0a] border border-white/10 p-4 text-center">
                      <div className="text-4xl">{z.emoji}</div>
                      <div className="mt-2 font-noto font-bold text-[#f5e6c8]">{p.stemZh}·{p.branchZh}</div>
                      <div className="text-[11px] text-white/60">{p.stemTh} {p.branchTh}</div>
                      <div className="mt-1 text-[10px] px-2 py-1 rounded-full bg-white/10 inline-block">{z.th}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-[24px] border border-yellow-500/20 overflow-hidden">
              {!isUnlocked && (
                <div className="absolute inset-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-[12px] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center text-2xl">🔒</div>
                  <h3 className="mt-4 font-chonburi text-xl text-[#f5e6c8]">ปลดล็อคดูดวงลึกแบบละเอียด</h3>
                  <p className="mt-2 text-sm text-white/60">ดูอาชีพเรียกทรัพย์ + สีทิศมงคล + คำทำนาย 3 ปี + PDF 60 ใบ</p>
                  <button onClick={()=>setShowPayModal(true)} className="mt-6 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold px-8 py-4">ปลดล็อค 199 บาท · ดูทันที</button>
                </div>
              )}
              <div className={`${!isUnlocked?"blur-[12px] pointer-events-none":""} bg-[#121212] p-6`}>
                <h3 className="font-chonburi text-lg text-[#f5e6c8]">รหัสลับความมั่งคั่ง · Wealth Code</h3>
                <p className="mt-3 text-sm text-white/70">ดวง {result.day?.stemTh} {result.day?.branchTh} เป็นดวงนักสร้าง เหมาะกับงานที่ปรึกษา ครีเอทีฟ</p>
                <button onClick={()=>window.print()} className="mt-4 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-3">📄 ดาวน์โหลด PDF สุดหรู</button>
              </div>
            </div>
          </div>
        )}

        {showPayModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-[360px] rounded-[20px] bg-[#1a1a1a] border border-yellow-500/20 p-6 text-center">
              <h3 className="font-chonburi text-xl text-[#f5e6c8]">สแกนจ่าย 199 บาท</h3>
              <div className="mt-4 mx-auto w-[200px] h-[200px] rounded-xl bg-white flex items-center justify-center text-black text-xs">QR Code 199 บาท<br/>ใส่ QR จริงตรงนี้</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={()=>setShowPayModal(false)} className="rounded-xl bg-white/10 py-3 text-sm">ยกเลิก</button>
                <button onClick={handleUnlock} className="rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-3 text-sm">ฉันจ่ายแล้ว</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

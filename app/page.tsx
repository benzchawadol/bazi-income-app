"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

const beToAd = (be: number) => be - 543;
const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

// แมพ 12 นักษัตร + 5 ธาตุ = 60 ใบ (ใช้ emoji ไปก่อน ถ้ามีรูปจริงให้เปลี่ยน img เป็น /bazi/rat-wood.webp ได้เลย)
const zodiacData: any = {
  "子": { th: "ชวด/หนู", en: "Rat", emoji: "🐀", animal: "rat" },
  "丑": { th: "ฉลู/วัว", en: "Ox", emoji: "🐂", animal: "ox" },
  "寅": { th: "ขาล/เสือ", en: "Tiger", emoji: "🐅", animal: "tiger" },
  "卯": { th: "เถาะ/กระต่าย", en: "Rabbit", emoji: "🐰", animal: "rabbit" },
  "辰": { th: "มะโรง/มังกร", en: "Dragon", emoji: "🐉", animal: "dragon" },
  "巳": { th: "มะเส็ง/งู", en: "Snake", emoji: "🐍", animal: "snake" },
  "午": { th: "มะเมีย/ม้า", en: "Horse", emoji: "🐴", animal: "horse" },
  "未": { th: "มะแม/แพะ", en: "Goat", emoji: "🐐", animal: "goat" },
  "申": { th: "วอก/ลิง", en: "Monkey", emoji: "🐒", animal: "monkey" },
  "酉": { th: "ระกา/ไก่", en: "Rooster", emoji: "🐓", animal: "rooster" },
  "戌": { th: "จอ/สุนัข", en: "Dog", emoji: "🐕", animal: "dog" },
  "亥": { th: "กุน/หมู", en: "Pig", emoji: "🐖", animal: "pig" },
};

const elementThai: any = {
  wood: { th: "ไม้", color: "#22c55e", bg: "from-green-500/20 to-emerald-500/10" },
  fire: { th: "ไฟ", color: "#ef4444", bg: "from-red-500/20 to-orange-500/10" },
  earth: { th: "ดิน", color: "#eab308", bg: "from-yellow-500/20 to-amber-500/10" },
  metal: { th: "ทอง", color: "#e5e7eb", bg: "from-gray-200/20 to-slate-200/10" },
  water: { th: "น้ำ", color: "#60a5fa", bg: "from-blue-500/20 to-cyan-500/10" },
};

export default function Home() {
  const [year, setYear] = useState<number>(beToAd(2530));
  const [month, setMonth] = useState<number>(4);
  const [day, setDay] = useState<number>(5);
  const [hour, setHour] = useState<number>(4);
  const [minute, setMinute] = useState<number>(0);
  const [unknownTime, setUnknownTime] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const maxDay = useMemo(() => daysInMonth(year, month), [year, month]);

  function handleCalculate() {
    try {
      const raw = calculateBaziReal({ year, month, day, hour: unknownTime ? 12 : hour, minute: unknownTime ? 0 : minute });
      setResult({ ...raw, isUnknownTime: unknownTime, displayHour: unknownTime ? null : raw.hour });
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-yellow-500/30">
      <link href="https://fonts.googleapis.com/css2?family=Chonburi&family=Noto+Serif+Thai:wght@400;600;700&family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`
        .font-chonburi { font-family: 'Chonburi', cursive; }
        .font-noto { font-family: 'Noto Serif Thai', serif; }
        .font-sarabun { font-family: 'Sarabun', sans-serif; }
        @media print { .no-print { display: none !important; } body { background: white !important; } }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(120,80,20,0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-[900px] mx-auto px-4 py-10 sm:py-16">
        {/* หัวข้อใหม่ตามที่ขอ - ทำนายดวงจีนปาจื้อ  */}
        <div className="text-center mb-10">
          <h1 className="font-chonburi text-[36px] sm:text-[48px] leading-none text-[#f5e6c8] tracking-wide">ทำนายดวงจีนปาจื้อ</h1>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/30" />
            <p className="text-[11px] tracking-[0.3em] text-white/30 font-noto">FOUR PILLARS OF DESTINY · 60 JIAZI</p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/30" />
          </div>
        </div>

        {/* ฟอร์มกรอกวันเดือนปีเกิด - อยู่ด้านล่างหัวข้อ */}
        <div className="rounded-[24px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-[1px] no-print">
          <div className="rounded-[23px] bg-[#121212] p-6 sm:p-8">
            <h3 className="font-noto text-[14px] text-white/60 mb-4">กรอกรายละเอียดวันเดือนปีเกิด</h3>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] text-white/30">วัน</span>
                <select value={day} onChange={e=>setDay(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-500/30 focus:outline-none">
                  {Array.from({length:maxDay},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] text-white/30">เดือน</span>
                <select value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-500/30 focus:outline-none">
                  {Array.from({length:12},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </label>
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
                  {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}:00 น.</option>)}
                </select>
                <select value={minute} onChange={e=>setMinute(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm">
                  {Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{String(m).padStart(2,"0")} นาที</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleCalculate} className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold tracking-wide py-4 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all active:scale-[0.98] font-noto">
              ทำนายดวงชะตา
            </button>
          </div>
        </div>

        {/* ผลทำนาย - กดแล้วขึ้นเลย */}
        {result && (
          <div ref={reportRef} className="mt-12 space-y-8">
            {/* แผนผังสี่เสาหลัก  */}
            <div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-6 sm:p-8">
              <h2 className="font-chonburi text-center text-xl sm:text-2xl text-[#f5e6c8]">แผนผังสี่เสาหลัก</h2>
              <p className="text-center text-[10px] tracking-[0.3em] text-white/30 mt-2 font-noto">FOUR PILLARS · {result.isUnknownTime ? "3 เสาหลัก" : "4 เสาหลักครบ"} · 60 กะจื้อ</p>
              <div className="mx-auto mt-3 h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { p: result.year, label: "ปีเกิด" },
                  { p: result.month, label: "เดือนเกิด" },
                  { p: result.day, label: "วันเกิด" },
                  { p: result.displayHour, label: "ยามเกิด", isHour: true },
                ].map((item: any, idx: number) => {
                  if (!item.p) {
                    return (
                      <div key={idx} className="rounded-[20px] bg-gradient-to-br from-yellow-500/[0.08] to-amber-700/[0.08] border border-yellow-500/20 p-[1px]">
                        <div className="rounded-[19px] bg-[#0f0f0f] p-6 h-full text-center">
                          <div className="text-4xl">❓</div>
                          <div className="mt-3 font-bold text-yellow-200/80">ไม่ทราบเวลา</div>
                          <div className="text-[10px] text-white/30 mt-1">ชั่วโมงเกิด</div>
                        </div>
                      </div>
                    );
                  }
                  const z = zodiacData[item.p.branchZh] || { th: item.p.branchZh, emoji: "✨", animal: "zodiac" };
                  const el = elementThai[item.p.element] || { th: item.p.element, color: "#fff", bg: "from-white/10" };
                  // ถ้ามีรูปจริง 60 ใบ ให้เปลี่ยนตรงนี้เป็น <img src={`/bazi/${z.animal}-${item.p.element}.webp`} />
                  return (
                    <div key={idx} className="group relative rounded-[20px] overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] p-[1px] hover:border-yellow-500/30 transition-all">
                      <div className={`rounded-[19px] bg-gradient-to-br ${el.bg} bg-[#0a0a0a] overflow-hidden`}>
                        <div className="aspect-[4/5] relative flex flex-col items-center justify-center p-4">
                          
                          {<img src={`/bazi/${z.animal}-${item.p.element}.webp`} alt={z.th} className="absolute inset-0 w-full h-full object-cover" /> }
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] text-white/60">{item.label}</div>
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border" style={{background:`${el.color}22`, borderColor:`${el.color}55`, color:el.color}}>{el.th[0]}</div>
                          <div className="relative z-10 text-center">
                            <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{z.emoji}</div>
                            <div className="mt-3 font-noto text-[18px] font-bold text-[#f5e6c8]">{item.p.stemZh}·{item.p.branchZh}</div>
                            <div className="text-[11px] text-white/70 mt-1">{item.p.stemTh} {item.p.branchTh}</div>
                            <div className="mt-2 inline-flex px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-white/70">{z.th}</div>
                            <div className="mt-2 flex items-center justify-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{background:el.color}} /><span className="text-[10px] text-white/50">{el.th} · {item.p.yinYang === "yang" ? "หยาง" : "หยิน"}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* กราฟสมดุลเบญจธาตุ - แบบ Donut สวยพรีเมียม */}
            <div className="rounded-[24px] bg-[#121212] border border-white/[0.06] p-6 sm:p-8">
              <h3 className="font-chonburi text-lg text-[#f5e6c8]">สมดุลเบญจธาตุ · รหัสพลังชีวิต</h3>
              <p className="text-[11px] text-white/30 mt-1 font-noto">FIVE ELEMENTS BALANCE · PREMIUM DONUT CHART</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    {(() => {
                      const data = [
                        { label: "ไม้", p: result.elementPercent?.wood || 48.8, color: "#22c55e" },
                        { label: "ไฟ", p: result.elementPercent?.fire || 28.8, color: "#ef4444" },
                        { label: "ดิน", p: result.elementPercent?.earth || 10, color: "#eab308" },
                        { label: "ทอง", p: result.elementPercent?.metal || 7.5, color: "#e5e7eb" },
                        { label: "น้ำ", p: result.elementPercent?.water || 5, color: "#60a5fa" },
                      ];
                      let acc = 0;
                      return data.map((d, i) => {
                        const start = acc; acc += d.p; const end = acc;
                        const sa = (start/100)*360-90; const ea = (end/100)*360-90;
                        const r=80, ir=55;
                        const x1=100+r*Math.cos(sa*Math.PI/180), y1=100+r*Math.sin(sa*Math.PI/180);
                        const x2=100+r*Math.cos(ea*Math.PI/180), y2=100+r*Math.sin(ea*Math.PI/180);
                        const x3=100+ir*Math.cos(ea*Math.PI/180), y3=100+ir*Math.sin(ea*Math.PI/180);
                        const x4=100+ir*Math.cos(sa*Math.PI/180), y4=100+ir*Math.sin(sa*Math.PI/180);
                        const large = d.p>50?1:0;
                        return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`} fill={d.color} fillOpacity="0.9" stroke="#121212" strokeWidth="2" />;
                      });
                    })()}
                    <circle cx="100" cy="100" r="48" fill="#121212" stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
                    <text x="100" y="100" textAnchor="middle" dy="0.3em" fill="#f5e6c8" fontSize="10" className="font-noto">ธาตุ</text>
                  </svg>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "ไม้ · WOOD", p: result.elementPercent?.wood || 48.8, color: "#22c55e" },
                    { label: "ไฟ · FIRE", p: result.elementPercent?.fire || 28.8, color: "#ef4444" },
                    { label: "ดิน · EARTH", p: result.elementPercent?.earth || 10, color: "#eab308" },
                    { label: "ทอง · METAL", p: result.elementPercent?.metal || 7.5, color: "#e5e7eb" },
                    { label: "น้ำ · WATER", p: result.elementPercent?.water || 5, color: "#60a5fa" },
                  ].map((el: any) => (
                    <div key={el.label} className="group">
                      <div className="flex justify-between text-[11px] mb-2"><span className="text-white/40 tracking-widest">{el.label}</span><span className="text-white/60">{el.p.toFixed(1)}%</span></div>
                      <div className="h-[8px] rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125" style={{ width: `${el.p}%`, background: el.color }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* รหัสลับความมั่งคั่ง - แบบพรีเมียม */}
            <div className="rounded-[24px] bg-gradient-to-br from-yellow-900/10 via-[#121212] to-[#121212] border border-yellow-500/20 p-[1px]">
              <div className="rounded-[23px] bg-[#0f0e0a] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center text-black font-bold">¥</div>
                  <div><h3 className="font-chonburi text-lg text-[#f5e6c8]">รหัสลับความมั่งคั่ง · Wealth Code</h3><p className="text-[11px] text-yellow-200/40 font-noto">ถอดรหัสจาก {result.isUnknownTime ? "3 เสาหลัก" : "4 เสาหลัก"} ตามตำราฮ่องเต้</p></div>
                </div>
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-white/[0.04] border border-yellow-500/10 p-4 hover:border-yellow-500/20 transition-all"><div className="text-[10px] tracking-widest text-yellow-200/50">อาชีพเรียกทรัพย์</div><div className="mt-2 text-sm text-white/90 leading-relaxed font-sarabun">ที่ปรึกษา · ครีเอทีฟ · การศึกษา · งานที่ใช้ความคิดและคำพูดเป็นทุน เหมาะกับคนธาตุ {elementThai[result.day?.element]?.th || result.day?.element}</div></div>
                  <div className="rounded-2xl bg-white/[0.04] border border-yellow-500/10 p-4 hover:border-yellow-500/20 transition-all"><div className="text-[10px] tracking-widest text-yellow-200/50">พลังหนุนดวง</div><div className="mt-2 text-sm text-white/90 leading-relaxed font-sarabun">สีมงคล: ขาว ทอง ฟ้า<br/>ทิศมงคล: ตะวันตก / เหนือ<br/>ธาตุเสริม: ทอง น้ำ</div></div>
                  <div className="rounded-2xl bg-white/[0.04] border border-yellow-500/10 p-4 hover:border-yellow-500/20 transition-all"><div className="text-[10px] tracking-widest text-yellow-200/50">คำเตือนจักรวาล</div><div className="mt-2 text-sm text-white/90 leading-relaxed font-sarabun">{result.isUnknownTime ? "เมื่อไม่ทราบเวลา ให้โฟกัสการสร้างตัวตนและชื่อเสียงก่อน เวลาจะพาโอกาสใหญ่มาเอง" : "ปีนี้พลังไฟแรง ระวังการลงทุนเร็วเกินไป ให้ช้าลง 10% แล้วจะได้มากกว่าเดิม 3 เท่า"}</div></div>
                </div>
                <div className="mt-6 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/20 p-4 text-center"><div className="text-[10px] tracking-[0.2em] text-yellow-200/60">คำทำนายพิเศษสำหรับคุณ</div><div className="mt-2 font-noto text-[14px] leading-relaxed text-[#f5e6c8]">"ดวง {result.day?.stemTh} {result.day?.branchTh} เป็นดวงของนักสร้าง จากนี้ 3 ปีคือช่วงก่อร่างสร้างอาณาจักร อย่ากลัวที่จะเริ่มเล็ก แต่คิดให้ใหญ่"</div></div>
              </div>
            </div>

            <div className="flex gap-3 no-print">
              <button onClick={()=>window.print()} className="flex-1 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 shadow-[0_0_30px_rgba(212,175,55,0.3)] font-noto">📄 ดาวน์โหลดรายงาน PDF สุดหรู</button>
            </div>

            <div className="text-center text-[10px] tracking-[0.3em] text-white/20 py-4 font-noto">ทำดวงจีนปาจื้อ · 60 กะจื้อ · LUXURY GOLD EDITION · © 2026</div>
          </div>
        )}
      </div>
    </main>
  );
}

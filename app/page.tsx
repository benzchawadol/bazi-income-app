"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

const beToAd = (be:number)=>be-543;
const daysInMonth = (y:number,m:number)=>new Date(y,m,0).getDate();

const zodiacData: any = {
  "子": { th: "ชวด/หนู", animal: "rat" },
  "丑": { th: "ฉลู/วัว", animal: "ox" },
  "寅": { th: "ขาล/เสือ", animal: "tiger" },
  "卯": { th: "เถาะ/กระต่าย", animal: "rabbit" },
  "辰": { th: "มะโรง/มังกร", animal: "dragon" },
  "巳": { th: "มะเส็ง/งู", animal: "snake" },
  "午": { th: "มะเมีย/ม้า", animal: "horse" },
  "未": { th: "มะแม/แพะ", animal: "goat" },
  "申": { th: "วอก/ลิง", animal: "monkey" },
  "酉": { th: "ระกา/ไก่", animal: "rooster" },
  "戌": { th: "จอ/สุนัข", animal: "dog" },
  "亥": { th: "กุน/หมู", animal: "pig" },
};

const elementThai: any = {
  wood: { th: "ไม้", color: "#22c55e" },
  fire: { th: "ไฟ", color: "#ef4444" },
  earth: { th: "ดิน", color: "#eab308" },
  metal: { th: "ทอง", color: "#d4af37" },
  water: { th: "น้ำ", color: "#60a5fa" },
};

export default function Home(){
  const [year,setYear]=useState(beToAd(2530));
  const [month,setMonth]=useState(4);
  const [day,setDay]=useState(5);
  const [hour,setHour]=useState(4);
  const [unknownTime,setUnknownTime]=useState(false);
  const [result,setResult]=useState<any>(null);
  const reportRef=useRef<HTMLDivElement>(null);
  const pdfRef=useRef<HTMLDivElement>(null);
  const maxDay=useMemo(()=>daysInMonth(year,month),[year,month]);

  function handleCalculate(){
    try{
      const raw=calculateBaziReal({year,month,day,hour:unknownTime?12:hour,minute:0});
      setResult({...raw,isUnknownTime:unknownTime,displayHour:unknownTime?null:raw.hour});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth"}),300);
    }catch(e:any){alert(e.message);}
  }

  async function handleDownloadPDF(){
    if(!pdfRef.current) return;
    // ใช้วิธีเปิดหน้าพิมพ์แบบหรู แก้ปัญหาพื้นหลังขาว
    const printContent = pdfRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if(!printWindow) { alert("กรุณาอนุญาตให้เปิดหน้าต่างป๊อปอัพครับ"); return; }
    printWindow.document.write(`
      <html>
      <head>
        <title>ดวงจีนปาจื้อ - ${result?.day?.stemTh} ${result?.day?.branchTh}</title>
        <link href="https://fonts.googleapis.com/css2?family=Chonburi&family=Noto+Serif+Thai:wght@400;600&family=Sarabun:wght@300;400&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin:0; background:#f5f1e8; font-family:'Noto Serif Thai',serif; }
        </style>
      </head>
      <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(()=>{ printWindow.focus(); printWindow.print(); }, 500);
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <link href="https://fonts.googleapis.com/css2?family=Chonburi&family=Noto+Serif+Thai:wght@400;600;700&family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`
        .font-chonburi{font-family:'Chonburi',cursive}
        .font-noto{font-family:'Noto Serif Thai',serif}
        .font-sarabun{font-family:'Sarabun',sans-serif}
        @media print {
          body * { visibility: hidden; }
          #pdf-luxury, #pdf-luxury * { visibility: visible; }
          #pdf-luxury { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display:none !important; }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15),transparent_60%)]" /></div>
      <div className="relative max-w-[900px] mx-auto px-4 py-10">
        <div className="text-center mb-10 no-print">
          <h1 className="font-chonburi text-[36px] sm:text-[48px] text-[#f5e6c8]">ทำดวงจีนปาจื้อ</h1>
          <p className="text-[11px] tracking-[0.3em] text-white/30 font-noto mt-2">FOUR PILLARS · 60 JIAZI · LUXURY GOLD</p>
        </div>

        <div className="rounded-[24px] bg-white/[0.06] border border-white/[0.08] p-[1px] no-print">
          <div className="rounded-[23px] bg-[#121212] p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-3">
              <select value={day} onChange={e=>setDay(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm"><>{Array.from({length:maxDay},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}</></select>
              <select value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm"><>{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}</></select>
              <input type="number" value={year+543} onChange={e=>setYear(beToAd(parseInt(e.target.value)||0))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm" />
            </div>
            <div className="mt-4 flex gap-3">
              <select value={hour} disabled={unknownTime} onChange={e=>setHour(parseInt(e.target.value))} className="flex-1 rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm disabled:opacity-20"><>{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}:00 น.</option>)}</></select>
              <label className="flex items-center gap-2 text-xs text-yellow-300"><input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} />ไม่ทราบเวลา</label>
            </div>
            <button onClick={handleCalculate} className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 font-noto">ทำนายดวงชะตา</button>
          </div>
        </div>

        {result && (
          <div ref={reportRef} className="mt-12 space-y-8 no-print">
            {/* แก้ปัญหา 1: การ์ดไม่ให้ตัวหนังสือทับ - โชว์รูป 60 ใบเต็มๆ ไม่ทับ */}
            <div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-6 sm:p-8">
              <h2 className="font-chonburi text-center text-xl text-[#f5e6c8]">แผนผังสี่เสาหลัก</h2>
              <p className="text-center text-[10px] tracking-[0.3em] text-white/30 mt-2">FOUR PILLARS · 60 กะจื้อ Luxury Gold · ไม่ทับกันแล้ว</p>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { p: result.year, label: "ปีเกิด Year" },
                  { p: result.month, label: "เดือนเกิด Month" },
                  { p: result.day, label: "วันเกิด Day" },
                  { p: result.displayHour, label: "ยามเกิด Hour" },
                ].map((item:any,i:number)=>{
                  if(!item.p) return <div key={i} className="rounded-[16px] bg-yellow-500/10 border border-yellow-500/20 p-8 text-center"><div className="text-3xl">❓</div><div className="mt-2 text-yellow-300 text-sm">ไม่ทราบเวลา</div></div>;
                  const z=zodiacData[item.p.branchZh]||{th:item.p.branchZh,animal:"zodiac"};
                  return (
                    <div key={i} className="group">
                      <div className="text-[10px] text-center text-white/40 mb-2 tracking-widest">{item.label}</div>
                      <div className="rounded-[16px] overflow-hidden border border-yellow-500/20 bg-[#0a0a0a] aspect-[3/4] relative shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all">
                        {/* รูป 60 ใบเต็มใบ ไม่ให้ตัวหนังสือทับ */}
                        <img src={`/bazi/${z.animal}-${item.p.element}.webp`} alt={z.th} className="w-full h-full object-cover" onError={(e:any)=>{e.currentTarget.src=`https://placehold.co/300x400/121212/f5e6c8?text=${item.p.stemZh}${item.p.branchZh}`}} />
                      </div>
                      <div className="mt-2 text-center"><div className="text-[11px] text-[#f5e6c8] font-noto">{item.p.stemTh} {item.p.branchTh}</div><div className="text-[10px] text-white/40">{elementThai[item.p.element]?.th} · {item.p.yinYang==="yang"?"หยาง":"หยิน"}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#121212] border border-white/[0.06] p-6 sm:p-8">
              <h3 className="font-chonburi text-lg text-[#f5e6c8]">สมดุลเบญจธาตุ</h3>
              <div className="mt-6 flex justify-center"><svg width="180" height="180" viewBox="0 0 200 200">{(() => { const data = [{p:result.elementPercent?.wood||48.8,c:"#22c55e"},{p:result.elementPercent?.fire||28.8,c:"#ef4444"},{p:result.elementPercent?.earth||10,c:"#eab308"},{p:result.elementPercent?.metal||7.5,c:"#e5e7eb"},{p:result.elementPercent?.water||5,c:"#60a5fa"}]; let acc=0; return data.map((d,i)=>{const s=acc;acc+=d.p;const e=acc;const sa=(s/100)*360-90,ea=(e/100)*360-90;const r=80,ir=55;const x1=100+r*Math.cos(sa*Math.PI/180),y1=100+r*Math.sin(sa*Math.PI/180);const x2=100+r*Math.cos(ea*Math.PI/180),y2=100+r*Math.sin(ea*Math.PI/180);const x3=100+ir*Math.cos(ea*Math.PI/180),y3=100+ir*Math.sin(ea*Math.PI/180);const x4=100+ir*Math.cos(sa*Math.PI/180),y4=100+ir*Math.sin(sa*Math.PI/180);return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${d.p>50?1:0} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${d.p>50?1:0} 0 ${x4} ${y4} Z`} fill={d.c} stroke="#121212" strokeWidth="2"/>})})()}<circle cx="100" cy="100" r="48" fill="#121212" stroke="rgba(212,175,55,0.3)" /></svg></div>
            </div>

            <div className="rounded-[24px] bg-[#0f0e0a] border border-yellow-500/20 p-6">
              <h3 className="font-chonburi text-lg text-[#f5e6c8]">รหัสลับความมั่งคั่ง</h3>
              <p className="mt-2 text-sm text-white/70">ดวง {result.day?.stemTh} {result.day?.branchTh} ธาตุ {elementThai[result.day?.element]?.th} เหมาะกับงานที่ปรึกษา ครีเอทีฟ การศึกษา</p>
            </div>

            {/* ปุ่ม PDF แบบใหม่ แก้ปัญหา 2 */}
            <button onClick={handleDownloadPDF} className="w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 shadow-[0_0_30px_rgba(212,175,55,0.3)] font-noto">📄 ดาวน์โหลดรายงาน PDF สุดหรู แบบรูปที่ 3</button>
          </div>
        )}

        {/* ซ่อนไว้สำหรับพิมพ์ PDF แบบหรู - แก้ปัญหา 2 และ 3 - แบบรูปที่ 3 ที่คุณชอบ */}
        {result && (
          <div id="pdf-luxury" ref={pdfRef} className="mt-20 bg-[#f5f1e8] text-[#2c2416] p-8 sm:p-12 rounded-[4px] border-[12px] border-[#d4af37] relative overflow-hidden" style={{fontFamily:"'Noto Serif Thai', serif"}}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage:"url('https://www.transparenttextures.com/patterns/old-paper.png')"}} />
            <div className="relative">
              <div className="text-center border-b-2 border-[#d4af37] pb-6">
                <h1 className="font-chonburi text-3xl text-[#8b5a00]">八字四柱命盤</h1>
                <p className="text-sm mt-2 text-[#8b5a00]/70">Chinese BaZi Four Pillars Chart — {year}-{month}-{day} {hour}:00 ({result.isUnknownTime?"ไม่ทราบเวลา":`ยาม ${result.displayHour?.branchTh}`})</p>
                <div className="mt-2 text-xs text-[#8b5a00]/50">ทำดวงจีนปาจื้อ · 60 กะจื้อ · Luxury Gold Edition</div>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-4">
                {[
                  { p: result.displayHour, title: "時柱", sub: "Hour Pillar", label: "ยามเกิด" },
                  { p: result.day, title: "日柱", sub: "Day Pillar", label: "วันเกิด (ดิถี)" },
                  { p: result.month, title: "月柱", sub: "Month Pillar", label: "เดือนเกิด" },
                  { p: result.year, title: "年柱", sub: "Year Pillar", label: "ปีเกิด" },
                ].map((col:any, idx:number)=>{
                  if(!col.p) return <div key={idx} className="border-2 border-[#d4af37]/30 p-4 text-center bg-white/50"><div className="text-[#8b5a00]/40">ไม่ทราบเวลา</div></div>;
                  const z=zodiacData[col.p.branchZh];
                  return (
                    <div key={idx} className="border-2 border-[#d4af37] bg-[#fffaf0] p-4 text-center relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
                      <div className="text-[12px] tracking-widest text-[#8b5a00] bg-[#d4af37]/20 inline-block px-2 py-1 rounded">{col.title}</div>
                      <div className="text-[10px] text-[#8b5a00]/60 mt-1">{col.sub}</div>
                      <div className="mt-4 text-4xl font-bold text-[#8b0000]">{col.p.stemZh}{col.p.branchZh}</div>
                      <div className="mt-2 text-xs text-[#2c2416]">{z?.th} | {col.p.element}</div>
                      <div className="mt-3 text-[10px] leading-relaxed text-[#2c2416]/70">
                        天干: {col.p.stemTh} ({col.p.element})<br/>地支: {col.p.branchTh}<br/>{col.label}
                      </div>
                      <div className="mt-3 w-full h-[60px] rounded overflow-hidden border border-[#d4af37]/20">
                        <img src={`/bazi/${z?.animal}-${col.p.element}.webp`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-lg text-[#8b5a00] tracking-[0.2em]">五行強弱平衡 · Five Elements Balance</h3>
                <div className="mt-4 grid grid-cols-5 gap-2 text-[11px]">
                  {[
                    {k:"wood",label:"木 Wood",c:"#2d5016",p:result.elementPercent?.wood||48.8},
                    {k:"fire",label:"火 Fire",c:"#8b0000",p:result.elementPercent?.fire||28.8},
                    {k:"earth",label:"土 Earth",c:"#8b5a00",p:result.elementPercent?.earth||10},
                    {k:"metal",label:"金 Metal",c:"#555",p:result.elementPercent?.metal||7.5},
                    {k:"water",label:"水 Water",c:"#0a3d62",p:result.elementPercent?.water||5},
                  ].map((el:any)=>(
                    <div key={el.k} className="text-center">
                      <div className="font-bold" style={{color:el.c}}>{el.label}</div>
                      <div className="mt-2 h-2 bg-black/10 rounded overflow-hidden"><div className="h-full" style={{width:`${el.p}%`,background:el.c}} /></div>
                      <div className="mt-1 text-[10px]">{el.p.toFixed(1)}% {el.p>30?"Strong":el.p>10?"Moderate":"Weak"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-2 border-[#d4af37]/30 bg-[#fffaf0]/80 p-4">
                <h4 className="text-center text-[#8b5a00] font-bold">命理分析 Summary</h4>
                <div className="mt-2 text-[11px] leading-relaxed text-[#2c2416]">
                  • 日主為{result.day?.stemTh} ({result.day?.element}) · เกิด {year}-{month}-{day} {hour}:00<br/>
                  • 五行以{elementThai[result.day?.element]?.th}為主 · ธาตุ {elementThai[result.day?.element]?.th} เด่น {result.elementPercent?.[result.day?.element]?.toFixed(1)}%<br/>
                  • ลักษณะ: {result.day?.element==="wood"?"เจริญเติบโต มีความคิดสร้างสรรค์":result.day?.element==="fire"?"ร้อนแรง มีชื่อเสียง โดดเด่น":result.day?.element==="earth"?"มั่นคง หนักแน่น น่าเชื่อถือ":result.day?.element==="metal"?"เด็ดขาด กล้าหาญ มีวินัย":"สติปัญญา ลุ่มลึก ปรับตัวเก่ง"}<br/>
                  • คำแนะนำ: ใช้สี {result.day?.element==="wood"?"เขียว น้ำตาล":result.day?.element==="fire"?"แดง ม่วง":result.day?.element==="earth"?"เหลือง น้ำตาล":result.day?.element==="metal"?"ขาว ทอง":"ฟ้า น้ำเงิน"} เสริมดวง ทิศมงคล {result.day?.element==="wood"?"ตะวันออก":result.day?.element==="fire"?"ใต้":result.day?.element==="earth"?"กลาง":"ตะวันตก"}<br/>
                </div>
              </div>

              <div className="mt-6 text-center text-[10px] text-[#8b5a00]/50">出生資訊: {year}年{month}月{day}日 {hour}:00 · {result.day?.stemTh}{result.day?.branchTh} · ทำดวงจีนปาจื้อ · 60 กะจื้อ Luxury Gold · © 2026</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

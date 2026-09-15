"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

const beToAd = (be:number)=>be-543;
const daysInMonth = (y:number,m:number)=>new Date(y,m,0).getDate();

const zodiacData: any = {
  "子": { th: "ชวด/หนู", animal: "rat" }, "丑": { th: "ฉลู/วัว", animal: "ox" },
  "寅": { th: "ขาล/เสือ", animal: "tiger" }, "卯": { th: "เถาะ/กระต่าย", animal: "rabbit" },
  "辰": { th: "มะโรง/มังกร", animal: "dragon" }, "巳": { th: "มะเส็ง/งู", animal: "snake" },
  "午": { th: "มะเมีย/ม้า", animal: "horse" }, "未": { th: "มะแม/แพะ", animal: "goat" },
  "申": { th: "วอก/ลิง", animal: "monkey" }, "酉": { th: "ระกา/ไก่", animal: "rooster" },
  "戌": { th: "จอ/สุนัข", animal: "dog" }, "亥": { th: "กุน/หมู", animal: "pig" },
};

function calcLifePath(d:number,m:number,y:number){
  const sum = (n:number)=> n.toString().split('').reduce((a,b)=>a+parseInt(b),0);
  let total = d + m + y;
  while(total>9){ total = sum(total); }
  return total;
}

const lifePathMean: any = {
  1: "ผู้นำ กล้าลุย เริ่มธุรกิจเองได้",
  2: "นักประสาน เป็นที่ปรึกษา ทำงานเบื้องหลังแล้วรุ่ง",
  3: "นักสื่อสาร คอนเทนต์ ครีเอทีฟ พูดแล้วได้เงิน",
  4: "นักวางระบบ ระเบียบ บัญชี ก่อร่างสร้างตัวมั่นคง",
  5: "นักเดินทาง เปลี่ยนแปลงเร็ว งานอิสระ การตลาด",
  6: "นักดูแล งานบริการ ที่ปรึกษาครอบครัว",
  7: "นักวิเคราะห์ ชอบขุดลึก ความรู้เฉพาะทาง ที่ปรึกษา วางระบบ",
  8: "นักบริหารเงิน ธุรกิจใหญ่ การจัดการ",
  9: "นักให้ ผู้สอน งานที่ได้บุญแล้วได้เงิน",
};

export default function Home(){
  const [year,setYear]=useState(beToAd(''));
  const [month,setMonth]=useState('')
  const [day,setDay]=useState('');
  const [hour,setHour]=useState('');
  const [unknownTime,setUnknownTime]=useState(false);
  const [result,setResult]=useState<any>(null);
  const reportRef=useRef<HTMLDivElement>(null);
  const pdfRef=useRef<HTMLDivElement>(null);
  const maxDay = (year&&month) ? daysInMonth(Number(year), Number(month)) : 31;
  function handleCalculate(){
  if(!year||!month||!day){ alert("กรุณาเลือก วัน เดือน ปีเกิด ก่อนครับ"); return; }
  if(!unknownTime && !hour){ alert("กรุณาเลือกเวลาเกิด หรือติ๊ก ไม่ทราบเวลาเกิด ครับ"); return; }
  try{
  // ... โค้ดเดิม
    try{
      const raw=calculateBaziReal({year,month,day,hour:unknownTime?12:hour,minute:0});
      const lp = calcLifePath(day, month, year);
      setResult({...raw,isUnknownTime:unknownTime,displayHour:unknownTime?null:raw.hour, lifePath:lp});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth"}),300);
    }catch(e:any){alert(e.message);}
  }

  async function handleDownloadPDF(){
    if(!pdfRef.current) return;
    const printContent = pdfRef.current.innerHTML;
    const w = window.open('', '_blank');
    if(!w){ alert("กรุณาอนุญาตป๊อปอัพ"); return; }
    w.document.write(`<html><head><title>ดวงจีน ${result?.day?.stemTh}${result?.day?.branchTh}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;600&display=swap" rel="stylesheet"><style>@page{size:A4;margin:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{margin:0;background:#f5f1e8}</style></head><body>${printContent}</body></html>`);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();},500);
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <link href="https://fonts.googleapis.com/css2?family=Chonburi&family=Noto+Serif+Thai:wght@400;600;700&family=Sarabun:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`.font-chonburi{font-family:'Chonburi',cursive}.font-noto{font-family:'Noto Serif Thai',serif}.font-sarabun{font-family:'Sarabun',sans-serif}`}</style>
      <div className="fixed inset-0 pointer-events-none"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15),transparent_60%)]" /></div>
      <div className="relative max-w-[900px] mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="font-chonburi text-[36px] sm:text-[48px] text-[#f5e6c8]">ทำดวงจีนปาจื้อ</h1>
          <p className="text-[11px] tracking-[0.3em] text-white/30 mt-2">FOUR PILLARS · LIFE PATH · 60 JIAZI</p>
        </div>

        <div className="rounded-[24px] bg-white/[0.06] border border-white/[0.08] p-[1px]">
          <div className="rounded-[23px] bg-[#121212] p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-3">
              <select value={day} onChange={e=>setDay(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm">{Array.from({length:maxDay},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}</select>
              <select value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm">{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}</select>
              <input type="number" value={year+543} onChange={e=>setYear(beToAd(parseInt(e.target.value)||0))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm" />
            </div>
            <div className="mt-4 flex gap-3">
              <select value={hour} disabled={unknownTime} onChange={e=>setHour(parseInt(e.target.value))} className="flex-1 rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm disabled:opacity-20">{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}:00 น.</option>)}</select>
              <label className="flex items-center gap-2 text-xs text-yellow-300"><input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} />ไม่ทราบเวลา</label>
            </div>
            <button onClick={handleCalculate} className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 font-noto">ทำนายดวงชะตาแบบละเอียด</button>
          </div>
        </div>

        {result && (
          <div ref={reportRef} className="mt-12 space-y-8">
            {/* การ์ด 4 ใบ ไม่ทับ */}
            <div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-6 sm:p-8">
              <h2 className="font-chonburi text-center text-xl text-[#f5e6c8]">แผนผังสี่เสาหลัก</h2>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { p: result.year, label: "ปีเกิด Year" },
                  { p: result.month, label: "เดือนเกิด Month" },
                  { p: result.day, label: "วันเกิด Day" },
                  { p: result.displayHour, label: "ยามเกิด Hour" },
                ].map((item:any,i:number)=>{
                  if(!item.p) return <div key={i} className="rounded-[16px] bg-yellow-500/10 border border-yellow-500/20 p-8 text-center"><div className="text-2xl">❓</div><div className="mt-2 text-yellow-300 text-xs">ไม่ทราบเวลา</div></div>;
                  const z=zodiacData[item.p.branchZh];
                  return (
                    <div key={i} className="group">
                      <div className="text-[9px] text-center text-white/30 mb-2 tracking-widest">{item.label}</div>
                      <div className="rounded-[16px] overflow-hidden border border-yellow-500/20 aspect-[3/4] bg-[#0a0a0a]">
                        <img src={`/bazi/${z.animal}-${item.p.element}.webp`} alt={z.th} className="w-full h-full object-cover" onError={(e:any)=>e.currentTarget.style.display='none'} />
                      </div>
                      <div className="mt-2 text-center"><div className="text-[12px] text-[#f5e6c8] font-noto">{item.p.stemZh}{item.p.branchZh} · {item.p.stemTh}{item.p.branchTh}</div><div className="text-[10px] text-white/40">{z.th}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* คำทำนายแบบที่คุณอยากได้ */}
            <div className="rounded-[24px] bg-[#f5f1e8] text-[#2c2416] p-6 sm:p-8 border-[8px] border-[#d4af37]">
              <h2 className="font-chonburi text-2xl text-[#8b5a00] text-center">สรุปดวงของคุณแบบเข้าใจง่าย</h2>
              <p className="text-center text-[11px] text-[#8b5a00]/60 mt-2">อ้างอิงตามเวลาเกิด {day}/{month}/{year+543} {hour}:00 น.</p>

              <div className="mt-6 space-y-6 font-sarabun text-[14px] leading-relaxed">
                <div className="bg-white/60 border border-[#d4af37]/30 p-4 rounded-xl">
                  <h3 className="font-bold text-[#8b5a00]">### ข้อมูลดวงที่ได้</h3>
                  <p className="mt-2">ตามปฏิทินจีน วันเกิดคุณคือ <b>{result.year?.stemZh}{result.year?.branchZh}年 {result.month?.stemZh}{result.month?.branchZh}月 {result.day?.stemZh}{result.day?.branchZh}日</b> พอรวมเวลาตี {hour} ซึ่งเป็นยาม{result.displayHour?.branchTh||"ไม่ทราบ"} จะได้เวลาครบ 4 เสาเป็น</p>
                  <p className="mt-2 font-noto font-bold text-[#8b0000]">ปี: {result.year?.stemZh}{result.year?.branchZh} {result.year?.branchTh} / เดือน: {result.month?.stemZh}{result.month?.branchZh} {result.month?.branchTh} / วัน: {result.day?.stemZh}{result.day?.branchZh} {result.day?.branchTh} / เวลา: {result.displayHour ? `${result.displayHour.stemZh}${result.displayHour.branchZh} ${result.displayHour.branchTh}` : "ไม่ทราบเวลา"}</p>
                  <p className="mt-1 text-xs text-[#8b5a00]/70">ถ้าเรียกแบบซาจูเกาหลีก็คืออันเดียวกันเลยครับ แค่คนเกาหลีจะเรียก Saju</p>
                </div>

                <div className="bg-[#fffaf0] border border-[#d4af37]/20 p-4 rounded-xl">
                  <h3 className="font-bold text-[#8b5a00]">### 1. เลขศาสตร์ - Life Path {result.lifePath}</h3>
                  <p className="mt-2">{day} + {month} + {year} = {day+month+year} = {result.lifePath} คุณเป็นเลข {result.lifePath} {lifePathMean[result.lifePath]} งานที่ได้เงินดีของคุณจะมาจากความรู้เฉพาะทาง การเป็นที่ปรึกษา วางระบบ ไม่ใช่ขายแบบหว่านๆ</p>
                </div>

                <div className="bg-[#fffaf0] border border-[#d4af37]/20 p-4 rounded-xl">
                  <h3 className="font-bold text-[#8b5a00]">### 2. สายธาตุ - คุณคือคนธาตุ{result.day?.stemTh} {result.day?.element}</h3>
                  <p className="mt-1">วันเกิด <b>{result.day?.stemZh}{result.day?.branchZh}</b> คือ Day Master เป็น {result.day?.element} {result.day?.yinYang==="yang"?"หยาง แข็ง ตรง โตเร็ว":"หยิน อ่อนโยน ยืดหยุ่น"}</p>
                  <div className="mt-3 grid grid-cols-5 gap-2 text-[11px]">
                    {[
                      {k:"wood",th:"ไม้",p:result.elementPercent?.wood||0,c:"#2d5016"},
                      {k:"fire",th:"ไฟ",p:result.elementPercent?.fire||0,c:"#8b0000"},
                      {k:"earth",th:"ดิน",p:result.elementPercent?.earth||0,c:"#8b5a00"},
                      {k:"metal",th:"ทอง",p:result.elementPercent?.metal||0,c:"#555"},
                      {k:"water",th:"น้ำ",p:result.elementPercent?.water||0,c:"#0a3d62"},
                    ].map((el:any)=>(
                      <div key={el.k} className="text-center"><div className="font-bold" style={{color:el.c}}>{el.th} {el.p.toFixed(0)}%</div><div className="mt-1 h-1.5 bg-black/10 rounded"><div className="h-full" style={{width:`${el.p}%`,background:el.c}} /></div><div className="mt-1 text-[9px]">{el.p>30?"เยอะมาก":el.p>15?"แรง":"อ่อน"}</div></div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs">- <b>ไม้ เยอะมาก { (result.elementPercent?.wood||0).toFixed(0)}%</b> - มีความคิดริเริ่มสูง โตเร็ว แต่บางทีทำหลายอย่างพร้อมกัน<br/>- <b>ไฟ แรง {(result.elementPercent?.fire||0).toFixed(0)}%</b> - ไอเดียเยอะ นำเสนอเก่ง คนเห็น<br/>- <b>ดิน {(result.elementPercent?.earth||0).toFixed(0)}%</b> - เป็นคลังเก็บเงิน แต่มีน้อย<br/>- <b>ทอง {(result.elementPercent?.metal||0).toFixed(0)}%</b> - เป็นตัวตัดแต่งไม้ให้เป็นเฟอร์นิเจอร์ คือระเบียบ วินัย<br/>- <b>น้ำ อ่อน {(result.elementPercent?.water||0).toFixed(0)}%</b> - น้ำคือปัญญาและการไหลของเงิน อ่อน ต้องเติม</p>
                </div>

                <div className="bg-white/60 border border-[#d4af37]/30 p-4 rounded-xl">
                  <h3 className="font-bold text-[#8b5a00]">การงาน การเงิน แบบเข้าใจง่ายๆ</h3>
                  <p className="mt-2"><b>การงาน:</b> {result.day?.element==="wood"?"ไม้เยอะแบบนี้ต้องมีทองมาตัด คุณจะรุ่งเมื่องานมีกรอบชัด มี KPI มีระบบ ไม่ใช่งานอิสระลอยๆ งานที่ถูกโฉลกคือ งานใช้ไม้+ไฟ = การศึกษา คอนเทนต์ ที่ปรึกษา วางแผน ออกแบบ":`ธาตุ${result.day?.element}แบบนี้ เหมาะกับงานที่ใช้${result.day?.element}เป็นหลัก` } งานที่เกี่ยวกับการจัดการ ตรวจสอบ บัญชี หรือเอาความรู้ไปทำเป็นคอร์ส เป็นระบบ</p>
                  <p className="mt-2"><b>การเงิน:</b> {result.month?.branchTh} ในเดือนเป็นคลังเงิน แต่ธาตุ{result.day?.element}เยอะไปขุดคลังออกมาใช้เรื่อยๆ ทำให้หาเงินเก่งแต่เก็บยาก จังหวะเงินจะมาจากโปรเจกต์ใหญ่ ไม่ใช่เงินเล็กๆ เรื่อยๆ ต้องมีดินและทองมาช่วยล็อก คือต้องทำบัญชี แยกกระเป๋าเงิน ทำระบบออมอัตโนมัติ</p>
                </div>

                <div className="bg-[#fffaf0] border border-[#d4af37]/20 p-4 rounded-xl">
                  <h3 className="font-bold text-[#8b5a00]">วิธีปรับธาตุให้สมดุลแบบจีน/ซาจูแนะนำกัน</h3>
                  <p className="mt-2">- เติม <b>น้ำ</b> กับ <b>ทอง</b>: สีที่เสริมคือ ขาว เทา ดำ น้ำเงิน ใส่เสื้อโทนนี้เวลาคุยงานเงิน<br/>- ทิศที่เสริมคือทิศเหนือและทิศตะวันตก<br/>- งานที่เสริมน้ำคือ งานที่ใช้การไหล การสื่อสาร การเดินทาง การวิเคราะห์ข้อมูล</p>
                  <p className="mt-2 text-xs text-[#8b5a00]/70">ช่วงนี้อายุ {(new Date().getFullYear()-year)} ย่าง {(new Date().getFullYear()-year)+1} ตามหลักซาจูจะเข้าวัยที่ทองเริ่มมีบทบาทเยอะขึ้น คือเป็นวัยที่ต้องเปลี่ยนจากคนลงมือทำเอง ไปเป็นคนวางระบบให้คนอื่นทำต่อ จะเหนื่อยน้อยลงแต่เงินนิ่งขึ้น</p>
                </div>
              </div>
            </div>

            <button onClick={handleDownloadPDF} className="w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 font-noto">📄 ดาวน์โหลดรายงาน PDF สุดหรู แบบละเอียดนี้</button>
          </div>
        )}

        {/* PDF Luxury แบบรูปที่ 3 */}
        {result && (
          <div id="pdf-luxury" ref={pdfRef} className="mt-20 bg-[#f5f1e8] text-[#2c2416] p-8 sm:p-12 border-[12px] border-[#d4af37] relative" style={{fontFamily:"'Noto Serif Thai', serif"}}>
            <div className="text-center border-b-2 border-[#d4af37] pb-6">
              <h1 className="font-chonburi text-3xl text-[#8b5a00]">八字四柱命盤</h1>
              <p className="text-sm mt-2">Chinese BaZi Four Pillars Chart — {day}/{month}/{year} {hour}:00 {result.isUnknownTime?"(ไม่ทราบเวลา)":""}</p>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4">
              {[
                { p: result.displayHour, title: "時柱 Hour Pillar" },
                { p: result.day, title: "日柱 Day Pillar (ดิถี)" },
                { p: result.month, title: "月柱 Month Pillar" },
                { p: result.year, title: "年柱 Year Pillar" },
              ].map((col:any,i:number)=>{
                if(!col.p) return <div key={i} className="border-2 border-[#d4af37]/30 p-4 text-center"><div className="text-xs">ไม่ทราบเวลา</div></div>;
                const z=zodiacData[col.p.branchZh];
                return (
                  <div key={i} className="border-2 border-[#d4af37] bg-[#fffaf0] p-4 text-center">
                    <div className="text-[11px] bg-[#d4af37]/20 px-2 py-1 rounded">{col.title}</div>
                    <div className="mt-3 text-3xl font-bold text-[#8b0000]">{col.p.stemZh}{col.p.branchZh}</div>
                    <div className="mt-1 text-xs">{col.p.stemTh}{col.p.branchTh} | {z.th}</div>
                    <div className="mt-2 w-full h-[80px] rounded overflow-hidden border border-[#d4af37]/20"><img src={`/bazi/${z.animal}-${col.p.element}.webp`} className="w-full h-full object-cover" /></div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-[11px] leading-relaxed">
              <div>Life Path {result.lifePath} · {lifePathMean[result.lifePath]}</div>
              <div className="mt-2">Day Master {result.day?.stemTh} ธาตุ{result.day?.element} · ไม้ {result.elementPercent?.wood?.toFixed(0)}% ไฟ {result.elementPercent?.fire?.toFixed(0)}% ดิน {result.elementPercent?.earth?.toFixed(0)}% ทอง {result.elementPercent?.metal?.toFixed(0)}% น้ำ {result.elementPercent?.water?.toFixed(0)}%</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

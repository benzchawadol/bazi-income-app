"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi as calculateBaziReal } from "@/lib/bazi";

const daysInMonth = (y:number,m:number)=>new Date(y,m,0).getDate();

const zodiacData: any = {
  "子":{th:"ชวด/หนู",animal:"rat"},"丑":{th:"ฉลู/วัว",animal:"ox"},
  "寅":{th:"ขาล/เสือ",animal:"tiger"},"卯":{th:"เถาะ/กระต่าย",animal:"rabbit"},
  "辰":{th:"มะโรง/มังกร",animal:"dragon"},"巳":{th:"มะเส็ง/งู",animal:"snake"},
  "午":{th:"มะเมีย/ม้า",animal:"horse"},"未":{th:"มะแม/แพะ",animal:"goat"},
  "申":{th:"วอก/ลิง",animal:"monkey"},"酉":{th:"ระกา/ไก่",animal:"rooster"},
  "戌":{th:"จอ/สุนัข",animal:"dog"},"亥":{th:"กุน/หมู",animal:"pig"},
};

function calcLifePath(d:number,m:number,y:number){
  let total=d+m+y;
  while(total>9){ total=String(total).split('').reduce((a:any,b:any)=>a+parseInt(b),0); }
  return total;
}

export default function Home(){
  const [year,setYear]=useState<any>('');
  const [month,setMonth]=useState<any>('');
  const [day,setDay]=useState<any>('');
  const [hour,setHour]=useState<any>('');
  const [unknownTime,setUnknownTime]=useState(false);
  const [result,setResult]=useState<any>(null);
  const reportRef=useRef<HTMLDivElement>(null);
  const pdfRef=useRef<HTMLDivElement>(null);
  const maxDay=useMemo(()=>{
    const y=Number(year); const m=Number(month);
    if(!y||!m) return 31;
    return daysInMonth(y,m);
  },[year,month]);

  function handleCalculate(){
    if(year===''||month===''||day===''){ alert("กรุณาเลือก วัน เดือน ปีเกิด ก่อนครับ"); return; }
    if(!unknownTime && hour===''){ alert("กรุณาเลือกเวลาเกิด หรือติ๊ก ไม่ทราบเวลาเกิด"); return; }
    try{
      const raw=calculateBaziReal({year:Number(year),month:Number(month),day:Number(day),hour:unknownTime?12:Number(hour),minute:0});
      const lp=calcLifePath(Number(day),Number(month),Number(year));
      setResult({...raw,isUnknownTime:unknownTime,displayHour:unknownTime?null:raw.hour,lifePath:lp,inputDay:Number(day),inputMonth:Number(month),inputYear:Number(year),inputHour:unknownTime?null:Number(hour)});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth"}),300);
    }catch(e:any){ alert(e.message); }
  }

  function handleDownloadPDF(){
    if(!pdfRef.current) return;
    const html=pdfRef.current.innerHTML;
    const w=window.open('','_blank');
    if(!w){ alert("กรุณาอนุญาตป๊อปอัพ"); return; }
    w.document.write(`<html><head><title>ดวงจีนปาจื้อ</title><style>@page{size:A4;margin:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{margin:0;background:#f5f1e8;font-family:sans-serif}</style></head><body>${html}</body></html>`);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();},500);
  }

  return(
    <main className="min-h-screen bg-[#060606] text-white">
      <div className="max-w-[900px] mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-[36px] font-bold text-[#f5e6c8]">ทำดวงจีนปาจื้อ</h1>
          <p className="text-[11px] text-white/30 mt-2">FOUR PILLARS · NO DEFAULT · BUILD FIXED</p>
        </div>
        <div className="rounded-[24px] bg-white/[0.06] border border-white/[0.08] p-[1px]">
          <div className="rounded-[23px] bg-[#121212] p-6">
            <div className="grid grid-cols-3 gap-3">
              <select value={day} onChange={e=>setDay(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white">
                <option value="">วัน</option>
                {Array.from({length:maxDay},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}
              </select>
              <select value={month} onChange={e=>setMonth(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white">
                <option value="">เดือน</option>
                {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
              </select>
              <select value={year} onChange={e=>setYear(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white">
                <option value="">ปี พ.ศ.</option>
                {Array.from({length:80},(_,i)=>2560-i).map(be=><option key={be} value={be-543}>{be}</option>)}
              </select>
            </div>
            <div className="mt-4 flex gap-3">
              <select value={hour} disabled={unknownTime} onChange={e=>setHour(e.target.value===''? '': Number(e.target.value))} className="flex-1 rounded-xl bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white disabled:opacity-20">
                <option value="">เวลาเกิด</option>
                {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}:00 น.</option>)}
              </select>
              <label className="flex items-center gap-2 text-xs text-yellow-300"><input type="checkbox" checked={unknownTime} onChange={e=>setUnknownTime(e.target.checked)} />ไม่ทราบเวลา</label>
            </div>
            <button onClick={handleCalculate} className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4">ทำนายดวงชะตาแบบละเอียด</button>
            <p className="text-center text-[10px] text-white/20 mt-3">เข้าเว็บครั้งแรกเป็นค่าว่างแล้ว ไม่มีวันเกิดค้าง</p>
          </div>
        </div>

        {result && (
          <div ref={reportRef} className="mt-12 space-y-8">
            <div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-6">
              <h2 className="text-center text-xl text-[#f5e6c8]">แผนผังสี่เสาหลัก</h2>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {p:result.year,label:"ปีเกิด"},
                  {p:result.month,label:"เดือนเกิด"},
                  {p:result.day,label:"วันเกิด"},
                  {p:result.displayHour,label:"ยามเกิด"},
                ].map((item:any,i:number)=>{
                  if(!item.p) return <div key={i} className="rounded-[16px] bg-yellow-500/10 border border-yellow-500/20 p-8 text-center"><div>❓</div><div className="text-yellow-300 text-xs">ไม่ทราบเวลา</div></div>;
                  const z=zodiacData[item.p.branchZh];
                  return(
                    <div key={i}>
                      <div className="text-[9px] text-center text-white/30 mb-2">{item.label}</div>
                      <div className="rounded-[16px] overflow-hidden border border-yellow-500/20 aspect-[3/4] bg-[#0a0a0a]"><img src={`/bazi/${z.animal}-${item.p.element}.webp`} alt={z.th} className="w-full h-full object-cover" /></div>
                      <div className="mt-2 text-center"><div className="text-[12px] text-[#f5e6c8]">{item.p.stemZh}{item.p.branchZh}</div><div className="text-[10px] text-white/40">{item.p.stemTh}{item.p.branchTh}</div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#f5f1e8] text-[#2c2416] p-6 border-[8px] border-[#d4af37]">
              <h2 className="text-2xl text-[#8b5a00] text-center font-bold">สรุปดวงของคุณ</h2>
              <p className="text-center text-[11px] text-[#8b5a00]/60 mt-2">{result.inputDay}/{result.inputMonth}/{result.inputYear+543} {result.inputHour!==null?`${result.inputHour}:00`:"ไม่ทราบเวลา"}</p>
              <div className="mt-6 space-y-4 text-[14px] leading-relaxed">
                <div className="bg-white/60 p-4 rounded-xl border border-[#d4af37]/30"><b>ข้อมูลดวง:</b> {result.year?.stemZh}{result.year?.branchZh} {result.month?.stemZh}{result.month?.branchZh} {result.day?.stemZh}{result.day?.branchZh} {result.displayHour?.stemZh}{result.displayHour?.branchZh} - {result.year?.branchTh} {result.month?.branchTh} {result.day?.branchTh} {result.displayHour?.branchTh}</div>
                <div className="bg-[#fffaf0] p-4 rounded-xl border border-[#d4af37]/20"><b>Life Path {result.lifePath}:</b> {result.inputDay}+{result.inputMonth}+{result.inputYear}={result.inputDay+result.inputMonth+result.inputYear} = {result.lifePath} - {result.lifePath===7?"นักวิเคราะห์ ชอบขุดลึก ความรู้เฉพาะทาง":"นักสร้างตามเลข"}</div>
                <div className="bg-[#fffaf0] p-4 rounded-xl border border-[#d4af37]/20"><b>ธาตุ:</b> คุณคือคนธาตุ {result.day?.stemTh} {result.day?.element} - ไม้ {(result.elementPercent?.wood||0).toFixed(0)}% ไฟ {(result.elementPercent?.fire||0).toFixed(0)}% ดิน {(result.elementPercent?.earth||0).toFixed(0)}% ทอง {(result.elementPercent?.metal||0).toFixed(0)}% น้ำ {(result.elementPercent?.water||0).toFixed(0)}%</div>
                <div className="bg-white/60 p-4 rounded-xl border border-[#d4af37]/30"><b>การงาน:</b> ธาตุ{result.day?.element} งานที่ถูกโฉลกคือ การศึกษา คอนเทนต์ ที่ปรึกษา วางระบบ มี KPI ชัด<br/><b>การเงิน:</b> {result.month?.branchTh} เป็นคลังเงิน หาเงินเก่งแต่เก็บยาก ต้องทำบัญชี แยกกระเป๋าเงิน<br/><b>วิธีปรับธาตุ:</b> เติมน้ำกับทอง สีขาว เทา ดำ น้ำเงิน ทิศเหนือ ตะวันตก</div>
              </div>
            </div>
            <button onClick={handleDownloadPDF} className="w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4">📄 ดาวน์โหลด PDF สุดหรู</button>
          </div>
        )}

        {result && (
          <div ref={pdfRef} className="mt-20 bg-[#f5f1e8] text-[#2c2416] p-8 border-[12px] border-[#d4af37]">
            <div className="text-center border-b-2 border-[#d4af37] pb-6"><h1 className="text-3xl text-[#8b5a00] font-bold">八字四柱命盤</h1><p className="text-sm mt-2">Chinese BaZi — {result.inputDay}/{result.inputMonth}/{result.inputYear} {result.inputHour!==null?`${result.inputHour}:00`:""}</p></div>
            <div className="mt-8 grid grid-cols-4 gap-4">
              {[{p:result.displayHour,t:"時柱 Hour"},{p:result.day,t:"日柱 Day"},{p:result.month,t:"月柱 Month"},{p:result.year,t:"年柱 Year"}].map((col:any,i:number)=>{
                if(!col.p) return <div key={i} className="border-2 border-[#d4af37]/30 p-4 text-center"><div className="text-xs">ไม่ทราบเวลา</div></div>;
                const z=zodiacData[col.p.branchZh];
                return <div key={i} className="border-2 border-[#d4af37] bg-[#fffaf0] p-4 text-center"><div className="text-[11px] bg-[#d4af37]/20 px-2 py-1 rounded">{col.t}</div><div className="mt-3 text-3xl font-bold text-[#8b0000]">{col.p.stemZh}{col.p.branchZh}</div><div className="mt-2 w-full h-[80px] border border-[#d4af37]/20"><img src={`/bazi/${z.animal}-${col.p.element}.webp`} className="w-full h-full object-cover" /></div></div>;
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

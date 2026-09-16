"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";
const dm=(y:number,m:number)=>new Date(y,m,0).getDate();
const zd:any={"子":{th:"ชวด",a:"rat"},"丑":{th:"ฉลู",a:"ox"},"寅":{th:"ขาล",a:"tiger"},"卯":{th:"เถาะ",a:"rabbit"},"辰":{th:"มะโรง",a:"dragon"},"巳":{th:"มะเส็ง",a:"snake"},"午":{th:"มะเมีย",a:"horse"},"未":{th:"มะแม",a:"goat"},"申":{th:"วอก",a:"monkey"},"酉":{th:"ระกา",a:"rooster"},"戌":{th:"จอ",a:"dog"},"亥":{th:"กุน",a:"pig"}};
function st(p:number){if(p>=35)return"เยอะมาก";if(p>=25)return"ค่อนข้างเยอะ";if(p>=15)return"กำลังดี";if(p>=8)return"น้อยไปหน่อย";return"น้อยมาก";}
const lp:any={1:{t:"ผู้นำ",d:"กล้าคิดกล้าทำ ชอบเริ่มใหม่ด้วยตัวเอง ไม่ชอบรอใคร",r:"คุณจะรุ่งเมื่อกล้าเป็นคนแรกที่เปิดทาง"},2:{t:"นักประสาน",d:"ละเอียดอ่อน เข้าใจความรู้สึกคนอื่นเก่ง เป็นที่ปรึกษาที่ดี",r:"คุณจะรุ่งเมื่อได้เป็นคู่คิดที่ดี"},3:{t:"นักสื่อสาร",d:"มีเสน่ห์ พูดเก่ง ครีเอทีฟ คนฟังคุณแล้วรู้สึกดี",r:"คุณจะรุ่งเมื่อได้พูด ได้แสดงออก"},4:{t:"นักวางระบบ",d:"รอบคอบ มีระเบียบ ชอบอะไรเป็นขั้นตอน",r:"คุณจะรุ่งเมื่อมีระบบชัด"},5:{t:"นักเดินทาง",d:"ไม่ชอบจำเจ ชอบอิสระ ชอบเจออะไรใหม่ๆ",r:"คุณจะรุ่งเมื่อได้เดินทาง เปลี่ยนแปลง"},6:{t:"นักดูแล",d:"ใจดี รับผิดชอบสูง อยากดูแลคนรอบข้าง",r:"คุณจะรุ่งเมื่อได้ดูแลและเป็นที่พึ่ง"},7:{t:"นักวิเคราะห์",d:"ชอบคิดลึก ชอบเรียนรู้ด้วยตัวเอง ไม่ชอบผิวเผิน",r:"คุณจะรุ่งเมื่อเป็นผู้เชี่ยวชาญเฉพาะเรื่อง"},8:{t:"นักบริหาร",d:"มีเป้าหมายเรื่องเงินชัด มีภาวะผู้นำ",r:"คุณจะรุ่งเมื่อได้บริหารจัดการเอง"},9:{t:"ผู้ให้",d:"ใจกว้าง มองภาพใหญ่ อยากช่วยคนจำนวนมาก",r:"คุณจะรุ่งเมื่อได้ช่วยเหลือผู้อื่น"}};
export default function Home(){
const [y,setY]=useState<any>('');const [mo,setMo]=useState<any>('');const [d,setD]=useState<any>('');const [h,setH]=useState<any>('');const [mi,setMi]=useState<any>('');const [ut,setUt]=useState(false);
const [r,setR]=useState<any>(null);const rr=useRef<HTMLDivElement>(null);
const max=useMemo(()=>{if(!y||!mo)return 31;return dm(Number(y),Number(mo));},[y,mo]);
function calcLP(a:number,b:number,c:number){let t=a+b+c;while(t>9){t=String(t).split('').reduce((x:any,y:any)=>x+Number(y),0);}return t;}
function calc(){
if(y===''||mo===''||d===''){alert("ใส่ วัน เดือน ปีเกิด ก่อนนะครับ");return;}
if(Number(y)<2400||Number(y)>2700){alert("ใส่ปี พ.ศ. 4 หลัก เช่น 2537");return;}
if(!ut&&(h===''||mi==='')){alert("เลือก ชั่วโมง นาที หรือติ๊กไม่ทราบเวลา");return;}
try{const raw=calculateBazi({year:Number(y)-543,month:Number(mo),day:Number(d),hour:ut?12:Number(h),minute:ut?0:Number(mi)});const l=calcLP(Number(d),Number(mo),Number(y)-543);setR({...raw,ut,dh:ut?null:raw.hour,lp:l,dy:Number(d),mo:Number(mo),yr:Number(y)-543,be:Number(y),hr:ut?null:Number(h),mn:ut?null:Number(mi)});setTimeout(()=>rr.current?.scrollIntoView({behavior:"smooth"}),300);}catch(e:any){alert(e.message);}}
return(<main className="min-h-screen bg-[#060606] text-white"><div className="max-w-[900px] mx-auto px-4 py-8">
<div className="text-center mb-6"><h1 className="text-[34px] font-bold text-[#f5e6c8]">ทำนายดวงจีนปาจื้อ</h1><p className="text-[12px] text-white/40 mt-1">เราอ่านดวงคุณด้วยใจ อยากให้เอาไปใช้ได้จริง</p></div>
<div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-[1px]"><div className="rounded-[23px] bg-[#121212] p-5">
<div className="grid grid-cols-3 gap-2">
<select value={d} onChange={e=>setD(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white"><option value="">วัน</option>{Array.from({length:max},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}</select>
<select value={mo} onChange={e=>setMo(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white"><option value="">เดือน</option>{Array.from({length:12},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}</select>
<input value={y} onChange={e=>setY(e.target.value.replace(/[^0-9]/g,''))} placeholder="ปี พ.ศ. เช่น 2537" className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white placeholder:text-white/30" inputMode="numeric" />
</div>
<div className="mt-3 grid grid-cols-2 gap-2">
<select value={h} disabled={ut} onChange={e=>setH(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white disabled:opacity-20"><option value="">ชั่วโมง</option>{Array.from({length:24},(_,i)=>i).map(v=><option key={v} value={v}>{String(v).padStart(2,"0")} น.</option>)}</select>
<select value={mi} disabled={ut} onChange={e=>setMi(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white disabled:opacity-20"><option value="">นาที</option>{Array.from({length:60},(_,i)=>i).map(v=><option key={v} value={v}>{String(v).padStart(2,"0")} นาที</option>)}</select>
</div>
<label className="flex items-center gap-2 text-xs text-yellow-300 mt-3"><input type="checkbox" checked={ut} onChange={e=>setUt(e.target.checked)} /> ไม่ทราบเวลาเกิด</label>
<button onClick={calc} className="mt-4 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4">ดูดวงของฉันแบบละเอียด</button>
<p className="text-[10px] text-white/30 text-center mt-2">พิมพ์ปี พ.ศ. ได้เลย ไม่ต้องเลื่อนหาแล้วนะครับ</p>
</div></div>
{r && (<div ref={rr} className="mt-8 space-y-6">
<div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-5"><h2 className="text-center text-[#f5e6c8]">แผนผังชีวิตของคุณ</h2><div className="mt-4 grid grid-cols-4 gap-3">{[{p:r.year,l:"ปีเกิด"},{p:r.month,l:"เดือนเกิด"},{p:r.day,l:"วันเกิด"},{p:r.dh,l:"ยามเกิด"}].map((it:any,i:number)=>{if(!it.p)return <div key={i} className="rounded-xl bg-yellow-500/10 p-4 text-center text-xs">ไม่ทราบเวลา</div>;const z=zd[it.p.branchZh];return <div key={i} className="text-center"><div className="text-[9px] text-white/40 mb-1">{it.l}</div><div className="rounded-xl overflow-hidden border border-yellow-500/20 aspect-[3/4] bg-black"><img src={`/bazi/${z.a}-${it.p.element}.webp`} className="w-full h-full object-cover" /></div><div className="mt-2"><div className="text-[13px] text-[#f5e6c8] font-bold">{it.p.stemZh}{it.p.branchZh}</div><div className="text-[10px] text-white/60">{z.th}</div></div></div>;})}</div></div>
<div className="rounded-[24px] bg-[#121212] border border-white/[0.06] p-6"><h3 className="text-center text-[#f5e6c8] font-bold">พลังธาตุในตัวคุณ</h3><div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8"><div><svg width="180" height="180" viewBox="0 0 200 200">{(()=>{const data=[{p:r.elementPercent?.wood||0,c:"#22c55e"},{p:r.elementPercent?.fire||0,c:"#ef4444"},{p:r.elementPercent?.earth||0,c:"#eab308"},{p:r.elementPercent?.metal||0,c:"#e5e7eb"},{p:r.elementPercent?.water||0,c:"#60a5fa"}];let acc=0;return data.map((d,i)=>{const s=acc;acc+=d.p;const e=acc;if(d.p<=0)return null;const sa=(s/100)*360-90,ea=(e/100)*360-90;const ro=80,ri=50;const x1=100+ro*Math.cos(sa*Math.PI/180),y1=100+ro*Math.sin(sa*Math.PI/180);const x2=100+ro*Math.cos(ea*Math.PI/180),y2=100+ro*Math.sin(ea*Math.PI/180);const x3=100+ri*Math.cos(ea*Math.PI/180),y3=100+ri*Math.sin(ea*Math.PI/180);const x4=100+ri*Math.cos(sa*Math.PI/180),y4=100+ri*Math.sin(sa*Math.PI/180);const large=d.p>50?1:0;return <path key={i} d={`M ${x1} ${y1} A ${ro} ${ro} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${large} 0 ${x4} ${y4} Z`} fill={d.c} stroke="#121212" strokeWidth="2"/>});})()}<circle cx="100" cy="100" r="42" fill="#121212" stroke="rgba(212,175,55,0.3)" /><text x="100" y="100" textAnchor="middle" dy="0.3em" fill="#f5e6c8" fontSize="11">ธาตุ</text></svg></div><div className="space-y-3 w-full sm:w-[260px]">{[{k:"wood",th:"ไม้",c:"#22c55e",p:r.elementPercent?.wood||0},{k:"fire",th:"ไฟ",c:"#ef4444",p:r.elementPercent?.fire||0},{k:"earth",th:"ดิน",c:"#eab308",p:r.elementPercent?.earth||0},{k:"metal",th:"ทอง",c:"#e5e7eb",p:r.elementPercent?.metal||0},{k:"water",th:"น้ำ",c:"#60a5fa",p:r.elementPercent?.water||0}].map((el:any)=>{const s=st(el.p);return <div key={el.k}><div className="flex justify-between text-[11px]"><span className="text-white/60">{el.th} {s}</span><span className="text-white/80 font-bold">{el.p.toFixed(1)}%</span></div><div className="mt-1 h-[6px] bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${el.p}%`,background:el.c}} /></div></div>;})}</div></div></div>
<div className="rounded-[24px] bg-[#f5f1e8] text-[#2c2416] p-6 border-[6px] border-[#d4af37]"><h2 className="text-xl text-[#8b5a00] text-center font-bold">ดวงของคุณ เราอ่านให้ด้วยใจนะครับ</h2><p className="text-center text-[11px] text-[#8b5a00]/60 mt-2">เกิด {r.dy}/{r.mo}/{r.be} {r.hr!==null?`เวลา ${String(r.hr).padStart(2,"0")}:${String(r.mn).padStart(2,"0")} น.`:`ไม่ทราบเวลา`} - อายุ {new Date().getFullYear()-r.yr} ปี</p><div className="mt-6 space-y-6 text-[14px] leading-[1.9]">
<div className="bg-white p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">ดวงของคุณคือแบบนี้นะครับ</h3><div className="mt-3 space-y-2 text-[13px]"><div>ปีเกิด: {r.year?.stemZh}{r.year?.branchZh} - นักษัตร {zd[r.year?.branchZh]?.th}</div><div>เดือนเกิด: {r.month?.stemZh}{r.month?.branchZh} - นักษัตร {zd[r.month?.branchZh]?.th}</div><div>วันเกิด: {r.day?.stemZh}{r.day?.branchZh} - นักษัตร {zd[r.day?.branchZh]?.th} - นี่คือตัวตนจริงๆ ของคุณเลยครับ</div>{r.dh && <div>ยามเกิด: {r.dh?.stemZh}{r.dh?.branchZh} - นักษัตร {zd[r.dh?.branchZh]?.th}</div>}</div></div>
<div className="bg-[#fffaf0] p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">1. เส้นทางชีวิต - Life Path {r.lp}</h3><div className="mt-3 text-[13px]">{r.dy}+{r.mo}+{r.yr}={r.dy+r.mo+r.yr}={r.lp}</div><div className="mt-3"><b>คุณเป็นคนเลข {r.lp} - {lp[r.lp]?.t}</b> ครับ</div><div className="mt-2">{lp[r.lp]?.d} คุณเคยรู้สึกแบบนี้บ้างไหมครับ?</div><div className="mt-4 bg-white p-4 rounded-lg border text-[#8b5a00] font-bold">{lp[r.lp]?.r} ลองทำดูนะครับ คุณจะเหนื่อยน้อยลงแต่ได้ผลมากขึ้น</div></div>
<div className="bg-[#fffaf0] p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">2. พลังธาตุในตัวคุณ ผมเล่าให้ฟังแบบละเอียดเลยนะครับ</h3><div className="mt-4 space-y-4">{[
{th:"ไม้",en:"wood",p:r.elementPercent?.wood||0},
{th:"ไฟ",en:"fire",p:r.elementPercent?.fire||0},
{th:"ดิน",en:"earth",p:r.elementPercent?.earth||0},
{th:"ทอง",en:"metal",p:r.elementPercent?.metal||0},
{th:"น้ำ",en:"water",p:r.elementPercent?.water||0}
].map((e:any)=>{
const p=e.p;
let txt="";
if(e.en==="wood"){
if(p>=35) txt=`ธาตุไม้ในตัวคุณมีถึง ${p.toFixed(1)}% เลยนะครับ สูงที่สุดใน 5 ธาตุเลย คุณเป็นคนไอเดียเยอะมาก คิดอะไรใหม่ๆ ได้ตลอดเวลา โตเร็ว เรียนรู้เร็ว แต่จุดที่ต้องระวังคือคุณทำหลายอย่างพร้อมกันเกินไป จนไม่มีอะไรเสร็จเป็นชิ้นเป็นอันเลยใช่ไหมครับ? ลองโฟกัสทีละอย่างดูนะครับ`;
else if(p>=25) txt=`ธาตุไม้ของคุณมี ${p.toFixed(1)}% ถือว่าค่อนข้างสูง คุณมีพลังในการเริ่มต้นสูง ชอบอะไรใหม่ๆ ไม่ชอบจำเจ มีความคิดริเริ่มดี เหมาะกับงานที่ต้องใช้ไอเดียและความคิดสร้างสรรค์`;
else if(p>=15) txt=`ธาตุไม้ของคุณมี ${p.toFixed(1)}% กำลังพอดีเลยครับ มีความคิดริเริ่มพอดีๆ ไม่มากไปไม่น้อยไป สมดุลดี`;
else if(p>=8) txt=`ธาตุไม้ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง อาจจะน้อยไปหน่อย คุณอาจจะรู้สึกว่าไม่ค่อยกล้าเริ่มอะไรใหม่ๆ ไม่ค่อยมีความคิดใหม่ๆ ใช่ไหมครับ? ลองเติมพลังไม้ด้วยการอยู่ใกล้ธรรมชาติมากขึ้นนะครับ`;
else txt=`ธาตุไม้ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเลย คุณอาจจะรู้สึกว่าช่วงนี้ชีวิตไม่ค่อยมีความคิดใหม่ๆ เลยใช่ไหมครับ? ลองเติมพลังไม้ด้วยสีเขียว ต้นไม้เล็กๆ ที่โต๊ะทำงาน ทิศตะวันออกจะช่วยเสริมความคิดริเริ่มให้คุณนะครับ`;
}
if(e.en==="fire"){
if(p>=35) txt=`ธาตุไฟของคุณมีถึง ${p.toFixed(1)}% สูงมากเลย คุณเป็นคนโดดเด่น มีเสน่ห์มาก คนเห็นคุณง่าย เป็นดาวเด่นเลย แต่จุดที่ต้องระวังคือบางครั้งคุณอาจจะใจร้อนไปหน่อย ต้องใจเย็นลงนิดนึงนะครับ`;
else if(p>=25) txt=`ธาตุไฟของคุณมี ${p.toFixed(1)}% ค่อนข้างสูงเลย คุณมีพลังในการนำเสนอสูงมาก พูดเก่ง มีเสน่ห์ เป็นที่สนใจของคนรอบข้าง คนอื่นเห็นความสามารถคุณได้ง่าย เหมาะกับงานที่ต้องออกหน้ากล้อง`;
else if(p>=15) txt=`ธาตุไฟของคุณมี ${p.toFixed(1)}% กำลังพอดีเลย มีเสน่ห์พอดีๆ ไม่ต้องพยายามมากคนก็สนใจคุณแล้ว สมดุลดีมาก`;
else if(p>=8) txt=`ธาตุไฟของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง อาจจะน้อยไปหน่อย คุณอาจจะไม่ค่อยกล้าแสดงออก ไม่ค่อยชอบออกหน้ากล้องใช่ไหมครับ? ลองเพิ่มความมั่นใจดูนะครับ`;
else txt=`ธาตุไฟของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเลย คุณเป็นคนเงียบๆ ไม่ชอบให้ใครมาสนใจ ไม่ชอบออกหน้า ลองเพิ่มแสงสว่างในบ้าน ใส่เสื้อสีแดงบ้าง จะช่วยเสริมความมั่นใจให้คุณได้ครับ`;
}
if(e.en==="earth"){
if(p>=35) txt=`ธาตุดินของคุณมีถึง ${p.toFixed(1)}% สูงมากเลย คุณเป็นคนมั่นคงมาก เก็บเงินเก่ง น่าเชื่อถือ เป็นที่พึ่งของคนอื่นได้ดี แต่บางครั้งคุณอาจจะยึดติดกับอะไรเดิมๆ เกินไป ลองปล่อยวางบ้างนะครับ`;
else if(p>=25) txt=`ธาตุดินของคุณมี ${p.toFixed(1)}% ค่อนข้างสูง คุณเป็นคนมั่นคง เก็บเงินเก่ง มีความรับผิดชอบสูง เป็นที่พึ่งของคนอื่นได้ดีเลย`;
else if(p>=15) txt=`ธาตุดินของคุณมี ${p.toFixed(1)}% กำลังพอดีเลย มีความมั่นคงพอดี ไม่มากไปไม่น้อยไป สมดุลดี`;
else if(p>=8) txt=`ธาตุดินของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง อาจจะน้อยไปหน่อย คลังเงินเล็กไปหน่อย เก็บเงินยากใช่ไหมครับ? ลองวางระบบการเงินให้ดีขึ้นนะครับ`;
else txt=`ธาตุดินของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเลย คุณหาเงินเก่งนะ แต่เก็บไม่อยู่เลยใช่ไหมครับ? ต้องสร้างระบบออมอัตโนมัติแล้วนะ`;
}
if(e.en==="metal"){
if(p>=35) txt=`ธาตุทองของคุณมีถึง ${p.toFixed(1)}% สูงมากเลย คุณเป็นคนมีระเบียบ มีวินัย เด็ดขาดมาก แต่บางครั้งคุณเข้มงวดกับตัวเองและคนอื่นเกินไปหรือเปล่า? ผ่อนคลายบ้างนะครับ`;
else if(p>=25) txt=`ธาตุทองของคุณมี ${p.toFixed(1)}% ค่อนข้างสูง คุณเป็นคนมีระเบียบ วินัย จัดการเก่ง เหมาะกับงานที่ต้องใช้ความละเอียดรอบคอบ`;
else if(p>=15) txt=`ธาตุทองของคุณมี ${p.toFixed(1)}% กำลังพอดีเลย มีระเบียบพอดีๆ ไม่มากไปไม่น้อยไป`;
else if(p>=8) txt=`ธาตุทองของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง อาจจะน้อยไปหน่อย คุณอาจจะรู้สึกว่าชีวิตไม่ค่อยมีระเบียบเท่าไหร่ใช่ไหมครับ?`;
else txt=`ธาตุทองของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเลย ขาดระเบียบเลย ลองเสริมธาตุทองด้วยการจัดระเบียบชีวิตให้มากขึ้นนะครับ`;
}
if(e.en==="water"){
if(p>=35) txt=`ธาตุน้ำของคุณมีถึง ${p.toFixed(1)}% สูงมากเลย คุณเป็นคนฉลาดมาก ปรับตัวเก่ง มีปัญญา แต่บางครั้งคุณคิดมากไปหรือเปล่า? เงินไหลออกเร็วด้วยใช่ไหมครับ? ต้องมีดินมากั้น มีไฟมาอุ่นนะครับ`;
else if(p>=25) txt=`ธาตุน้ำของคุณมี ${p.toFixed(1)}% ค่อนข้างสูง คุณเป็นคนฉลาด ปัญญาดี ไหลเวียนดี ปรับตัวเก่ง เรียนรู้เร็ว เป็นจุดแข็งของคุณเลยนะ`;
else if(p>=15) txt=`ธาตุน้ำของคุณมี ${p.toFixed(1)}% กำลังพอดีเลย มีปัญญาและการไหลเวียนที่ดี สมดุลดีมาก`;
else if(p>=8) txt=`ธาตุน้ำของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง อาจจะน้อยไปหน่อย ปัญญาและการไหลของเงินน้อยไปหน่อย ต้องเติมด้วยการเรียนรู้`;
else txt=`ธาตุน้ำของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเลย ปัญญาและการไหลของเงินในดวงนี้อ่อนไปหน่อย ต้องเติมด้วยการเรียนรู้เพิ่มเติม`;
}
return <div key={e.en} className="bg-white p-4 rounded-lg border"><div className="font-bold text-[#8b5a00]">{e.th} {st(e.p)} {e.p.toFixed(1)}%</div><div className="mt-2 text-[13px] leading-[1.8]">{txt}</div></div>;
})}</div></div>
<div className="bg-white p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">3. การงาน การเงิน และวิธีปรับสมดุลเฉพาะคุณเลยครับ</h3>
<div className="mt-5"><div className="font-bold">การงานของคุณเป็นแบบนี้นะครับ</div><div className="mt-2 text-[13px] leading-[1.8]">{(()=>{
const wood=r.elementPercent?.wood||0,metal=r.elementPercent?.metal||0,water=r.elementPercent?.water||0;
if(wood>=30 && metal<12) return `คุณเป็นคนไม้เยอะมาก ${wood.toFixed(1)}% เลยนะ ไอเดียคุณเยอะมาก แต่ปัญหาคือคุณทำหลายอย่างพร้อมกันเกินไป จนไม่มีอะไรเสร็จเลยใช่ไหมครับ? คุณจะรุ่งมากๆ เมื่อมีกรอบชัด มี KPI`;
if(water>=30) return `ดวงคุณน้ำเยอะมาก ${water.toFixed(1)}% คุณฉลาดมาก ปรับตัวเก่ง เหมาะกับงานสื่อสาร เดินทาง วิเคราะห์ข้อมูล`;
return `ดวงคุณธาตุ ${r.day?.element} เด่นนะครับ คุณเหมาะกับงานที่ใช้จุดแข็งธาตุนี้`;
})()}</div></div>
<div className="mt-6"><div className="font-bold">การเงินของคุณเป็นแบบนี้นะครับ</div><div className="mt-2 text-[13px] leading-[1.8]">{(()=>{
const earth=r.elementPercent?.earth||0;
const monthName=zd[r.month?.branchZh]?.th;
if(earth>=20) return `เดือนเกิดของคุณคือ ${monthName} ซึ่งเป็นคลังเงินของคุณเลยครับ และดินของคุณ ${earth.toFixed(1)}% แข็งแรงมาก เก็บเงินเก่งนะ`;
if(earth>=10) return `เดือนเกิดของคุณคือ ${monthName} ซึ่งเป็นคลังเงิน ดินของคุณ ${earth.toFixed(1)}% พอดีๆ คุณหาเงินเก่งแต่ระวังใช้จ่าย`;
return `เดือนเกิดของคุณคือ ${monthName} ซึ่งเป็นคลังเงิน แต่ดินของคุณตอนนี้ ${earth.toFixed(1)}% น้อยมาก คลังเล็ก เก็บยาก ต้องสร้างระบบออม`;
})()}</div></div>
<div className="mt-6 p-5 bg-[#fffaf0] rounded-xl border"><div className="font-bold text-[#8b5a00]">วิธีปรับสมดุลเฉพาะดวงคุณเลยครับ ผมตั้งใจเขียนให้คุณโดยเฉพาะเลยนะ</div><div className="mt-4 space-y-4 text-[13px] leading-[1.8]">{(()=>{
const wood=r.elementPercent?.wood||0,fire=r.elementPercent?.fire||0,earth=r.elementPercent?.earth||0,metal=r.elementPercent?.metal||0,water=r.elementPercent?.water||0;
let tips:any[]=[];
if(wood<8){
tips.push(`ไม้ของคุณตอนนี้มีแค่ ${wood.toFixed(1)}% เองครับ น้อยมากเลย คุณอาจจะรู้สึกว่าไม่ค่อยกล้าเริ่มอะไรใหม่ๆ ใช่ไหมครับ? ลองเริ่มจากอะไรง่ายๆ ก่อนนะครับ เช่น หาต้นไม้เล็กๆ มาวางที่โต๊ะทำงาน ใส่เสื้อผ้าโทนสีเขียวบ่อยๆ หรือทำงานที่ต้องใช้ความคิดสร้างสรรค์มากขึ้น`);
}
if(fire<8){
tips.push(`ไฟของคุณตอนนี้มีแค่ ${fire.toFixed(1)}% เองครับ น้อยมากเลย คุณเป็นคนไม่ค่อยชอบออกหน้ากล้อง ไม่ค่อยกล้าพรีเซนต์ใช่ไหมครับ? ถ้าอยากเสริมไฟ ลองเพิ่มแสงสว่างในบ้านให้สว่างขึ้น ใส่เสื้อผ้าสีแดง ส้ม ชมพูเวลาต้องไปคุยงานสำคัญ จะช่วยให้มั่นใจขึ้นนะครับ`);
}
if(earth<8){
tips.push(`ดินของคุณตอนนี้มีแค่ ${earth.toFixed(1)}% เองครับ น้อยมากเลย คลังเงินเล็กมาก คุณหาเงินเก่งนะ แต่เก็บไม่อยู่เลยใช่ไหมครับ? ลองเสริมดินด้วยสีเหลือง น้ำตาล ครีม และทำระบบออมอัตโนมัติ แยกบัญชีให้ชัดเจน`);
}
if(metal<8){
tips.push(`ทองของคุณตอนนี้มีแค่ ${metal.toFixed(1)}% เองครับ น้อยมากเลย คุณอาจจะรู้สึกว่าชีวิตไม่ค่อยมีระเบียบ ขาดวินัยไปหน่อยใช่ไหมครับ? ลองจัดโต๊ะทำงานให้โล่ง เป็นระเบียบ ใส่เสื้อผ้าโทนสีขาว เทา เงินบ่อยๆ หรืองานที่ต้องใช้ความละเอียดอย่างบัญชี ตรวจสอบ กฎหมาย ก็จะช่วยฝึกวินัยให้คุณได้ครับ`);
}
if(water<8){
tips.push(`น้ำของคุณตอนนี้มีแค่ ${water.toFixed(1)}% เองครับ น้อยมากเลย คุณรู้สึกว่าช่วงนี้คิดอะไรไม่ค่อยออก การเงินไม่ค่อยไหลเวียนใช่ไหมครับ? ลองใส่เสื้อผ้าโทนสีดำ น้ำเงิน กรมท่าบ่อยๆ ทำงานที่ต้องสื่อสาร เดินทาง หรือเรียนรู้อะไรใหม่ๆ เพิ่มเติม`);
}
if(wood>=35){
tips.push(`ไม้ของคุณตอนนี้ ${wood.toFixed(1)}% เยอะมากเลยครับ เยอะเกินไปแล้วนะครับ คุณคิดเยอะมาก ทำหลายอย่างพร้อมกัน จนไม่มีอะไรเสร็จเลยใช่ไหมครับ? ต้องมีทองมาตัดแล้วนะครับ เพิ่มระเบียบ ตั้ง KPI ให้ชัด ทำทีละอย่างให้เสร็จ`);
}
if(water>=35){
tips.push(`น้ำของคุณตอนนี้ ${water.toFixed(1)}% เยอะมากเลยครับ น้ำล้นแล้วนะครับ คุณเป็นคนฉลาดมาก แต่คิดมากไปด้วย นอนไม่ค่อยหลับเพราะคิดเยอะใช่ไหมครับ? ต้องมีดินมากั้นแล้วนะครับ สร้างคลังดินให้แข็งแรง แยกบัญชีให้ชัดเจน และมีไฟมาอุ่นให้น้ำไม่เย็นเกินไป`);
}
if(fire>=35){
tips.push(`ไฟของคุณตอนนี้ ${fire.toFixed(1)}% เยอะมากเลยครับ ร้อนไปหน่อยนะครับ ใจร้อนไปหรือเปล่า? ต้องมีน้ำมาดับแล้วนะ ใจเย็นลง`);
}
if(earth>=35){
tips.push(`ดินของคุณตอนนี้ ${earth.toFixed(1)}% เยอะมากเลยครับ มั่นคงมากแต่ยึดติดไปหน่อยใช่ไหมครับ? ต้องมีไม้มาไถแล้วนะครับ ลองทำอะไรใหม่ๆ บ้าง`);
}
if(metal>=35){
tips.push(`ทองของคุณตอนนี้ ${metal.toFixed(1)}% เยอะมากเลยครับ มีระเบียบมาก เข้มงวดเกินไปหรือเปล่าครับ? ต้องมีไฟมาหลอมแล้วนะครับ ผ่อนคลายบ้าง`);
}
if(tips.length===0){
tips.push(`ดวงคุณค่อนข้างสมดุลดีแล้วนะครับ ดีมากเลย รักษาสมดุลนี้ไว้ แล้วเสริมธาตุที่เกี่ยวกับงานที่คุณอยากทำเพิ่มอีกนิดหน่อยก็พอแล้วครับ`);
}
return tips.map((t,i)=><div key={i} className="bg-white p-4 rounded-lg border leading-[1.8]">• {t}</div>);
})()}</div>
<div className="mt-5 text-[12px] text-[#8b5a00]/70 bg-white p-4 rounded-lg leading-[1.8]">
ตอนนี้คุณอายุ {new Date().getFullYear()-r.yr} ปี ย่าง {new Date().getFullYear()-r.yr+1} ปีแล้วนะครับ เป็นวัยที่ควรเริ่มวางระบบให้ชีวิตมั่นคงขึ้นแล้วนะครับ จากเมื่อก่อนคุณลงมือทำเองทุกอย่าง ตอนนี้ลองค่อยๆ เปลี่ยนมาเป็นคนวางระบบแล้วให้คนอื่นช่วยทำดูนะครับ จะได้เหนื่อยน้อยลงแต่ผลลัพธ์มั่นคงขึ้น เป็นกำลังใจให้นะครับ
</div>
</div></div></div></div>
<div className="rounded-[24px] bg-gradient-to-br from-[#1a1508] to-[#0f0e0a] border border-yellow-500/30 p-[1px]"><div className="rounded-[23px] bg-[#121212] p-6 text-center"><h3 className="text-[#f5e6c8] font-bold text-lg">อยากรู้ลึกกว่านี้ไหมครับ?</h3><p className="text-[13px] text-white/60 mt-2">ยังมี <b className="text-[#d4af37]">12 เข็มทิศชีวิต</b> ที่วิเคราะห์อาชีพที่ใช่สำหรับคุณโดยเฉพาะ</p><div className="mt-5 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] p-[1px]"><a href="https://lin.ee/Qtt1m4cC" target="_blank" className="block rounded-[11px] bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 text-center">📲 แอดไลน์มาคุยกันต่อได้เลยนะครับ</a></div></div></div>
</div>
)}
</div></main>
);
}

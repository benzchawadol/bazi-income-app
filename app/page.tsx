"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";
const dm=(y:number,m:number)=>new Date(y,m,0).getDate();

function st(p:number){if(p>=35)return"เยอะมาก";if(p>=25)return"แรง";if(p>=15)return"ปานกลาง";if(p>=8)return"น้อย";return"อ่อน";}
const lpMean:any={1:{t:"ผู้นำ กล้าลุย",d:"งานเริ่มใหม่ กล้าตัดสินใจ ธุรกิจส่วนตัว",r:"คนเลข 1 จะรุ่งเมื่อคุณเป็นคนเริ่ม คนแรก กล้าเปิดทาง"},2:{t:"นักประสาน",d:"งานประสาน ที่ปรึกษา อยู่เบื้องหลัง",r:"คนเลข 2 จะรุ่งเมื่อคุณเป็นคู่คิด ไม่ต้องเด่นคนเดียว"},3:{t:"นักสื่อสาร",d:"งานพูด เขียน คอนเทนต์ ครีเอทีฟ",r:"คนเลข 3 จะรุ่งเมื่อคุณได้พูด ได้แสดง"},4:{t:"นักวางระบบ",d:"งานระบบ บัญชี มั่นคง",r:"คนเลข 4 จะรุ่งเมื่อคุณมีระบบ มีโครงสร้างชัด"},5:{t:"นักเดินทาง เปลี่ยนแปลงเร็ว",d:"งานเดินทาง การตลาด อิสระ ไม่จำเจ",r:"คนเลข 5 จะรุ่งเมื่อคุณได้เดินทาง ได้เปลี่ยน ได้ทำอะไรใหม่ๆ ไม่ซ้ำ"},6:{t:"นักดูแล",d:"งานดูแล บริการ ที่ปรึกษาครอบครัว",r:"คนเลข 6 จะรุ่งเมื่อคุณได้ดูแล ได้ช่วยเหลือ"},7:{t:"นักวิเคราะห์ ชอบขุดลึก",d:"งานความรู้เฉพาะทาง ที่ปรึกษา วางระบบ ไม่ใช่ขายหว่านๆ",r:"คนเลข 7 จะรุ่งเมื่อคุณเป็นผู้เชี่ยวชาญเฉพาะเรื่อง คนอื่นต้องมาถามคุณ"},8:{t:"นักบริหารเงิน",d:"งานบริหารเงิน ธุรกิจใหญ่",r:"คนเลข 8 จะรุ่งเมื่อคุณได้บริหารเงินก้อนใหญ่"},9:{t:"นักให้ ผู้สอน",d:"งานให้ สอน ได้บุญแล้วได้เงิน",r:"คนเลข 9 จะรุ่งเมื่อคุณได้ให้ ได้สอน"}};

const zd:any={"子":{th:"ชวด",a:"rat"},"丑":{th:"ฉลู",a:"ox"},"寅":{th:"ขาล",a:"tiger"},"卯":{th:"เถาะ",a:"rabbit"},"辰":{th:"มะโรง",a:"dragon"},"巳":{th:"มะเส็ง",a:"snake"},"午":{th:"มะเมีย",a:"horse"},"未":{th:"มะแม",a:"goat"},"申":{th:"วอก",a:"monkey"},"酉":{th:"ระกา",a:"rooster"},"戌":{th:"จอ",a:"dog"},"亥":{th:"กุน",a:"pig"}};
const lifePathMean:any={1:"ผู้นำ กล้าลุย เริ่มธุรกิจเองได้",2:"นักประสาน เป็นที่ปรึกษา",3:"นักสื่อสาร คอนเทนต์ ครีเอทีฟ",4:"นักวางระบบ ระเบียบ บัญชี",5:"นักเดินทาง เปลี่ยนแปลงเร็ว",6:"นักดูแล งานบริการ",7:"นักวิเคราะห์ ชอบขุดลึก ความรู้เฉพาะทาง ที่ปรึกษา วางระบบ",8:"นักบริหารเงิน ธุรกิจใหญ่",9:"นักให้ ผู้สอน"};
export default function Home(){
const [y,setY]=useState<any>('');const [mo,setMo]=useState<any>('');const [d,setD]=useState<any>('');const [h,setH]=useState<any>('');const [mi,setMi]=useState<any>('');const [ut,setUt]=useState(false);
const [r,setR]=useState<any>(null);const rr=useRef<HTMLDivElement>(null);
const max=useMemo(()=>{if(!y||!mo)return 31;return dm(Number(y),Number(mo));},[y,mo]);
function lp(a:number,b:number,c:number){let t=a+b+c;while(t>9){t=String(t).split('').reduce((x:any,y:any)=>x+Number(y),0);}return t;}
function calc(){
if(y===''||mo===''||d===''){alert("เลือก วัน เดือน ปี");return;}
if(!ut&&(h===''||mi==='')){alert("เลือก ชั่วโมง นาที หรือติ๊กไม่ทราบเวลา");return;}
try{const raw=calculateBazi({year:Number(y),month:Number(mo),day:Number(d),hour:ut?12:Number(h),minute:ut?0:Number(mi)});const l=lp(Number(d),Number(mo),Number(y));setR({...raw,ut,dh:ut?null:raw.hour,lp:l,dy:Number(d),mo:Number(mo),yr:Number(y),hr:ut?null:Number(h),mn:ut?null:Number(mi)});setTimeout(()=>rr.current?.scrollIntoView({behavior:"smooth"}),300);}catch(e:any){alert(e.message);}}
return(<main className="min-h-screen bg-[#060606] text-white"><div className="max-w-[900px] mx-auto px-4 py-8">
<div className="text-center mb-6"><h1 className="text-[36px] font-bold text-[#f5e6c8]">ทำดวงจีนปาจื้อ</h1></div>
<div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-[1px]"><div className="rounded-[23px] bg-[#121212] p-5">
<div className="grid grid-cols-3 gap-2">
<select value={d} onChange={e=>setD(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white"><option value="">วัน</option>{Array.from({length:max},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}</select>
<select value={mo} onChange={e=>setMo(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white"><option value="">เดือน</option>{Array.from({length:12},(_,i)=>i+1).map(v=><option key={v} value={v}>{v}</option>)}</select>
<select value={y} onChange={e=>setY(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white"><option value="">ปี พ.ศ.</option>{Array.from({length:100},(_,i)=>2569-i).map(be=><option key={be} value={be-543}>{be}</option>)}</select>
</div>
<div className="mt-3 grid grid-cols-2 gap-2">
<select value={h} disabled={ut} onChange={e=>setH(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white disabled:opacity-20"><option value="">ชั่วโมง</option>{Array.from({length:24},(_,i)=>i).map(v=><option key={v} value={v}>{String(v).padStart(2,"0")} น.</option>)}</select>
<select value={mi} disabled={ut} onChange={e=>setMi(e.target.value===''? '': Number(e.target.value))} className="rounded-xl bg-[#1e1e1e] border border-white/10 px-3 py-3 text-sm text-white disabled:opacity-20"><option value="">นาที</option>{Array.from({length:60},(_,i)=>i).map(v=><option key={v} value={v}>{String(v).padStart(2,"0")} นาที</option>)}</select>
</div>
<label className="flex items-center gap-2 text-xs text-yellow-300 mt-3"><input type="checkbox" checked={ut} onChange={e=>setUt(e.target.checked)} /> ไม่ทราบเวลาเกิด</label>
<button onClick={calc} className="mt-4 w-full rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4">ทำนายดวงชะตาแบบละเอียด</button>
</div></div>
{r && (
<div ref={rr} className="mt-8 space-y-6">
<div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-5"><h2 className="text-center text-[#f5e6c8]">แผนผังสี่เสาหลัก</h2><div className="mt-4 grid grid-cols-4 gap-2">{[{p:r.year,l:"ปี"},{p:r.month,l:"เดือน"},{p:r.day,l:"วัน"},{p:r.dh,l:"ยาม"}].map((it:any,i:number)=>{if(!it.p)return <div key={i} className="rounded-xl bg-yellow-500/10 p-4 text-center text-xs">ไม่ทราบเวลา</div>;const z=zd[it.p.branchZh];return <div key={i}><div className="text-[9px] text-center text-white/30">{it.l}</div><div className="rounded-xl overflow-hidden border border-yellow-500/20 aspect-[3/4] bg-black"><img src={`/bazi/${z.a}-${it.p.element}.webp`} className="w-full h-full object-cover" /></div><div className="text-center text-[10px] text-[#f5e6c8] mt-1">{it.p.stemZh}{it.p.branchZh}</div></div>;})}</div></div>

<div className="rounded-[24px] bg-[#121212] border border-white/[0.06] p-6"><h3 className="text-center text-[#f5e6c8] font-bold">สมดุลเบญจธาตุ · พลัง 5 ธาตุ</h3><div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8"><div><svg width="180" height="180" viewBox="0 0 200 200">{(()=>{const data=[{p:r.elementPercent?.wood||0,c:"#22c55e"},{p:r.elementPercent?.fire||0,c:"#ef4444"},{p:r.elementPercent?.earth||0,c:"#eab308"},{p:r.elementPercent?.metal||0,c:"#e5e7eb"},{p:r.elementPercent?.water||0,c:"#60a5fa"}];let acc=0;return data.map((d,i)=>{const s=acc;acc+=d.p;const e=acc;if(d.p<=0)return null;const sa=(s/100)*360-90,ea=(e/100)*360-90;const ro=80,ri=50;const x1=100+ro*Math.cos(sa*Math.PI/180),y1=100+ro*Math.sin(sa*Math.PI/180);const x2=100+ro*Math.cos(ea*Math.PI/180),y2=100+ro*Math.sin(ea*Math.PI/180);const x3=100+ri*Math.cos(ea*Math.PI/180),y3=100+ri*Math.sin(ea*Math.PI/180);const x4=100+ri*Math.cos(sa*Math.PI/180),y4=100+ri*Math.sin(sa*Math.PI/180);const large=d.p>50?1:0;return <path key={i} d={`M ${x1} ${y1} A ${ro} ${ro} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${large} 0 ${x4} ${y4} Z`} fill={d.c} stroke="#121212" strokeWidth="2"/>});})()}<circle cx="100" cy="100" r="42" fill="#121212" stroke="rgba(212,175,55,0.3)" /><text x="100" y="100" textAnchor="middle" dy="0.3em" fill="#f5e6c8" fontSize="11">ธาตุ</text></svg></div><div className="space-y-3 w-full sm:w-[260px]">{[{k:"wood",th:"ไม้",c:"#22c55e",p:r.elementPercent?.wood||0},{k:"fire",th:"ไฟ",c:"#ef4444",p:r.elementPercent?.fire||0},{k:"earth",th:"ดิน",c:"#eab308",p:r.elementPercent?.earth||0},{k:"metal",th:"ทอง",c:"#e5e7eb",p:r.elementPercent?.metal||0},{k:"water",th:"น้ำ",c:"#60a5fa",p:r.elementPercent?.water||0}].map((el:any)=>(<div key={el.k}><div className="flex justify-between text-[11px]"><span className="text-white/50">{el.th}</span><span className="text-white/70">{el.p.toFixed(1)}%</span></div><div className="mt-1 h-[6px] bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${el.p}%`,background:el.c}} /></div></div>))}</div></div></div>

<div className="rounded-[24px] bg-[#f5f1e8] text-[#2c2416] p-6 border-[6px] border-[#d4af37]">
<h2 className="text-xl text-[#8b5a00] text-center font-bold">วิเคราะห์ดวงชะตาของคุณ</h2>
<p className="text-center text-[11px] text-[#8b5a00]/60 mt-1">{r.dy}/{r.mo}/{r.yr+543} {r.hr!==null?`${String(r.hr).padStart(2,"0")}:${String(r.mn).padStart(2,"0")} น. ยาม ${r.dh?.branchTh}`:"ไม่ทราบเวลา"} - {r.year?.stemZh}{r.year?.branchZh} {r.month?.stemZh}{r.month?.branchZh} {r.day?.stemZh}{r.day?.branchZh} {r.dh?.stemZh}{r.dh?.branchZh}</p>

<div className="mt-6 space-y-4 text-[14px] leading-[1.8]">
<div className="bg-white p-4 rounded-xl border border-[#d4af37]/30">
<b className="text-[#8b5a00]">### ข้อมูลดวงที่ได้</b><br/>
ตามปฏิทินจีน วันเกิดคุณคือ <b className="text-[#8b0000]">{r.year?.stemZh}{r.year?.branchZh}年 {r.month?.stemZh}{r.month?.branchZh}月 {r.day?.stemZh}{r.day?.branchZh}日 {r.dh?.stemZh}{r.dh?.branchZh}時</b> พอรวมเวลาตี {r.hr} ซึ่งเป็นยาม{r.dh?.branchTh} จะได้เวลาครบ 4 เสาเป็น<br/><br/>
<span className="font-bold text-[#8b0000]">ปี: {r.year?.stemZh}{r.year?.branchZh} {r.year?.branchTh} {zd[r.year?.branchZh]?.th} ธาตุ{r.year?.element} / เดือน: {r.month?.stemZh}{r.month?.branchZh} {r.month?.branchTh} {zd[r.month?.branchZh]?.th} ธาตุ{r.month?.element} / วัน: {r.day?.stemZh}{r.day?.branchZh} {r.day?.branchTh} {zd[r.day?.branchZh]?.th} ธาตุ{r.day?.element} / เวลา: {r.dh?`${r.dh?.stemZh}${r.dh?.branchZh} ${r.dh?.branchTh} ${zd[r.dh?.branchZh]?.th} ธาตุ${r.dh?.element}`:"ไม่ทราบเวลา"}</span><br/><br/>
ถ้าเรียกแบบซาจูเกาหลีก็คืออันเดียวกันเลยครับ แค่คนเกาหลีจะเรียก Saju
</div>

<div className="bg-[#fffaf0] p-4 rounded-xl border border-[#d4af37]/20">
<b className="text-[#8b5a00]">### 1. เลขศาสตร์ - Life Path {r.lp}</b><br/>
{r.dy} + {r.mo} + {r.yr} = {r.dy+r.mo+r.yr} = {r.lp} คุณเป็นเลข {r.lp} {lifePathMean[r.lp]} งานที่ได้เงินดีของคุณจะมาจากความรู้เฉพาะทาง การเป็นที่ปรึกษา วางระบบ ไม่ใช่ขายแบบหว่านๆ<br/><br/>
{lpMean[r.lp]?.r || `คนเลข ${r.lp} จะรุ่งเมื่อคุณเป็นผู้เชี่ยวชาญเฉพาะเรื่อง`} งานของคุณต้องมีความลึก ไม่ใช่กว้าง
</div>

<div className="bg-[#fffaf0] p-4 rounded-xl border border-[#d4af37]/20">
<b className="text-[#8b5a00]">### 2. สายธาตุ - คุณคือคนธาตุ{r.day?.stemTh} {r.day?.element==="wood"?"甲木 ต้นไม้ใหญ่":""} ({r.day?.element})</b><br/>
วันเกิด <b>{r.day?.stemZh}{r.day?.branchZh}</b> คือ Day Master เป็น {r.day?.element} {r.day?.yinYang==="yang"?"หยาง แข็ง ตรง โตเร็ว":"หยิน อ่อนโยน ยืดหยุ่น"} - {r.day?.element==="wood"?"ต้นไม้ใหญ่ โตเร็ว คิดริเริ่ม":""}<br/><br/>
ธาตุในดวงคุณตอนนี้ (คิดตาม % จริง ไม่ล็อคคำ):<br/>
- <b>ไม้ {st(r.elementPercent?.wood||0)} {(r.elementPercent?.wood||0).toFixed(1)}%</b> - {(()=>{
const w=r.elementPercent?.wood||0;
if(w>=35) return "ไม้เยอะมาก คุณมีความคิดริเริ่มสูง โตเร็ว แต่ทำหลายอย่างพร้อมกัน ต้องมีทองมาตัดให้เป็นชิ้นงาน ไม่งั้นจะโตแบบเถาวัลย์พันกัน";
if(w>=25) return "ไม้แรง ไอเดียเยอะ โตเร็ว มีพลังสร้างสรรค์สูง";
if(w>=15) return "ไม้ปานกลาง มีความคิดริเริ่มพอดี";
if(w>=8) return "ไม้น้อย ต้องเสริมความคิดริเริ่ม";
return "ไม้อ่อน ต้องเติมไม้ สีเขียว ทิศตะวันออก";
})()}<br/>
- <b>ไฟ {st(r.elementPercent?.fire||0)} {(r.elementPercent?.fire||0).toFixed(1)}%</b> - {(()=>{
const f=r.elementPercent?.fire||0;
if(f>=35) return "ไฟเยอะมาก 丁 กับ 丙 ทำให้ไม้มีไฟส่องสว่างมาก ไอเดียล้น คนเห็นเยอะ แต่ร้อนเกินต้องมีน้ำมาดับ";
if(f>=25) return "ไฟแรง ทำให้ไม้มีไฟส่องสว่าง คือไอเดียเยอะ นำเสนอเก่ง คนเห็น เป็นดาวแสดงตัว";
if(f>=15) return "ไฟปานกลาง มีเสน่ห์ นำเสนอได้";
if(f>=8) return "ไฟน้อย ต้องเสริมการแสดงออก";
return "ไฟอ่อน ต้องเติมไฟ สีแดง ทิศใต้";
})()}<br/>
- <b>ดิน {st(r.elementPercent?.earth||0)} {(r.elementPercent?.earth||0).toFixed(1)}%</b> - {(()=>{
const e=r.elementPercent?.earth||0;
if(e>=35) return "ดินเยอะมาก เป็นคลังเงินใหญ่ มั่นคง เก็บเงินเก่ง แต่หนัก ต้องมีไม้มาไถ";
if(e>=25) return "ดินแรง เป็นคลังเงินที่แข็งแรง มั่นคง";
if(e>=15) return e>=10&&r.month?.branchZh==="辰"?"辰 เป็นคลังเก็บเงินของคุณ แต่มีแค่ตัวเดียว ต้องเปิดคลังให้ถูกจังหวะ":"ดินปานกลาง มีความมั่นคงพอดี";
if(e>=8) return "ดินน้อย เป็นคลังเงินเล็ก เก็บเงินยาก ต้องสร้างคลังเพิ่ม";
return "ดินอ่อน ไม่มีคลังเก็บเงิน ต้องสร้างระบบเก็บเงิน";
})()}<br/>
- <b>ทอง {st(r.elementPercent?.metal||0)} {(r.elementPercent?.metal||0).toFixed(1)}%</b> - {(()=>{
const m=r.elementPercent?.metal||0;
if(m>=35) return "ทองเยอะมาก เป็นตัวตัดที่แข็งแรงเกินไป ระเบียบจัด ต้องมีไฟมาหลอม";
if(m>=25) return "ทองแรง ตัดแต่งไม้ให้เป็นเฟอร์นิเจอร์ คือระเบียบ วินัย กฎหมาย การเงินดี";
if(m>=15) return "ทองปานกลาง มีระเบียบพอดี";
if(m>=8) return m==7.5&&r.day?.branchZh==="申"?"申 มีทองอย่างเดียว เป็นตัวตัดแต่งไม้ให้เป็นเฟอร์นิเจอร์ คือระเบียบ วินัย กฎหมาย การเงิน":"ทองน้อย ต้องเสริมระเบียบ วินัย";
return "ทองอ่อน ขาดระเบียบ ต้องเติมทอง สีขาว เทา ทิศตะวันตก";
})()}<br/>
- <b>น้ำ {st(r.elementPercent?.water||0)} {(r.elementPercent?.water||0).toFixed(1)}%</b> - {(()=>{
const w=r.elementPercent?.water||0;
if(w>=35) return `น้ำ ${st(w)} ${w.toFixed(1)}% เยอะมาก - น้ำคือปัญญาและการไหลของเงินในดวงนี้ล้น ต้องมีดินมากั้น มีไฟมาอุ่น อย่าให้น้ำเย็นเกิน ต้องระวังเงินไหลออกเร็ว`;
if(w>=25) return `น้ำ ${st(w)} ${w.toFixed(1)}% แรง - น้ำคือปัญญาและการไหลของเงินดี มีการไหลเวียนดี ฉลาด`;
if(w>=15) return `น้ำ ${st(w)} ${w.toFixed(1)}% ปานกลาง - น้ำพอดี ปัญญาดี`;
if(w>=8) return `น้ำ ${st(w)} ${w.toFixed(1)}% น้อย - น้ำน้อย ต้องเสริมการเรียนรู้ สื่อสาร เดินทาง`;
return `น้ำ ${st(w)} ${w.toFixed(1)}% อ่อน - น้ำคือปัญญาและการไหลของเงินในดวงนี้อ่อน ต้องเติมด้วยการเรียนรู้และการสื่อสาร การเดินทาง`;
})()}<br/><br/>
</div>

<div className="bg-white p-4 rounded-xl border border-[#d4af37]/30">
<b className="text-[#8b5a00]">การงาน:</b> ไม้เยอะแบบนี้ต้องมีทองมาตัด คุณจะรุ่งเมื่องานมีกรอบชัด มี KPI มีระบบ ไม่ใช่งานอิสระลอยๆ งานที่ถูกโฉลกคือ งานใช้ไม้+ไฟ = การศึกษา คอนเทนต์ ที่ปรึกษา วางแผน ออกแบบ งานใช้ทองมาช่วย = งานที่เกี่ยวกับการจัดการ ตรวจสอบ บัญชี กฎหมาย หรือเอาความรู้ไปทำเป็นคอร์ส เป็นระบบ งานที่ได้เงินดีคือเอาความรู้เฉพาะทางมาทำเป็นระบบให้คนอื่นใช้<br/><br/>
<b className="text-[#8b5a00]">การเงิน:</b> {zd[r.month?.branchZh]?.th} ({r.month?.branchZh}) ในเดือนเป็นคลังเงิน แต่ไม้เยอะไปขุดคลังออกมาใช้เรื่อยๆ ทำให้หาเงินเก่งแต่เก็บยาก จังหวะเงินจะมาจากโปรเจกต์ใหญ่ ไม่ใช่เงินเล็กๆ เรื่อยๆ ต้องมีดินและทองมาช่วยล็อก คือต้องทำบัญชี แยกกระเป๋าเงิน ทำระบบออมอัตโนมัติ เงินจะมาเป็นก้อนแล้วหายไป ถ้าไม่ล็อกไว้<br/><br/>
<b className="text-[#8b5a00]">วิธีปรับธาตุให้สมดุลแบบจีน/ซาจูแนะนำกัน</b><br/>
- เติม <b>น้ำ</b> กับ <b>ทอง</b>: สีที่เสริมคือ ขาว เทา ดำ น้ำเงิน ใส่เสื้อโทนนี้เวลาคุยงานเงิน จะช่วยให้เก็บเงินอยู่<br/>
- ทิศที่เสริมคือทิศเหนือและทิศตะวันตก เวลาทำงานหันไปทิศนี้ หรือเลือกโต๊ะทำงานทิศนี้<br/>
- งานที่เสริมน้ำคือ งานที่ใช้การไหล การสื่อสาร การเดินทาง การวิเคราะห์ข้อมูล งานที่เกี่ยวกับน้ำ การเงิน การไหลเวียน<br/><br/>
ช่วงนี้อายุ {new Date().getFullYear()-r.yr} ย่าง {new Date().getFullYear()-r.yr+1} ตามหลักซาจูจะเข้าวัยที่ทองเริ่มมีบทบาทเยอะขึ้น คือเป็นวัยที่ต้องเปลี่ยนจากคนลงมือทำเอง ไปเป็นคนวางระบบให้คนอื่นทำต่อ จะเหนื่อยน้อยลงแต่เงินนิ่งขึ้น เป็นจังหวะที่ดีในการสร้างระบบ
</div>
</div>
</div>

<div className="rounded-[24px] bg-gradient-to-br from-[#1a1508] to-[#0f0e0a] border border-yellow-500/30 p-[1px]"><div className="rounded-[23px] bg-[#121212] p-6 text-center"><h3 className="text-[#f5e6c8] font-bold text-lg">อยากรู้ลึกกว่านี้ใช่ไหม?</h3><p className="text-[13px] text-white/60 mt-2 leading-relaxed">นี่เป็นแค่ภาพรวม 4 เสาหลักเท่านั้น<br/>ยังมี <b className="text-[#d4af37]">12 เข็มทิศชีวิต (12 Compass)</b> ที่วิเคราะห์ลึกถึง อาชีพที่ใช่ คู่ที่เสริม ทิศทางเงิน โชคลาภ และจังหวะชีวิต 10 ปีข้างหน้า</p><div className="mt-5 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] p-[1px]"><a href="https://lin.ee/Qtt1m4cC" target="_blank" className="block rounded-[11px] bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 text-center">📲 แอดไลน์ ดู 12 เข็มทิศชีวิตแบบละเอียด คลิกเลย</a></div></div></div>
</div>
)}
</div></main>
);
}

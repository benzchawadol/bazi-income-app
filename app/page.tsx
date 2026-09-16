"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";

const dm=(y:number,m:number)=>new Date(y,m,0).getDate();
const zd:any={
"子":{th:"ชวด",a:"rat"},"丑":{th:"ฉลู",a:"ox"},
"寅":{th:"ขาล",a:"tiger"},"卯":{th:"เถาะ",a:"rabbit"},
"辰":{th:"มะโรง",a:"dragon"},"巳":{th:"มะเส็ง",a:"snake"},
"午":{th:"มะเมีย",a:"horse"},"未":{th:"มะแม",a:"goat"},
"申":{th:"วอก",a:"monkey"},"酉":{th:"ระกา",a:"rooster"},
"戌":{th:"จอ",a:"dog"},"亥":{th:"กุน",a:"pig"}
};

function status(p:number){
if(p>=35) return "โดดเด่นมาก";
if(p>=25) return "มีพลังมาก";
if(p>=15) return "สมดุลดี";
if(p>=8) return "ค่อนข้างน้อย";
return "อ่อน";
}

const lifePath:any={
1:{t:"ผู้นำ นักบุกเบิก",d:"คุณเป็นคนกล้าคิดกล้าทำ ชอบเริ่มอะไรใหม่ๆ ด้วยตัวเอง",r:"คุณจะรุ่งเมื่อกล้าเป็นคนแรกที่เปิดทาง"},
2:{t:"นักประสาน",d:"คุณละเอียดอ่อน เข้าใจคนอื่นได้ดี เก่งประสานงาน",r:"คุณจะรุ่งเมื่อเป็นคู่คิดที่ดี"},
3:{t:"นักสื่อสาร",d:"คุณมีเสน่ห์ พูดเก่ง เขียนเก่ง ครีเอทีฟ",r:"คุณจะรุ่งเมื่อได้พูด ได้แสดงออก"},
4:{t:"นักวางระบบ",d:"คุณมีระเบียบ รอบคอบ ชอบความเป็นขั้นตอน",r:"คุณจะรุ่งเมื่อมีระบบที่ชัดเจน"},
5:{t:"นักเดินทาง",d:"คุณไม่ชอบจำเจ ชอบอิสระ ชอบการเปลี่ยนแปลง",r:"คุณจะรุ่งเมื่อได้เดินทาง ได้ทำอะไรใหม่ๆ"},
6:{t:"นักดูแล",d:"คุณใจดี มีความรับผิดชอบ รักครอบครัว",r:"คุณจะรุ่งเมื่อได้ดูแลคนอื่น"},
7:{t:"นักวิเคราะห์",d:"คุณชอบคิดลึก ชอบเรียนรู้ ชอบหาคำตอบด้วยตัวเอง",r:"คุณจะรุ่งเมื่อเป็นผู้เชี่ยวชาญเฉพาะเรื่อง คนอื่นต้องมาถามคุณ"},
8:{t:"นักบริหาร",d:"คุณมีเป้าหมายเรื่องเงินชัด มีภาวะผู้นำ",r:"คุณจะรุ่งเมื่อได้บริหารจัดการ"},
9:{t:"ผู้ให้",d:"คุณใจกว้าง มองภาพใหญ่ ชอบช่วยเหลือสังคม",r:"คุณจะรุ่งเมื่อได้ช่วยเหลือผู้อื่น"}
};

export default function Home(){
const [y,setY]=useState<any>('');const [mo,setMo]=useState<any>('');const [d,setD]=useState<any>('');const [h,setH]=useState<any>('');const [mi,setMi]=useState<any>('');const [ut,setUt]=useState(false);
const [r,setR]=useState<any>(null);const rr=useRef<HTMLDivElement>(null);
const max=useMemo(()=>{if(!y||!mo)return 31;return dm(Number(y),Number(mo));},[y,mo]);

function lp(a:number,b:number,c:number){
let t=a+b+c;
while(t>9){t=String(t).split('').reduce((x:any,y:any)=>x+Number(y),0);}
return t;
}

function calc(){
if(y===''||mo===''||d===''){alert("เลือก วัน เดือน ปีเกิด ก่อนนะครับ");return;}
if(!ut&&(h===''||mi==='')){alert("เลือก ชั่วโมง นาที หรือติ๊กไม่ทราบเวลา ก่อนนะครับ");return;}
try{
const raw=calculateBazi({year:Number(y),month:Number(mo),day:Number(d),hour:ut?12:Number(h),minute:ut?0:Number(mi)});
const l=lp(Number(d),Number(mo),Number(y));
setR({...raw,ut,dh:ut?null:raw.hour,lp:l,dy:Number(d),mo:Number(mo),yr:Number(y),hr:ut?null:Number(h),mn:ut?null:Number(mi)});
setTimeout(()=>rr.current?.scrollIntoView({behavior:"smooth"}),300);
}catch(e:any){alert(e.message);}
}

return(
<main className="min-h-screen bg-[#060606] text-white">
<div className="max-w-[900px] mx-auto px-4 py-8">
<div className="text-center mb-6">
<h1 className="text-[34px] font-bold text-[#f5e6c8]">ทำนายดวงจีนปาจื้อ</h1>
<p className="text-[12px] text-white/40 mt-1">วิเคราะห์ด้วยความตั้งใจ อยากให้คุณได้ประโยชน์จริงๆ</p>
</div>

<div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-[1px]">
<div className="rounded-[23px] bg-[#121212] p-5">
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

<div className="rounded-[24px] bg-[#121212] border border-yellow-500/20 p-5">
<h2 className="text-center text-[#f5e6c8]">แผนผังสี่เสาหลักของคุณ</h2>
<div className="mt-4 grid grid-cols-4 gap-3">
{[{p:r.year,l:"ปีเกิด"},{p:r.month,l:"เดือนเกิด"},{p:r.day,l:"วันเกิด"},{p:r.dh,l:"ยามเกิด"}].map((it:any,i:number)=>{
if(!it.p) return <div key={i} className="rounded-xl bg-yellow-500/10 p-4 text-center text-xs">ไม่ทราบเวลา</div>;
const z=zd[it.p.branchZh];
return (
<div key={i} className="text-center">
<div className="text-[9px] text-white/40 mb-1">{it.l}</div>
<div className="rounded-xl overflow-hidden border border-yellow-500/20 aspect-[3/4] bg-black">
<img src={`/bazi/${z.a}-${it.p.element}.webp`} className="w-full h-full object-cover" />
</div>
<div className="mt-2">
<div className="text-[13px] text-[#f5e6c8] font-bold">{it.p.stemZh}{it.p.branchZh}</div>
<div className="text-[10px] text-white/60">{z.th}</div>
</div>
</div>
);
})}
</div>
</div>

<div className="rounded-[24px] bg-[#121212] border border-white/[0.06] p-6">
<h3 className="text-center text-[#f5e6c8] font-bold">สมดุลเบญจธาตุ</h3>
<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8">
<div>
<svg width="180" height="180" viewBox="0 0 200 200">
{(()=>{
const data=[
{p:r.elementPercent?.wood||0,c:"#22c55e"},
{p:r.elementPercent?.fire||0,c:"#ef4444"},
{p:r.elementPercent?.earth||0,c:"#eab308"},
{p:r.elementPercent?.metal||0,c:"#e5e7eb"},
{p:r.elementPercent?.water||0,c:"#60a5fa"}
];
let acc=0;
return data.map((d,i)=>{
const s=acc; acc+=d.p; const e=acc;
if(d.p<=0) return null;
const sa=(s/100)*360-90,ea=(e/100)*360-90;
const ro=80,ri=50;
const x1=100+ro*Math.cos(sa*Math.PI/180),y1=100+ro*Math.sin(sa*Math.PI/180);
const x2=100+ro*Math.cos(ea*Math.PI/180),y2=100+ro*Math.sin(ea*Math.PI/180);
const x3=100+ri*Math.cos(ea*Math.PI/180),y3=100+ri*Math.sin(ea*Math.PI/180);
const x4=100+ri*Math.cos(sa*Math.PI/180),y4=100+ri*Math.sin(sa*Math.PI/180);
const large=d.p>50?1:0;
return <path key={i} d={`M ${x1} ${y1} A ${ro} ${ro} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${large} 0 ${x4} ${y4} Z`} fill={d.c} stroke="#121212" strokeWidth="2"/>;
});
})()}
<circle cx="100" cy="100" r="42" fill="#121212" stroke="rgba(212,175,55,0.3)" />
<text x="100" y="100" textAnchor="middle" dy="0.3em" fill="#f5e6c8" fontSize="11">ธาตุ</text>
</svg>
</div>
<div className="space-y-3 w-full sm:w-[260px]">
{[
{k:"wood",th:"ไม้",c:"#22c55e",p:r.elementPercent?.wood||0},
{k:"fire",th:"ไฟ",c:"#ef4444",p:r.elementPercent?.fire||0},
{k:"earth",th:"ดิน",c:"#eab308",p:r.elementPercent?.earth||0},
{k:"metal",th:"ทอง",c:"#e5e7eb",p:r.elementPercent?.metal||0},
{k:"water",th:"น้ำ",c:"#60a5fa",p:r.elementPercent?.water||0}
].map((el:any)=>{
const s=status(el.p);
return (
<div key={el.k}>
<div className="flex justify-between text-[11px]">
<span className="text-white/60">{el.th} {s}</span>
<span className="text-white/80 font-bold">{el.p.toFixed(1)}%</span>
</div>
<div className="mt-1 h-[6px] bg-white/10 rounded-full overflow-hidden">
<div className="h-full rounded-full" style={{width:`${el.p}%`,background:el.c}} />
</div>
</div>
);
})}
</div>
</div>
</div>

<div className="rounded-[24px] bg-[#f5f1e8] text-[#2c2416] p-6 border-[6px] border-[#d4af37]">
<h2 className="text-xl text-[#8b5a00] text-center font-bold">วิเคราะห์ดวงชะตาของคุณ</h2>
<p className="text-center text-[11px] text-[#8b5a00]/60 mt-2">
วันที่ {r.dy}/{r.mo}/{r.yr+543} {r.hr!==null?`เวลา ${String(r.hr).padStart(2,"0")}:${String(r.mn).padStart(2,"0")} น.`:`ไม่ทราบเวลา`}
</p>

<div className="mt-6 space-y-6 text-[14px] leading-[1.9]">

<div className="bg-white p-5 rounded-xl border">
<h3 className="font-bold text-[#8b5a00]">ดวงของคุณคือ</h3>
<div className="mt-3 space-y-2 text-[13px]">
<div>ปีเกิด: {r.year?.stemZh}{r.year?.branchZh} - นักษัตร {zd[r.year?.branchZh]?.th}</div>
<div>เดือนเกิด: {r.month?.stemZh}{r.month?.branchZh} - นักษัตร {zd[r.month?.branchZh]?.th}</div>
<div>วันเกิด: {r.day?.stemZh}{r.day?.branchZh} - นักษัตร {zd[r.day?.branchZh]?.th} - นี่คือตัวตนของคุณ</div>
{r.dh && <div>ยามเกิด: {r.dh?.stemZh}{r.dh?.branchZh} - นักษัตร {zd[r.dh?.branchZh]?.th}</div>}
</div>
<div className="mt-3 text-[12px] text-[#8b5a00]/70">
Day Master คือ {r.day?.stemZh}{r.day?.branchZh} ธาตุ {r.day?.element} {r.day?.yinYang==="yang"?"หยาง":"หยิน"} - เป็นพลังหลักในตัวคุณ
</div>
</div>

<div className="bg-[#fffaf0] p-5 rounded-xl border">
<h3 className="font-bold text-[#8b5a00]">1. เส้นทางชีวิต - Life Path {r.lp}</h3>
<div className="mt-3">{r.dy} + {r.mo} + {r.yr} = {r.dy+r.mo+r.yr} = {r.lp}</div>
<div className="mt-3"><b>คุณเป็นคนเลข {r.lp} - {lifePath[r.lp]?.t}</b></div>
<div className="mt-2">{lifePath[r.lp]?.d}</div>
<div className="mt-4 bg-white p-3 rounded-lg border text-[#8b5a00] font-bold">{lifePath[r.lp]?.r}</div>
</div>

<div className="bg-[#fffaf0] p-5 rounded-xl border">
<h3 className="font-bold text-[#8b5a00]">2. พลังธาตุในตัวคุณ</h3>
<p className="mt-2 text-[13px]">ธาตุประจำตัวคือธาตุ {r.day?.stemTh} ({r.day?.element})</p>
<div className="mt-4 space-y-4">
{[
{th:"ไม้",en:"wood",p:r.elementPercent?.wood||0},
{th:"ไฟ",en:"fire",p:r.elementPercent?.fire||0},
{th:"ดิน",en:"earth",p:r.elementPercent?.earth||0},
{th:"ทอง",en:"metal",p:r.elementPercent?.metal||0},
{th:"น้ำ",en:"water",p:r.elementPercent?.water||0}
].map((e:any)=>{
const s=status(e.p);
let txt="";
if(e.en==="wood"){
if(e.p>=35) txt="คุณมีความคิดใหม่ๆ เยอะมาก โตเร็ว ไอเดียเยอะ แต่บางครั้งทำหลายอย่างพร้อมกันเกินไป ควรหาทองมาช่วยตัดให้เป็นชิ้นเป็นอัน";
else if(e.p>=25) txt="คุณมีไม้ค่อนข้างเยอะ มีพลังในการริเริ่มสูง โตเร็ว เหมาะกับงานที่ต้องใช้ไอเดียใหม่ๆ";
else if(e.p>=15) txt="คุณมีไม้ในระดับสมดุลดี มีความคิดริเริ่มพอดีๆ";
else if(e.p>=8) txt="คุณมีไม้น้อย อาจจะขาดความกล้าในการเริ่มสิ่งใหม่ๆ";
else txt="คุณมีไม้อ่อนมาก ลองเติมธาตุไม้ด้วยสีเขียว ต้นไม้";
}
if(e.en==="fire"){
if(e.p>=35) txt="ไฟของคุณเยอะมาก คุณโดดเด่น มีเสน่ห์ คนเห็นง่าย แต่บางครั้งอาจจะใจร้อน ต้องใจเย็นลง";
else if(e.p>=25) txt="ไฟของคุณมีพลังมาก นำเสนอเก่ง มีเสน่ห์ เป็นดาวเด่น";
else if(e.p>=15) txt="ไฟของคุณสมดุลดี มีเสน่ห์พอดีๆ";
else if(e.p>=8) txt="ไฟของคุณค่อนข้างน้อย อาจจะไม่ค่อยกล้าแสดงออก";
else txt="ไฟของคุณอ่อน ไม่ค่อยชอบแสดงออก ลองเติมสีแดง";
}
if(e.en==="earth"){
if(e.p>=35) txt="ดินของคุณเยอะมาก มั่นคง เก็บเงินเก่ง น่าเชื่อถือ แต่บางครั้งยึดติดเกินไป";
else if(e.p>=25) txt="ดินของคุณมีพลังมาก มั่นคง เก็บเงินเก่ง เป็นที่พึ่งของคนอื่นได้";
else if(e.p>=15) txt="ดินของคุณสมดุลดี มีความมั่นคงพอดี";
else if(e.p>=8) txt="ดินของคุณค่อนข้างน้อย คลังเงินเล็ก เก็บเงินยากหน่อย";
else txt="ดินของคุณอ่อนมาก ไม่มีคลังเก็บเงินเลย หาเงินเก่งแต่เก็บไม่อยู่";
}
if(e.en==="metal"){
if(e.p>=35) txt="ทองของคุณเยอะมาก มีระเบียบ วินัย เด็ดขาด แต่บางครั้งเข้มงวดเกินไป";
else if(e.p>=25) txt="ทองของคุณมีพลังมาก มีระเบียบ วินัย จัดการเก่ง";
else if(e.p>=15) txt="ทองของคุณสมดุลดี มีระเบียบพอดี";
else if(e.p>=8) txt="ทองของคุณค่อนข้างน้อย อาจจะขาดระเบียบ";
else txt="ทองของคุณอ่อนมาก ขาดระเบียบ ต้องเติมทองด้วยสีขาว";
}
if(e.en==="water"){
if(e.p>=35) txt="น้ำของคุณเยอะมาก คุณฉลาด ปรับตัวเก่ง มีปัญญา แต่บางครั้งคิดมาก เงินไหลออกเร็ว ต้องมีดินมากั้น มีไฟมาอุ่น";
else if(e.p>=25) txt="น้ำของคุณมีพลังมาก ฉลาด ปัญญาดี ไหลเวียนดี ปรับตัวเก่ง";
else if(e.p>=15) txt="น้ำของคุณสมดุลดี มีปัญญาและการไหลเวียนที่ดี";
else if(e.p>=8) txt="น้ำของคุณค่อนข้างน้อย ต้องเติมด้วยการเรียนรู้ สื่อสาร เดินทาง";
else txt="น้ำของคุณอ่อนมาก ต้องเติมด้วยการเรียนรู้เพิ่มเติม การสื่อสาร การเดินทาง";
}
return (
<div key={e.en} className="bg-white p-4 rounded-lg border">
<div className="font-bold">{e.th} {s} {e.p.toFixed(1)}%</div>
<div className="mt-2 text-[13px]">{txt}</div>
</div>
);
})}
</div>
</div>

<div className="bg-white p-5 rounded-xl border">
<h3 className="font-bold text-[#8b5a00]">3. การงาน การเงิน และวิธีปรับสมดุลเฉพาะคุณ</h3>

<div className="mt-4">
<div className="font-bold">การงานของคุณ</div>
<div className="mt-2">
{(()=>{
const wood=r.elementPercent?.wood||0,metal=r.elementPercent?.metal||0,water=r.elementPercent?.water||0;
if(wood>=30 && metal<12) return "ดวงคุณไม้เยอะมากแต่ทองน้อย คุณมีความคิดริเริ่มสูงมาก แต่ขาดตัวตัดให้เป็นชิ้นงาน คุณจะรุ่งเมื่องานมีกรอบชัด มี KPI มีระบบ งานที่ถูกโฉลกคือการศึกษา คอนเทนต์ ที่ปรึกษา วางแผน ออกแบบ แล้วให้คนธาตุทองมาช่วยจัดระบบให้";
if(water>=30) return "ดวงคุณน้ำเยอะมาก คุณฉลาด ปรับตัวเก่ง เหมาะกับงานสื่อสาร เดินทาง วิเคราะห์ข้อมูล งานที่ต้องใช้ปัญญา";
return `ดวงคุณธาตุ ${r.day?.element} เด่น คุณเหมาะกับงานที่ใช้จุดแข็งของธาตุนี้ และควรเสริมธาตุที่อ่อน`;
})()}
</div>
</div>

<div className="mt-5">
<div className="font-bold">การเงินของคุณ</div>
<div className="mt-2">
{(()=>{
const earth=r.elementPercent?.earth||0;
if(earth>=20) return `เดือนเกิดของคุณคือ ${zd[r.month?.branchZh]?.th} ซึ่งเป็นคลังเงิน และดินของคุณ ${status(earth)} ${earth.toFixed(1)}% แข็งแรง คุณเก็บเงินเก่ง มั่นคง`;
if(earth>=10) return `เดือนเกิดของคุณคือ ${zd[r.month?.branchZh]?.th} ซึ่งเป็นคลังเงิน ดินของคุณ ${status(earth)} ${earth.toFixed(1)}% พอดี คุณหาเงินเก่งแต่ต้องระวังใช้จ่าย เงินจะมาเป็นก้อนๆ`;
return `เดือนเกิดของคุณคือ ${zd[r.month?.branchZh]?.th} ซึ่งเป็นคลังเงิน แต่ดินของคุณ ${status(earth)} ${earth.toFixed(1)}% อ่อน คลังเงินเล็ก คุณหาเงินเก่งแต่เก็บยากมาก ต้องสร้างระบบออมอัตโนมัติ`;
})()}
</div>
</div>

<div className="mt-6 p-4 bg-[#fffaf0] rounded-xl border">
<div className="font-bold">วิธีปรับสมดุลเฉพาะดวงคุณ</div>
<div className="mt-3 space-y-2 text-[13px]">
{(()=>{
const wood=r.elementPercent?.wood||0,fire=r.elementPercent?.fire||0,earth=r.elementPercent?.earth||0,metal=r.elementPercent?.metal||0,water=r.elementPercent?.water||0;
let tips:any[]=[];
if(wood<8) tips.push(`ไม้ ${status(wood)} ${wood.toFixed(1)}% อ่อน - เติมไม้ด้วยสีเขียว ทิศตะวันออก`);
if(fire<8) tips.push(`ไฟ ${status(fire)} ${fire.toFixed(1)}% อ่อน - เติมไฟด้วยสีแดง ส้ม ทิศใต้`);
if(earth<8) tips.push(`ดิน ${status(earth)} ${earth.toFixed(1)}% อ่อน - เติมดินด้วยสีเหลือง น้ำตาล ทิศกลาง`);
if(metal<8) tips.push(`ทอง ${status(metal)} ${metal.toFixed(1)}% อ่อน - เติมทองด้วยสีขาว เทา ทิศตะวันตก`);
if(water<8) tips.push(`น้ำ ${status(water)} ${water.toFixed(1)}% อ่อน - เติมน้ำด้วยสีดำ น้ำเงิน ทิศเหนือ`);
if(wood>=35) tips.push(`ไม้ ${status(wood)} ${wood.toFixed(1)}% เยอะเกิน - ต้องมีทองมาตัด เพิ่มระเบียบ`);
if(water>=35) tips.push(`น้ำ ${status(water)} ${water.toFixed(1)}% เยอะเกิน - น้ำล้น ต้องมีดินมากั้น มีไฟมาอุ่น`);
if(tips.length===0) tips.push("ดวงคุณค่อนข้างสมดุลดีแล้วครับ รักษาสมดุลนี้ไว้");
return tips.map((t,i)=><div key={i}>• {t}</div>);
})()}
</div>
<div className="mt-4 text-[12px] text-[#8b5a00]/70">
อายุปัจจุบัน {new Date().getFullYear()-r.yr} ปี ย่าง {new Date().getFullYear()-r.yr+1} ปี เป็นวัยที่ควรเริ่มวางระบบให้ชีวิตมั่นคงขึ้น จะเหนื่อยน้อยลงแต่ผลลัพธ์มั่นคงขึ้นครับ
</div>
</div>

</div>

</div>
</div>

<div className="rounded-[24px] bg-gradient-to-br from-[#1a1508] to-[#0f0e0a] border border-yellow-500/30 p-[1px]">
<div className="rounded-[23px] bg-[#121212] p-6 text-center">
<h3 className="text-[#f5e6c8] font-bold text-lg">อยากรู้ลึกกว่านี้ใช่ไหมครับ?</h3>
<p className="text-[13px] text-white/60 mt-2">
ยังมี <b className="text-[#d4af37]">12 เข็มทิศชีวิต</b> ที่วิเคราะห์ลึกถึงอาชีพที่ใช่สำหรับคุณโดยเฉพาะ
</p>
<div className="mt-5 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] p-[1px]">
<a href="https://lin.ee/Qtt1m4cC" target="_blank" className="block rounded-[11px] bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 text-center">
📲 แอดไลน์ ดู 12 เข็มทิศชีวิตแบบละเอียด
</a>
</div>
</div></div>

</div>
)}
</div></main>
);
}

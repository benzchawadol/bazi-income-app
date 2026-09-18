
"use client";
import { useState, useRef, useMemo } from "react";
import { calculateBazi } from "@/lib/bazi";
const dm=(y:number,m:number)=>new Date(y,m,0).getDate();
const zd:any={"子":{th:"ชวด",a:"rat"},"丑":{th:"ฉลู",a:"ox"},"寅":{th:"ขาล",a:"tiger"},"卯":{th:"เถาะ",a:"rabbit"},"辰":{th:"มะโรง",a:"dragon"},"巳":{th:"มะเส็ง",a:"snake"},"午":{th:"มะเมีย",a:"horse"},"未":{th:"มะแม",a:"goat"},"申":{th:"วอก",a:"monkey"},"酉":{th:"ระกา",a:"rooster"},"戌":{th:"จอ",a:"dog"},"亥":{th:"กุน",a:"pig"}};
function st(p:number){if(p>=35)return"เยอะมาก";if(p>=25)return"ค่อนข้างเยอะ";if(p>=15)return"กำลังดี";if(p>=8)return"น้อยไปหน่อย";return"น้อยมาก";}

const lp:any={
1:{t:"ผู้นำ",d:"กล้าคิดกล้าทำ ชอบเริ่มใหม่ด้วยตัวเอง ไม่ชอบรอใคร",r:"คุณจะรุ่งเมื่อกล้าเป็นคนแรกที่เปิดทาง ไม่ต้องรอพร้อม 100%"},
2:{t:"นักประสาน",d:"ละเอียดอ่อน เข้าใจความรู้สึกคนอื่นเก่ง เป็นที่ปรึกษาที่ดี",r:"คุณจะรุ่งเมื่อได้เป็นคู่คิดที่ดี ไม่ต้องเด่นคนเดียวก็ไปได้ไกล"},
3:{t:"นักสื่อสาร",d:"มีเสน่ห์ พูดเก่ง ครีเอทีฟ คนฟังคุณแล้วรู้สึกดี",r:"คุณจะรุ่งเมื่อได้พูด ได้แสดงออกในสิ่งที่รัก"},
4:{t:"นักวางระบบ",d:"รอบคอบ มีระเบียบ ชอบอะไรเป็นขั้นตอนชัดเจน",r:"คุณจะรุ่งเมื่อมีระบบที่ชัดเจน ไม่ต้องเดา"},
5:{t:"นักเดินทาง",d:"ไม่ชอบจำเจ ชอบอิสระ ชอบเจออะไรใหม่ๆ ตลอดเวลา",r:"คุณจะรุ่งเมื่อได้เดินทาง ได้เปลี่ยนแปลง ไม่ซ้ำซาก"},
6:{t:"นักดูแล",d:"ใจดี มีความรับผิดชอบสูง รักครอบครัวและอยากดูแลคนรอบข้าง",r:"คุณจะรุ่งเมื่อได้ดูแลและเป็นที่พึ่งให้คนอื่น"},
7:{t:"นักวิเคราะห์",d:"ชอบคิดลึก ชอบเรียนรู้ด้วยตัวเอง ไม่ชอบอะไรผิวเผิน",r:"คุณจะรุ่งเมื่อเป็นผู้เชี่ยวชาญเฉพาะเรื่อง จนคนอื่นต้องมาถามคุณ"},
8:{t:"นักบริหาร",d:"มีเป้าหมายเรื่องเงินชัดเจน มีภาวะผู้นำ อยากสร้างอะไรใหญ่ๆ",r:"คุณจะรุ่งเมื่อได้บริหารและจัดการด้วยตัวเอง"},
9:{t:"ผู้ให้",d:"ใจกว้าง มองภาพใหญ่ อยากช่วยเหลือคนจำนวนมาก",r:"คุณจะรุ่งเมื่อได้ช่วยเหลือผู้อื่นอย่างแท้จริง"}
};

function getElementNarrative(en:string, p:number, allPercents:any, dayElement:string){
  const elementTh:any = {wood:"ไม้",fire:"ไฟ",earth:"ดิน",metal:"ทอง",water:"น้ำ"};
  const th = elementTh[en];
  const entries = Object.entries(allPercents).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
  const rank = entries.findIndex(e=>e.k===en) + 1;
  const isStrongest = rank===1;
  const isWeakest = rank===5;
  
  let detail = "";
  // บรรยายตาม % จริง + อันดับในดวง ด้วยภาษาระดับแนวโน้ม ไม่ฟันธง
  if(en==="wood"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% ถือว่ามากที่สุดใน 5 ธาตุ เป็นอันดับ 1 ของดวงคุณ มีแนวโน้มมีไอเดียใหม่ๆ อยู่เสมอและเรียนรู้สิ่งใหม่ได้เร็ว แต่ควรใส่ใจไม่ให้ทำหลายอย่างพร้อมกันจนงานค้างเป็นชิ้นๆ`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวงคุณ เป็นอันดับ 5 อาจมีแนวโน้มไม่ค่อยกล้าเริ่มสิ่งใหม่ๆ ในบางช่วง ควรใส่ใจฝึกความคุ้นชินกับการลงมือเริ่มต้น`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ในดวงคุณ ถือว่า${st(p)} มีความคิดริเริ่ม${p>=15?"อยู่ในระดับพอดี":"ค่อนข้างน้อย"} เหมาะกับงานที่ใช้ไอเดีย`;
  }
  if(en==="fire"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง เป็นอันดับ 1 พลังไฟเด่นชัด จึงมีแนวโน้มสนับสนุนการสื่อสาร การนำเสนอ และการแสดงออก แต่ควรใส่ใจเรื่องความใจร้อนในบางสถานการณ์`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง เป็นอันดับ 5 อาจมีแนวโน้มไม่ถนัดการออกหน้าหรือพรีเซนต์ ควรฝึกฝนเพิ่มเติมหากงานต้องใช้ทักษะนี้`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)} พลังไฟ${p>=25?"ค่อนข้างเด่น":"อยู่ในระดับปานกลาง"} จึงมีแนวโน้มสนับสนุนการสื่อสาร การนำเสนอ และการแสดงออก`;
  }
  if(en==="earth"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง เป็นอันดับ 1 พลังดินอยู่ในระดับสูง จึงควรใส่ใจกับความต่อเนื่องและโครงสร้างในการลงมือทำ พร้อมทั้งเปิดรับสิ่งใหม่ๆ เป็นระยะ เพื่อไม่ให้ยึดติดกับวิธีเดิมมากเกินไป`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง เป็นอันดับ 5 พลังดินอยู่ในระดับไม่สูงนัก จึงควรใส่ใจกับความต่อเนื่องและโครงสร้างในการลงมือทำ`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)} พลังดิน${p>=20?"อยู่ในระดับสูง":"อยู่ในระดับไม่สูงนัก"} จึงควรใส่ใจกับความต่อเนื่องและโครงสร้างในการลงมือทำ`;
  }
  if(en==="metal"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง เป็นอันดับ 1 มีแนวโน้มมีระเบียบและตัดสินใจเด็ดขาด แต่ควรใส่ใจไม่ให้เข้มงวดกับตัวเองและคนรอบข้างมากเกินไป`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง เป็นอันดับ 5 อาจต้องใส่ใจเรื่องความเป็นระบบและระเบียบวินัยในชีวิตประจำวันมากขึ้น`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)} ความเป็นระบบ${p>=15?"อยู่ในระดับพอดี":"ค่อนข้างน้อย"} ควรใส่ใจเสริมความเป็นระบบเพิ่มอีกนิด`;
  }
  if(en==="water"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง เป็นอันดับ 1 มีแนวโน้มปรับตัวเก่งและมีไหวพริบ แต่ควรใส่ใจเรื่องการพักผ่อนและการนอนหลับให้เพียงพอ เพราะอาจคิดมากในบางเรื่อง`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง เป็นอันดับ 5 ควรเผื่อเวลาให้กับการทบทวน การรับข้อมูลใหม่ และการคิดก่อนตัดสินใจ`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)} ความสามารถในการปรับตัว${p>=15?"อยู่ในระดับดี":"พอมี"} ควรใส่ใจเรื่องการเรียนรู้เพิ่มเติม`;
  }
  return detail;
}

const BALANCE_STRONG_TIP:Record<string,(p:number)=>string> = {
  wood:(p)=>`ธาตุไม้ของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง มีแนวโน้มมีไอเดียใหม่ๆ อยู่เสมอ ลองทำทีละงานให้เสร็จก่อนเริ่มงานใหม่ และตั้ง deadline ที่ชัดเจนให้กับแต่ละไอเดีย`,
  fire:(p)=>`ธาตุไฟของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง พลังไฟเด่นชัด จึงมีแนวโน้มสนับสนุนการสื่อสาร การนำเสนอ และการแสดงออก ลองหาเวลาทบทวนก่อนตัดสินใจสำคัญ เพื่อลดความหุนหันพลันแล่น`,
  earth:(p)=>`ธาตุดินของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง พลังดินอยู่ในระดับสูง จึงควรใส่ใจกับความต่อเนื่องและโครงสร้างในการลงมือทำ ลองเปิดรับสิ่งใหม่ๆ เป็นระยะ เพื่อไม่ให้ยึดติดกับวิธีเดิมมากเกินไป`,
  metal:(p)=>`ธาตุทองของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง มีแนวโน้มมีระเบียบและเด็ดขาดมาก ลองผ่อนปรนกับตัวเองและคนรอบข้างเป็นครั้งคราว`,
  water:(p)=>`ธาตุน้ำของคุณมี ${p.toFixed(1)}% มากที่สุดในดวง มีแนวโน้มปรับตัวเก่งแต่คิดมาก ลองกำหนดเวลาพักและทบทวนความคิดเป็นประจำ เพื่อไม่ให้คิดวนซ้ำ`,
};
const BALANCE_WEAK_TIP:Record<string,(p:number)=>string> = {
  wood:(p)=>`ธาตุไม้ของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง อาจต้องใส่ใจเรื่องการลงมือเริ่มสิ่งใหม่ ลองตั้งเป้าหมายเล็กๆ ที่ทำได้จริงในแต่ละสัปดาห์ เพื่อฝึกความคุ้นชินกับการเริ่มต้น`,
  fire:(p)=>`ธาตุไฟของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง อาจต้องใส่ใจเรื่องการนำเสนอตัวเอง ลองฝึกพูดหรือพรีเซนต์งานสั้นๆ เป็นประจำ`,
  earth:(p)=>`ธาตุดินของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง พลังดินอยู่ในระดับไม่สูงนัก จึงควรใส่ใจกับความต่อเนื่องและโครงสร้างในการลงมือทำ ลองสร้างกิจวัตรที่ทำซ้ำทุกวัน เช่น เวลาตรวจสอบงานหรือทบทวนแผนในแต่ละสัปดาห์`,
  metal:(p)=>`ธาตุทองของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง อาจต้องใส่ใจเรื่องความเป็นระบบ ลองใช้ checklist หรือกำหนด deadline ที่ชัดเจนสำหรับงานแต่ละอย่าง`,
  water:(p)=>`ธาตุน้ำของคุณมี ${p.toFixed(1)}% น้อยที่สุดในดวง ควรเผื่อเวลาให้กับการทบทวน การรับข้อมูลใหม่ และการคิดก่อนตัดสินใจ ลองกำหนดเวลาทบทวนหรือเรียนรู้สิ่งใหม่ๆ เป็นประจำ เช่น สัปดาห์ละครั้ง`,
};
function getBalanceTips(allPercents:any){
  const entries = Object.entries(allPercents).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
  const strongest = entries[0];
  const weakest = entries[entries.length-1];
  const tips:string[] = [];
  if(BALANCE_STRONG_TIP[strongest.k]) tips.push(BALANCE_STRONG_TIP[strongest.k](strongest.v));
  if(weakest.k!==strongest.k && BALANCE_WEAK_TIP[weakest.k]) tips.push(BALANCE_WEAK_TIP[weakest.k](weakest.v));
  return tips;
}

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
<div className="bg-[#fffaf0] p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">1. ข้อมูลเสริมจากเลขศาสตร์ (Life Path {r.lp})</h3><div className="mt-1 text-[11px] text-[#8b5a00]/60">เป็นการวิเคราะห์แยกจากหลักปาจื้อ ใช้เป็นข้อมูลเสริมประกอบการอ่านเท่านั้น</div><div className="mt-3 text-[13px]">{r.dy}+{r.mo}+{r.yr}={r.dy+r.mo+r.yr}={r.lp}</div><div className="mt-3"><b>คุณเป็นคนเลข {r.lp} - {lp[r.lp]?.t}</b> ครับ</div><div className="mt-2">{lp[r.lp]?.d}</div><div className="mt-4 bg-white p-4 rounded-lg border text-[#8b5a00] font-bold">{lp[r.lp]?.r}</div></div>
<div className="bg-[#fffaf0] p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">2. พลังธาตุในตัวคุณ ผมเล่าให้ฟังแบบละเอียดเลยนะครับ</h3><div className="mt-4 space-y-4">{[
{th:"ไม้",en:"wood",p:r.elementPercent?.wood||0},
{th:"ไฟ",en:"fire",p:r.elementPercent?.fire||0},
{th:"ดิน",en:"earth",p:r.elementPercent?.earth||0},
{th:"ทอง",en:"metal",p:r.elementPercent?.metal||0},
{th:"น้ำ",en:"water",p:r.elementPercent?.water||0}
].map((e:any)=>{
return <div key={e.en} className="bg-white p-4 rounded-lg border"><div className="font-bold text-[#8b5a00]">{e.th} {st(e.p)} {e.p.toFixed(1)}% {(()=>
{const entries = Object.entries(r.elementPercent).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
const rank = entries.findIndex(x=>x.k===e.en)+1;
return rank===1 ? "(เด่นสุดอันดับ 1)" : rank===5 ? "(น้อยสุดอันดับ 5)" : `(อันดับ ${rank})`;
})()}</div><div className="mt-2 text-[13px] leading-[1.8]">{getElementNarrative(e.en, e.p, r.elementPercent, r.day?.element)}</div></div>;
})}</div></div>
<div className="bg-white p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">3. การงาน การเงิน และวิธีปรับสมดุลเฉพาะดวงคุณเลยครับ</h3>
<div className="mt-6"><div className="font-bold">การงานของคุณเป็นแบบนี้นะครับ</div><div className="mt-2 text-[13px] leading-[1.8]">{(()=>{
const wood=r.elementPercent?.wood||0,metal=r.elementPercent?.metal||0,water=r.elementPercent?.water||0,fire=r.elementPercent?.fire||0;
const entries = Object.entries(r.elementPercent).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
const strongest = entries[0];
const elTh:any={wood:"ไม้",fire:"ไฟ",earth:"ดิน",metal:"ทอง",water:"น้ำ"};
if(wood>=30 && metal<12) return `ไม้ในดวงคุณโดดเด่นกว่าธาตุทองมาก (ดูสัดส่วน % ได้จากพลังธาตุด้านบน) มีแนวโน้มทำให้คุณมีไอเดียใหม่ๆ อยู่เสมอ แต่อาจทำหลายอย่างพร้อมกันจนงานไม่เสร็จเป็นชิ้นเป็นอัน งานที่มีกรอบชัดเจนและมี KPI จะช่วยให้คุณทำงานได้มีประสิทธิภาพมากขึ้น`;
if(water>=30) return `น้ำในดวงคุณโดดเด่นเป็นอันดับ 1 มีแนวโน้มทำให้คุณปรับตัวเก่งและมีไหวพริบ เหมาะกับงานที่ต้องสื่อสาร เดินทาง หรือวิเคราะห์ข้อมูลที่เปลี่ยนแปลงบ่อย`;
if(fire>=30) return `ไฟในดวงคุณโดดเด่นเป็นอันดับ 1 พลังไฟเด่นชัด จึงมีแนวโน้มสนับสนุนการสื่อสาร การนำเสนอ และการแสดงออก เหมาะกับงานขาย พรีเซนต์ หรืองานที่ต้องออกหน้า`;
return `ธาตุ${elTh[strongest.k]||strongest.k}เป็นธาตุที่โดดเด่นที่สุดในดวงคุณ มีแนวโน้มเหมาะกับงานที่ได้ใช้จุดแข็งของธาตุนี้เป็นหลัก`;
})()}</div></div>
<div className="mt-6"><div className="font-bold">การเงินของคุณเป็นแบบนี้นะครับ</div><div className="mt-2 text-[13px] leading-[1.8]">{(()=>{
const elTh:any={wood:"ไม้",fire:"ไฟ",earth:"ดิน",metal:"ทอง",water:"น้ำ"};
const wealthEl = (Object.entries(r.tenGodByElement||{}) as any[]).find(([,v]:any)=>v==="wealth")?.[0];
const wealthPct = wealthEl ? (r.elementPercent?.[wealthEl]||0) : 0;
const entries = Object.entries(r.elementPercent).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
const wealthRank = entries.findIndex(e=>e.k===wealthEl)+1;
if(wealthPct>=25) return `ธาตุที่สัมพันธ์กับพลังด้านทรัพย์ของคุณคือธาตุ${elTh[wealthEl]||wealthEl} มีสัดส่วน ${wealthPct.toFixed(1)}% อยู่ในอันดับ ${wealthRank} จาก 5 ธาตุ จึงถือว่าเรื่องทรัพย์เป็นพลังที่ค่อนข้างเด่นของดวง การวิเคราะห์เรื่องเงินให้ละเอียดกว่านี้ควรดูร่วมกับองค์ประกอบอื่นของดวงด้วยครับ`;
if(wealthPct>=12) return `ธาตุที่สัมพันธ์กับพลังด้านทรัพย์ของคุณคือธาตุ${elTh[wealthEl]||wealthEl} มีสัดส่วน ${wealthPct.toFixed(1)}% อยู่ในอันดับ ${wealthRank} จาก 5 ธาตุ จึงถือว่าเรื่องทรัพย์อยู่ในระดับปานกลางของดวง การวิเคราะห์เรื่องเงินให้ละเอียดกว่านี้ควรดูร่วมกับองค์ประกอบอื่นของดวงด้วยครับ`;
return `ธาตุที่สัมพันธ์กับพลังด้านทรัพย์ของคุณคือธาตุ${elTh[wealthEl]||wealthEl} มีสัดส่วน ${wealthPct.toFixed(1)}% อยู่ในอันดับ ${wealthRank} จาก 5 ธาตุ จึงถือว่าพลังด้านทรัพย์ไม่ได้เป็นจุดเด่นของดวง การวิเคราะห์เรื่องเงินให้ละเอียดกว่านี้ควรดูร่วมกับองค์ประกอบอื่นของดวงด้วยครับ`;
})()}</div></div>
<div className="mt-6 p-5 bg-[#fffaf0] rounded-xl border"><div className="font-bold text-[#8b5a00]">วิธีปรับสมดุลตามธาตุในดวงคุณ</div><div className="mt-4 space-y-4 text-[13px] leading-[1.8]">{getBalanceTips(r.elementPercent).map((t,i)=><div key={i} className="bg-white p-4 rounded-lg border leading-[1.8]">• {t}</div>)}</div></div>
</div></div></div>
<div className="rounded-[24px] bg-gradient-to-br from-[#1a1508] to-[#0f0e0a] border border-yellow-500/30 p-[1px]"><div className="rounded-[23px] bg-[#121212] p-6 text-center"><h3 className="text-[#f5e6c8] font-bold text-lg">อยากรู้ลึกกว่านี้ไหมครับ?</h3><p className="text-[13px] text-white/60 mt-2">ยังมี <b className="text-[#d4af37]">12 เข็มทิศชีวิต</b> ที่วิเคราะห์อาชีพที่ใช่สำหรับคุณโดยเฉพาะ</p><div className="mt-5 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] p-[1px]"><a href="https://lin.ee/Qtt1m4cC" target="_blank" className="block rounded-[11px] bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 text-center">📲 แอดไลน์มาคุยกันต่อได้เลยนะครับ</a></div></div></div>
</div>
)}
</div></main>
);
}

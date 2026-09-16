
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

function getDynamicAgeAdvice(age:number, dayElement:string, dayBranchTh:string, elementPercent:any, lpNum:number){
  const entries = Object.entries(elementPercent).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
  const strongest = entries[0];
  const weakest = entries[entries.length-1];
  const elementTh:any = {wood:"ไม้",fire:"ไฟ",earth:"ดิน",metal:"ทอง",water:"น้ำ"};
  const dayTh = elementTh[dayElement] || dayElement;
  const strongTh = elementTh[strongest.k] || strongest.k;
  const weakTh = elementTh[weakest.k] || weakest.k;
  
  // ไม่ล็อกตามช่วงอายุแล้ว แต่คิดจากอายุจริง + ธาตุประจำตัว + ธาตุเด่นสุด
  let lifePhase = "";
  if(age < 20) lifePhase = `คุณอายุ ${age} ปีเองครับ ยังอยู่ในวัยค้นหาตัวเองเลย วัยนี้เป็นช่วงที่ธาตุ${dayTh}ของคุณกำลังก่อตัว`;
  else if(age < 30) lifePhase = `คุณอายุ ${age} ปี ย่าง ${age+1} ปี เป็นวัยที่ธาตุ${dayTh}ของคุณกำลังเริ่มฉายแวว หลังจากลองผิดลองถูกมา`;
  else lifePhase = `คุณอายุ ${age} ปี ย่าง ${age+1} ปี เป็นวัยที่ธาตุ${dayTh}ของคุณเริ่มมั่นคงแล้ว`;

  // ใส่ความแตกต่างตามดวงจริง
  return `${lifePhase} ตอนนี้พลังที่เด่นที่สุดในดวงคุณคือธาตุ${strongTh} มีถึง ${strongest.v.toFixed(1)}% ซึ่งมากกว่าธาตุอื่นๆ ทั้งหมดเลย ส่วนธาตุที่น้อยที่สุดคือธาตุ${weakTh} มีแค่ ${weakest.v.toFixed(1)}% เองครับ สำหรับคนธาตุ${dayTh}วัน${dayBranchTh}แบบคุณที่มี Life Path ${lpNum} ในวัย ${age} ปีนี้ สิ่งที่ควรโฟกัสจริงๆ คือการเอาพลัง${strongTh}ที่เยอะอยู่แล้ว มาปิดจุดอ่อนธาตุ${weakTh}ที่น้อยอยู่ ไม่ใช่แค่ทำตามอายุอย่างเดียว คุณเคยรู้สึกไหมครับว่าช่วงนี้พลัง${strongTh}ของคุณล้นจนทำให้เรื่อง${weakTh}สะดุด? ลองปรับตรงนี้ดูนะครับ จะเห็นผลเร็วกว่าการวางระบบตามอายุอย่างเดียวเยอะเลยครับ`;
}

function getElementNarrative(en:string, p:number, allPercents:any, dayElement:string){
  const elementTh:any = {wood:"ไม้",fire:"ไฟ",earth:"ดิน",metal:"ทอง",water:"น้ำ"};
  const th = elementTh[en];
  const entries = Object.entries(allPercents).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
  const rank = entries.findIndex(e=>e.k===en) + 1;
  const isStrongest = rank===1;
  const isWeakest = rank===5;
  
  let detail = "";
  // ไม่ล็อกแค่ 2 คำตอบ แต่บรรยายตาม % จริง + อันดับในดวง
  if(en==="wood"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% ถือว่ามากที่สุดใน 5 ธาตุเลยครับ เป็นอันดับ 1 ของดวงคุณเลยนะ ไอเดียคุณเยอะมาก คิดอะไรใหม่ๆ ได้ตลอดเวลา คุณเป็นคนธาตุ${elementTh[dayElement]}แต่ดันมีไม้เด่นขนาดนี้ แสดงว่าคุณโตเร็ว เรียนรู้เร็ว แต่จุดที่ต้องระวังคือคุณทำหลายอย่างพร้อมกันเกินไป จนไม่มีอะไรเสร็จเป็นชิ้นเป็นอันเลยใช่ไหมครับ?`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเป็นอันดับ 5 ในดวงคุณเลย คุณอาจจะรู้สึกว่าไม่ค่อยกล้าเริ่มอะไรใหม่ๆ ไม่ค่อยมีความคิดใหม่ๆ ช่วงนี้ชีวิตดูนิ่งๆ ไปหน่อยใช่ไหมครับ?`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ในดวงคุณ ถือว่า${st(p)}นะครับ มีความคิดริเริ่ม${p>=15?"พอดีๆ":"น้อยไปหน่อย"} เหมาะกับงานที่ใช้ไอเดีย`;
  }
  if(en==="fire"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% มากที่สุดในดวงเลยครับ เป็นอันดับ 1 เลย คุณโดดเด่น มีเสน่ห์มาก คนเห็นคุณง่าย เป็นดาวเด่นในที่ทำงานเลยใช่ไหมครับ? แต่บางทีก็ใจร้อนไปหน่อย ต้องระวังตรงนี้`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเป็นอันดับ 5 เลย คุณเป็นคนเงียบๆ ไม่ค่อยชอบให้ใครมาสนใจ ไม่ค่อยกล้าพรีเซนต์ใช่ไหมครับ?`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)}นะครับ มีเสน่ห์${p>=25?"มาก":"พอดีๆ"} เหมาะกับงานที่ต้องออกหน้า`;
  }
  if(en==="earth"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% มากที่สุดเป็นอันดับ 1 เลยครับ คุณเป็นคนมั่นคงมาก เก็บเงินเก่ง น่าเชื่อถือ เป็นที่พึ่งของคนอื่นได้ดีเลย แต่บางทีก็ยึดติดกับอะไรเดิมๆ เกินไป`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเป็นอันดับ 5 เลย คลังเงินเล็กมาก คุณหาเงินเก่งนะ แต่เก็บไม่อยู่เลยใช่ไหมครับ? เงินมาแล้วก็ออกไปเร็วมาก`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)}นะครับ ความมั่นคงทางการเงิน${p>=20?"ดีมาก":"พอมี"} ต้องวางระบบให้ดีขึ้น`;
  }
  if(en==="metal"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% มากที่สุดเป็นอันดับ 1 เลยครับ คุณเป็นคนมีระเบียบ มีวินัย เด็ดขาดมาก แต่บางครั้งเข้มงวดกับตัวเองและคนอื่นเกินไปหรือเปล่า?`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเป็นอันดับ 5 เลย คุณอาจจะรู้สึกว่าชีวิตไม่ค่อยมีระเบียบเท่าไหร่ ขาดวินัยไปหน่อย ทำอะไรไม่ค่อยเป็นระบบใช่ไหมครับ?`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)}นะครับ มีระเบียบ${p>=15?"พอดีๆ":"น้อยไปหน่อย"} ต้องเสริมวินัยอีกนิด`;
  }
  if(en==="water"){
    if(isStrongest) detail = `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% มากที่สุดเป็นอันดับ 1 เลยครับ น้ำล้นแล้วนะครับ คุณเป็นคนฉลาดมาก ปรับตัวเก่ง มีปัญญา แต่คิดมากไปด้วย นอนไม่ค่อยหลับเพราะคิดเยอะใช่ไหมครับ? เงินก็ไหลออกเร็วด้วย ต้องมีดินมากั้นแล้วนะครับ`;
    else if(isWeakest) detail = `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เท่านั้นเอง น้อยที่สุดเป็นอันดับ 5 เลย คุณรู้สึกว่าช่วงนี้คิดอะไรไม่ค่อยออก การเงินไม่ค่อยไหลเวียน ต้องคิดนานกว่าจะได้คำตอบใช่ไหมครับ?`;
    else detail = `ธาตุ${th}ของคุณมี ${p.toFixed(1)}% เป็นอันดับ ${rank} ถือว่า${st(p)}นะครับ ปัญญาและการไหลเวียน${p>=15?"ดี":"น้อยไปหน่อย"} ต้องเติมด้วยการเรียนรู้`;
  }
  return detail;
}

function getBalanceTip(en:string, p:number, allPercents:any){
  const elementTh:any = {wood:"ไม้",fire:"ไฟ",earth:"ดิน",metal:"ทอง",water:"น้ำ"};
  const th = elementTh[en];
  if(p < 8){
    if(en==="wood") return `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เองครับ น้อยที่สุดในดวงเลย คุณอาจจะรู้สึกว่าไม่ค่อยกล้าเริ่มอะไรใหม่ๆ ใช่ไหมครับ? ลองเริ่มจากอะไรง่ายๆ ก่อนนะครับ เช่น หาต้นไม้เล็กๆ มาวางที่โต๊ะทำงาน ใส่เสื้อผ้าโทนสีเขียวบ่อยๆ หรืองานที่ต้องใช้ความคิดสร้างสรรค์มากขึ้น จะช่วยเสริมพลัง${th}ให้คุณกล้าลองอะไรใหม่ๆ มากขึ้นนะครับ`;
    if(en==="fire") return `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เองครับ น้อยที่สุดเลย คุณเป็นคนไม่ค่อยชอบออกหน้ากล้อง ไม่ค่อยกล้าพรีเซนต์ใช่ไหมครับ? ลองเพิ่มแสงสว่างในบ้านให้สว่างขึ้น ใส่เสื้อผ้าสีแดง ส้ม ชมพูเวลาต้องไปคุยงานสำคัญ จะช่วยให้มั่นใจขึ้นนะครับ`;
    if(en==="earth") return `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เองครับ น้อยที่สุดเลย คลังเงินเล็กมาก คุณหาเงินเก่งนะ แต่เก็บไม่อยู่เลยใช่ไหมครับ? ลองใส่เสื้อผ้าโทนสีเหลือง น้ำตาล ครีม และทำระบบออมอัตโนมัติ แยกบัญชีให้ชัดเจนเลยนะครับ`;
    if(en==="metal") return `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เองครับ น้อยที่สุดเลย คุณอาจจะรู้สึกว่าชีวิตไม่ค่อยมีระเบียบ ขาดวินัยไปหน่อยใช่ไหมครับ? ลองจัดโต๊ะทำงานให้โล่ง เป็นระเบียบ ใส่เสื้อผ้าโทนสีขาว เทา เงินบ่อยๆ หรืองานที่ต้องใช้ความละเอียดอย่างบัญชี ตรวจสอบ กฎหมาย ก็จะช่วยฝึกวินัยให้คุณได้ครับ`;
    if(en==="water") return `ธาตุ${th}ของคุณมีแค่ ${p.toFixed(1)}% เองครับ น้อยที่สุดเลย คุณรู้สึกว่าช่วงนี้คิดอะไรไม่ค่อยออก การเงินไม่ค่อยไหลเวียนใช่ไหมครับ? ลองใส่เสื้อผ้าโทนสีดำ น้ำเงิน กรมท่าบ่อยๆ ทำงานที่ต้องสื่อสาร เดินทาง หรือเรียนรู้อะไรใหม่ๆ เพิ่มเติมนะครับ`;
  }
  if(p >= 35){
    if(en==="wood") return `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% เยอะที่สุดในดวงเลยครับ ล้นแล้วนะครับ คุณคิดเยอะมาก ทำหลายอย่างพร้อมกัน จนไม่มีอะไรเสร็จเป็นชิ้นเป็นอันเลยใช่ไหมครับ? ต้องมีทองมาตัดแล้วนะครับ เพิ่มระเบียบให้ชีวิต ตั้ง KPI ให้ชัด ทำทีละอย่างให้เสร็จ อย่าทำหลายอย่างพร้อมกัน ลองหาเพื่อนที่เป็นธาตุทองมาช่วยจัดระบบให้ดูนะครับ`;
    if(en==="fire") return `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% เยอะที่สุดเลยครับ ร้อนไปหน่อยนะครับ ใจร้อนไปหรือเปล่า? หงุดหงิดง่ายไหมครับ? ต้องมีน้ำมาดับแล้วนะ ใจเย็นลง ฟังคนอื่นให้มากขึ้น ดื่มน้ำเยอะๆ อยู่ใกล้ๆ น้ำจะช่วยให้ใจเย็นลงนะครับ`;
    if(en==="earth") return `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% เยอะที่สุดเลยครับ มั่นคงมากแต่ยึดติดไปหน่อยหรือเปล่าครับ? ไม่ค่อยอยากเปลี่ยนแปลงอะไรเดิมๆ ใช่ไหมครับ? ต้องมีไม้มาไถแล้วนะครับ ลองทำอะไรใหม่ๆ ที่ไม่เคยทำบ้าง`;
    if(en==="metal") return `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% เยอะที่สุดเลยครับ มีระเบียบมาก เข้มงวดมาก แต่บางทีเข้มงวดกับตัวเองและคนอื่นเกินไปหรือเปล่าครับ? ต้องมีไฟมาหลอมแล้วนะครับ ผ่อนคลายบ้าง อย่าเครียดเกินไปนะครับ`;
    if(en==="water") return `ธาตุ${th}ของคุณมีถึง ${p.toFixed(1)}% เยอะที่สุดเลยครับ น้ำล้นแล้วนะครับ คุณเป็นคนฉลาดมาก แต่คิดมากไปด้วย นอนไม่ค่อยหลับเพราะคิดเยอะใช่ไหมครับ? เงินก็ไหลออกเร็วด้วย ต้องมีดินมากั้นแล้วนะครับ สร้างคลังดินให้แข็งแรง แยกบัญชีให้ชัดเจน และมีไฟมาอุ่นให้น้ำไม่เย็นเกินไป`;
  }
  return "";
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
<div className="bg-[#fffaf0] p-5 rounded-xl border"><h3 className="font-bold text-[#8b5a00]">1. เส้นทางชีวิต - Life Path {r.lp}</h3><div className="mt-3 text-[13px]">{r.dy}+{r.mo}+{r.yr}={r.dy+r.mo+r.yr}={r.lp}</div><div className="mt-3"><b>คุณเป็นคนเลข {r.lp} - {lp[r.lp]?.t}</b> ครับ</div><div className="mt-2">{lp[r.lp]?.d} คุณเคยรู้สึกแบบนี้บ้างไหมครับ?</div><div className="mt-4 bg-white p-4 rounded-lg border text-[#8b5a00] font-bold">{lp[r.lp]?.r} ลองทำดูนะครับ คุณจะเหนื่อยน้อยลงแต่ได้ผลมากขึ้น</div></div>
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
if(wood>=30 && metal<12) return `คุณเป็นคนไม้เด่น ${wood.toFixed(1)}% แต่ทองน้อย ${metal.toFixed(1)}% คุณไอเดียเยอะมากแต่ขาดตัวตัดให้เป็นชิ้นงาน คุณเคยรู้สึกไหมว่าทำหลายอย่างพร้อมกันแต่ไม่เสร็จ? คุณจะรุ่งเมื่องานมีกรอบชัด มี KPI ชัดเจน`;
if(water>=30) return `ดวงคุณน้ำเด่น ${water.toFixed(1)}% เป็นอันดับ 1 ของดวงเลย คุณฉลาด ปรับตัวเก่ง เหมาะกับงานสื่อสาร เดินทาง วิเคราะห์ข้อมูล งานที่ต้องปรับตัวบ่อยๆ`;
if(fire>=30) return `ดวงคุณไฟเด่น ${fire.toFixed(1)}% เป็นอันดับ 1 เลย คุณโดดเด่น มีเสน่ห์มาก เหมาะกับงานขาย พรีเซนต์ ออกหน้ากล้อง`;
return `ดวงคุณธาตุ${r.day?.element}เด่น และธาตุ${strongest.k}เด่นสุด ${strongest.v.toFixed(1)}% คุณเหมาะกับงานที่ใช้จุดแข็งธาตุ${strongest.k}นี้เป็นหลัก`;
})()}</div></div>
<div className="mt-6"><div className="font-bold">การเงินของคุณเป็นแบบนี้นะครับ</div><div className="mt-2 text-[13px] leading-[1.8]">{(()=>{
const earth=r.elementPercent?.earth||0;
const monthName=zd[r.month?.branchZh]?.th;
const entries = Object.entries(r.elementPercent).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
const earthRank = entries.findIndex(e=>e.k==="earth")+1;
if(earth>=20) return `เดือนเกิดของคุณคือ ${monthName} ซึ่งเป็นคลังเงินของคุณเลยครับ และดินของคุณ ${earth.toFixed(1)}% ถือว่าแข็งแรง เป็นอันดับ ${earthRank} ของดวงเลย เก็บเงินเก่งนะ มีความมั่นคงทางการเงิน`;
if(earth>=10) return `เดือนเกิดของคุณคือ ${monthName} ซึ่งเป็นคลังเงิน ดินของคุณ ${earth.toFixed(1)}% เป็นอันดับ ${earthRank} พอดีๆ คุณหาเงินเก่งแต่ระวังใช้จ่าย เงินมักจะมาเป็นก้อนใหญ่ๆ`;
return `เดือนเกิดของคุณคือ ${monthName} ซึ่งเป็นคลังเงิน แต่ดินของคุณตอนนี้ ${earth.toFixed(1)}% น้อยมาก เป็นอันดับ ${earthRank} น้อยสุดเลย คลังเล็ก เก็บยาก ต้องสร้างระบบออมอัตโนมัติ`;
})()}</div></div>
<div className="mt-6 p-5 bg-[#fffaf0] rounded-xl border"><div className="font-bold text-[#8b5a00]">วิธีปรับสมดุลเฉพาะดวงคุณเลยครับ ผมตั้งใจเขียนให้คุณโดยเฉพาะเลยนะ</div><div className="mt-4 space-y-4 text-[13px] leading-[1.8]">{(()=>{
const wood=r.elementPercent?.wood||0,fire=r.elementPercent?.fire||0,earth=r.elementPercent?.earth||0,metal=r.elementPercent?.metal||0,water=r.elementPercent?.water||0;
const all = r.elementPercent;
let tips:any[]=[];
[["wood",wood],["fire",fire],["earth",earth],["metal",metal],["water",water]].forEach(([en,p]:any)=>{
  const t = getBalanceTip(en as string, p as number, all);
  if(t) tips.push(t);
});
if(tips.length===0){
  const entries = Object.entries(all).map(([k,v]:any)=>({k,v:v as number})).sort((a,b)=>b.v-a.v);
  tips.push(`ดวงคุณค่อนข้างสมดุลดีแล้วนะครับ ธาตุเด่นคือ ${entries[0].k} ${entries[0].v.toFixed(1)}% และธาตุน้อยคือ ${entries[4].k} ${entries[4].v.toFixed(1)}% ต่างกันไม่เยอะมาก รักษาสมดุลนี้ไว้ แล้วเสริมธาตุที่เกี่ยวกับงานที่คุณอยากทำเพิ่มอีกนิดหน่อยก็พอแล้วครับ`);
}
return tips.map((t,i)=><div key={i} className="bg-white p-4 rounded-lg border leading-[1.8]">• {t}</div>);
})()}</div>
<div className="mt-5 text-[12px] text-[#8b5a00]/70 bg-white p-4 rounded-lg leading-[1.8]">
{getDynamicAgeAdvice(new Date().getFullYear()-r.yr, r.day?.element, zd[r.day?.branchZh]?.th, r.elementPercent, r.lp)}
</div>
</div></div></div></div>
<div className="rounded-[24px] bg-gradient-to-br from-[#1a1508] to-[#0f0e0a] border border-yellow-500/30 p-[1px]"><div className="rounded-[23px] bg-[#121212] p-6 text-center"><h3 className="text-[#f5e6c8] font-bold text-lg">อยากรู้ลึกกว่านี้ไหมครับ?</h3><p className="text-[13px] text-white/60 mt-2">ยังมี <b className="text-[#d4af37]">12 เข็มทิศชีวิต</b> ที่วิเคราะห์อาชีพที่ใช่สำหรับคุณโดยเฉพาะ</p><div className="mt-5 rounded-xl bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] p-[1px]"><a href="https://lin.ee/Qtt1m4cC" target="_blank" className="block rounded-[11px] bg-gradient-to-b from-[#f5e6c8] to-[#d4af37] text-black font-bold py-4 text-center">📲 แอดไลน์มาคุยกันต่อได้เลยนะครับ</a></div></div></div>
</div>
)}
</div></main>
);
}

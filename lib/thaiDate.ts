export const BE_OFFSET = 543;

export function beToAd(beYear: number): number {
  return beYear - BE_OFFSET;
}

export function adToBe(adYear: number): number {
  return adYear + BE_OFFSET;
}

export const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

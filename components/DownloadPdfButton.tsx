"use client";

import { useState } from "react";
import type { RefObject } from "react";

export default function DownloadPdfButton({
  targetRef,
  fileName = "bazi-report",
}: {
  targetRef: RefObject<HTMLElement>;
  fileName?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        backgroundColor: "#1a130c",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 20;

      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 40;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 20;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 40;
      }

      pdf.save(`${fileName}.pdf`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="rounded-lg bg-seal px-5 py-2.5 font-medium text-parchment-50 shadow-md transition hover:bg-red-800 disabled:opacity-60"
    >
      {loading ? "กำลังสร้าง PDF..." : "ดาวน์โหลดผลลัพธ์เป็น PDF"}
    </button>
  );
}

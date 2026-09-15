"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Element } from "@/lib/bazi";
import { ELEMENT_TH_SHORT } from "@/lib/summary";

const ELEMENT_COLOR: Record<Element, string> = {
  wood: "#4c7a3f",
  fire: "#c0392b",
  earth: "#b08843",
  metal: "#9a9a9a",
  water: "#2c6b8f",
};

const ORDER: Element[] = ["wood", "fire", "earth", "metal", "water"];

export default function ElementsPieChart({ percent }: { percent: Record<Element, number> }) {
  const data = ORDER.map((el) => ({
    name: `ธาตุ${ELEMENT_TH_SHORT[el]}`,
    value: percent[el],
    element: el,
  }));

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="75%"
            labelLine={false}
            label={({ name, value }) => (value > 0 ? `${name} ${value}%` : "")}
          >
            {data.map((d) => (
              <Cell key={d.element} fill={ELEMENT_COLOR[d.element]} stroke="#1a130c" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{ background: "#2b2117", border: "1px solid #7d5522", borderRadius: 8, color: "#f7ecd0" }}
          />
          <Legend wrapperStyle={{ color: "#f7ecd0", fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

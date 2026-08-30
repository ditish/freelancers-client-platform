import React, { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
export const Piechart = ({totalTasks}) => {
const taskData = [
    { name: "Pending", value: totalTasks || 0 },
    { name: "Completed", value: 10 }, 
  ];

  const COLORS = ["#FFBB28", "#00C49F"];
  const screenHeight = window.innerHeight; // total viewport height
const chartHeight = screenHeight * 0.35; // 25% of screen height

  return (
    <div className="p-2">
      <h3 className="text-xl font-display font-bold mb-4 text-white">Task Overview</h3>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={taskData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {taskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

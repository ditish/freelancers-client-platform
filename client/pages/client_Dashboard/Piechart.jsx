import React, { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
export const Piechart = ({totalTasks}) => {
const taskData = [
    { name: "Pending", value: totalTasks || 0 },
    { name: "Completed", value: 10 }, 
  ];

  const COLORS = ["#FFBB28", "#00C49F"];

  return (
    <div className="bg-white p-6 shadow rounded ">
      <h3 className="text-xl font-bold mb-4">Task Overview</h3>

      <ResponsiveContainer width="100%" height={200}>
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
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

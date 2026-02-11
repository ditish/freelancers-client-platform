import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const Bargraph = ({ totalTasks, totalProjects, Totalfreelancer ,Totalclient }) => {

  const barData = [
    { name: "Projects", value: totalProjects || 0 },
   
    {
      name: "freelancers", value: Totalfreelancer || 0
    },
    {
      name: "clients", value: Totalclient || 0
    },
   
    { name: "Tasks", value: totalTasks || 0 },
  ];

  return (
    <div className="bg-white  p-4 shadow rounded mt-6 ">
      <h3 className="text-lg font-bold mb-2">Platform Overview</h3>

      <ResponsiveContainer width="100%" height={225}>
        <BarChart 
          data={barData}
          margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar 
            dataKey="value" 
            fill="#6366f1" 
            radius={[6, 6, 0, 0]}   // rounded top
            barSize={30}           // thinner bars
          />
        </BarChart>
        </ResponsiveContainer>
        
    </div>
  );
};

export default Bargraph;

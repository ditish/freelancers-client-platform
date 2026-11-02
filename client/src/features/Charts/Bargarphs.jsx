import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const Bargraph = ({ totalTasks, totalProjects, Totalfreelancer, Totalclient }) => {
  const barData = [
    { name: "Projects", value: totalProjects || 0 },
    // shown only on the client dashboard (it passes Totalfreelancer)
    Totalfreelancer !== undefined && {
      name: "Freelancers",
      value: Totalfreelancer || 0,
    },
    // shown only on the freelancer dashboard (it passes Totalclient)
    Totalclient !== undefined && {
      name: "Clients",
      value: Totalclient || 0,
    },
    { name: "Tasks", value: totalTasks || 0 },
  ].filter(Boolean);

  return (
    <div className="p-2">
      <h3 className="text-lg font-display font-bold mb-2 text-white">
        Platform Overview
      </h3>

      <ResponsiveContainer width="100%" height={225}>
        <BarChart
          data={barData}
          margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
          <YAxis tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
          <Tooltip
            contentStyle={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Bar
            dataKey="value"
            fill="#7c6cf6"
            radius={[6, 6, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Bargraph;
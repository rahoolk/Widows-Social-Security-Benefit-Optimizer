
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, ComposedChart, Line
} from 'recharts';
import { SimulationResult } from '../types';

interface ChartProps {
  data: SimulationResult;
}

export const LadderOfGrowth: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        Ladder of Growth <span className="text-xs font-normal text-slate-400">(Cumulative Benefit)</span>
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data.yearlyData}>
          <defs>
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="age" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cumulative Net']}
          />
          <Area 
            type="monotone" 
            dataKey="cumulativeNet" 
            stroke="#2563eb" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorNet)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const WaterfallPenalty: React.FC<ChartProps> = ({ data }) => {
  const currentYearData = data.yearlyData.find(d => d.age === 62) || data.yearlyData[0];
  const chartData = [
    { name: 'Gross Potential', value: currentYearData.grossBenefit / 12, fill: '#3b82f6' },
    { name: 'Earnings Penalty', value: -(currentYearData.workPenalty / 12), fill: '#ef4444' },
    { name: 'Est. Tax', value: -( (currentYearData.taxablePortion * 0.20) / 12), fill: '#f59e0b' },
    { name: 'Net Monthly', value: currentYearData.netBenefit / 12, fill: '#10b981' },
  ];

  return (
    <div className="h-[300px] w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Benefit Breakdown</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
          <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val: number) => `$${Math.abs(val).toLocaleString()}`} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TaxThermometer: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Tax Exposure</h3>
      <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
        <div 
          className="absolute h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-1000"
          style={{ width: `${data.taxExposure}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>Tax Free</span>
        <span>50% Taxable</span>
        <span>85% Taxable</span>
      </div>
      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        Your current combined income places you in the <span className="font-bold text-slate-700">{data.taxExposure > 80 ? 'High' : data.taxExposure > 40 ? 'Moderate' : 'Low'}</span> exposure zone for benefit taxation.
      </p>
    </div>
  );
};

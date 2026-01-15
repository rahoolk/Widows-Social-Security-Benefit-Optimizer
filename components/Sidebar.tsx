
import React from 'react';
import { UserInputs, FilingStatus } from '../types';

interface SidebarProps {
  inputs: UserInputs;
  setInputs: (inputs: UserInputs) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ inputs, setInputs }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = (e.target.type === 'number' || e.target.type === 'range') ? parseFloat(value) : value;
    setInputs({ ...inputs, [name]: numValue });
  };

  const InputGroup = ({ label, name, type, value, min, max, step, help }: any) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        {type === 'range' && <span className="text-sm font-bold text-blue-600">{value}</span>}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={`w-full ${type === 'range' ? 'accent-blue-600' : 'bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all'}`}
      />
      {help && <p className="text-[10px] text-slate-400 mt-1">{help}</p>}
    </div>
  );

  return (
    <aside className="w-full lg:w-80 bg-slate-50 border-r border-slate-200 h-full overflow-y-auto p-6 scrollbar-hide">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Parameters</h2>
      </div>

      <InputGroup label="Deceased Spouse PIA" name="deceasedPIA" type="number" value={inputs.deceasedPIA} help="Monthly benefit if spouse claimed at Full Retirement Age" />
      <InputGroup label="Your Personal PIA" name="userPIA" type="number" value={inputs.userPIA} help="Your own retirement benefit at FRA" />
      
      <div className="h-px bg-slate-200 my-6" />

      <InputGroup label="Your Current Age" name="currentAge" type="range" min={60} max={75} value={inputs.currentAge} />
      <InputGroup label="Target Claiming Age" name="targetClaimingAge" type="range" min={60} max={70} value={inputs.targetClaimingAge} />
      <InputGroup label="Life Expectancy" name="lifeExpectancy" type="range" min={70} max={100} value={inputs.lifeExpectancy} />

      <div className="h-px bg-slate-200 my-6" />

      <InputGroup label="Annual Earned Income (W-2)" name="annualEarnings" type="number" value={inputs.annualEarnings} />
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Filing Status</label>
        <select
          name="filingStatus"
          value={inputs.filingStatus}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          {Object.values(FilingStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <InputGroup label="Nontaxable Interest" name="nontaxableInterest" type="number" value={inputs.nontaxableInterest} />
    </aside>
  );
};

export default Sidebar;

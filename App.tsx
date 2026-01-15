
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import { LadderOfGrowth, WaterfallPenalty, TaxThermometer } from './components/Charts';
import AIAgent from './components/AIAgent';
import { UserInputs, FilingStatus } from './types';
import { runSimulation } from './services/ssCalculations';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<UserInputs>({
    deceasedPIA: 2800,
    userPIA: 2100,
    currentAge: 62,
    targetClaimingAge: 67,
    lifeExpectancy: 88,
    annualEarnings: 45000,
    nontaxableInterest: 1200,
    filingStatus: FilingStatus.SINGLE
  });

  const results = useMemo(() => runSimulation(inputs), [inputs]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans">
      <Sidebar inputs={inputs} setInputs={setInputs} />
      
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Widow’s Social Security Benefit Optimizer</h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Simulate 2026 claiming strategies considering the Earnings Test, taxability thresholds, and switch-over optimization.
          </p>
        </header>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-2.101V15m4.109-2.304l-1.903-.572M12 8c-.628 0-1.22.097-1.748.274m1.903.572L13.903 8.274M10.252 12.11l1.903.572m0 0l1.903.572M9.473 15.11l1.903.572m0 0l1.903.572"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Monthly Net (Est.)</p>
              <p className="text-2xl font-black text-slate-800">${Math.round(results.yearlyData.find(d => d.age === inputs.targetClaimingAge)?.netBenefit! / 12).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Lifetime Wealth</p>
              <p className="text-2xl font-black text-slate-800">${Math.round(results.totalLifetimeValue).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Earnings Withheld</p>
              <p className="text-2xl font-black text-slate-800">${Math.round(results.earningsPenaltyTotal).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <LadderOfGrowth data={results} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WaterfallPenalty data={results} />
              <TaxThermometer data={results} />
            </div>
          </div>
          
          <div className="space-y-8">
            <AIAgent inputs={inputs} results={results} />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Strategy Tips</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  Survivor benefits reach their max at FRA. There are NO delayed credits after 67.
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  If you earn more than $23,400 (est.), the Earnings Test will claw back $1 for every $2.
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  You can claim a survivor benefit early and let your own retirement benefit grow until age 70.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

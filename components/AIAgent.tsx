
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserInputs, SimulationResult } from '../types';

interface AIAgentProps {
  inputs: UserInputs;
  results: SimulationResult;
}

const AIAgent: React.FC<AIAgentProps> = ({ inputs, results }) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        As a Social Security Expert, analyze these parameters for a widow:
        - Current Age: ${inputs.currentAge}
        - Deceased Spouse PIA: $${inputs.deceasedPIA}
        - User's Personal PIA: $${inputs.userPIA}
        - Target Claiming Age: ${inputs.targetClaimingAge}
        - Annual Earnings: $${inputs.annualEarnings}
        - Filing Status: ${inputs.filingStatus}
        - Estimated Lifetime Net Benefit: $${results.totalLifetimeValue.toLocaleString()}
        - Earnings Penalty Exposure: $${results.earningsPenaltyTotal.toLocaleString()}
        
        Provide a concise strategy audit (max 150 words). 
        Identify if a "switch-over" strategy (claiming one benefit early and switching to another later) might be superior.
        Comment on the earnings test impact. Format with markdown bolding.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "Unable to generate analysis at this time.");
    } catch (err) {
      console.error(err);
      setInsight("Financial analysis engine is currently offline. Please check your parameters manually.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        generateInsight();
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Strategy Audit AI</h3>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse" />
          </div>
        ) : (
          <div className="text-sm leading-relaxed text-slate-300">
            {insight.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;

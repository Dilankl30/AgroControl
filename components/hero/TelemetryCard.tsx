'use client';

import React from 'react';

interface TelemetryCardProps {
  type: 'temp' | 'hum' | 'light';
  title: string;
  value: string;
  status: string;
  positionClasses: string;
  onClick: () => void;
}

export function TelemetryCard({
  title,
  value,
  status,
  positionClasses,
  onClick,
}: TelemetryCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`absolute z-20 min-w-[170px] rounded-2xl p-4 bg-[#0a3c31]/80 hover:bg-[#0c4a3d]/90 border border-[#56f3bd]/20 hover:border-[#56f3bd]/45 shadow-xl backdrop-blur-md text-left transition-all duration-200 hover:-translate-y-1 group cursor-pointer ${positionClasses}`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-[#d8f4e5] mb-1.5 opacity-90 group-hover:opacity-100">
        <span className="w-2 h-2 rounded-full bg-[#56f3bd] shadow-[0_0_8px_#56f3bd]" />
        {title}
      </div>
      <div className="text-xl font-extrabold text-white tracking-tight">{value}</div>
      <div className="text-xs text-[#caeadc] mt-1 font-normal opacity-80">{status}</div>
    </button>
  );
}

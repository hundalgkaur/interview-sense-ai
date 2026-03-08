import React from "react";

const Card = ({ item }) => {
  return (
    <div className="group relative break-inside-avoid mb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 hover:border-violet-500/30 group">
        {/* Image / Content Area */}
        <div className={`${item.height} w-full overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="absolute inset-0 flex items-center justify-center text-6xl grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110">
            {item.icon}
          </div>
          
          {/* Top Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">
              {item.category}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6">
          <h3 className="text-white font-black text-lg tracking-tight mb-2 group-hover:text-violet-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-2">
            {item.desc}
          </p>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/20 flex items-center justify-center text-[10px]">
                🤖
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Link</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

const TradingCard = ({ data }) => {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative w-full max-w-sm mx-auto"
        >
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-base-blue via-purple-500 to-base-blue rounded-2xl blur opacity-75 animate-glow" />

            <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Card Header */}
                <div className="p-4 flex justify-between items-center bg-white/5 backdrop-blur-sm border-b border-white/5">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        {data.name}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-base-blue/20 text-base-blue border border-base-blue/30">
                            {data.type}
                        </span>
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-mono">
                        <Sparkles className="w-3 h-3" />
                        <span>{data.rarity}</span>
                    </div>
                </div>

                {/* Image Container */}
                <div className="aspect-square w-full bg-slate-800 relative overflow-hidden group holo-card">
                    <img
                        src={data.image}
                        alt={data.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Holo Overlay is handled by CSS class 'holo-card' now */}
                </div>

                {/* RWA Oracle Data */}
                <div className="p-4 space-y-4 bg-slate-900/90 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                            <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Market Valuation
                            </div>
                            <div className="text-xl font-bold text-green-400 font-mono">
                                ${data.valuation.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                            <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Collector Grade
                            </div>
                            <div className="text-xl font-bold text-purple-400 font-mono">
                                {data.grade}
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 text-center font-mono">
                        Verified by Collector_Crypt Oracle
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TradingCard;

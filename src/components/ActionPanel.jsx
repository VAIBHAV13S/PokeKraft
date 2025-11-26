import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Rocket } from 'lucide-react';

const ActionPanel = ({ onMint, onLaunch, status }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col gap-4 w-full max-w-sm mx-auto"
        >
            {status === 'generated' && (
                <button
                    onClick={onMint}
                    className="btn-primary w-full group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Wallet className="w-5 h-5" />
                    Mint to Base
                </button>
            )}

            {status === 'minting' && (
                <button disabled className="btn-primary w-full opacity-75 cursor-wait">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Minting to Base...
                </button>
            )}

            {status === 'minted' && (
                <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center text-sm font-medium">
                        Successfully Minted on Base!
                    </div>
                    <button
                        onClick={onLaunch}
                        className="w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                        <Rocket className="w-5 h-5" />
                        Launch Agent on CreatorBid
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default ActionPanel;

import React from 'react';
import { Zap, Hexagon } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-base-blue/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-base-blue blur-md opacity-50 animate-pulse" />
                        <Hexagon className="w-8 h-8 text-base-blue fill-base-blue/20 relative z-10" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        PokeCraft <span className="text-base-blue">Creator</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-base-blue/10 border border-base-blue/20 text-sm text-base-blue">
                        <div className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
                        Base Network
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                        Connect Wallet
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-slate-500 text-sm border-t border-white/5">
                <p>Powered by Agentic AI & Base Network</p>
            </footer>
        </div>
    );
};

export default Layout;

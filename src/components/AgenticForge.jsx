import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import TradingCard from './TradingCard';
import ActionPanel from './ActionPanel';
import confetti from 'canvas-confetti';

const MOCK_DATA = {
    name: "Spectral Ronin",
    type: "Ghost / Steel",
    rarity: "Legendary",
    image: "https://images.unsplash.com/photo-1637823207976-3d7535826818?q=80&w=1000&auto=format&fit=crop", // Placeholder
    valuation: 4250,
    grade: "Gem Mint 10"
};

const AgenticForge = ({ prompt, setPrompt, status, onGenerate, onMint, data, isMinting }) => {
    return (
        <div className="w-full space-y-6">
            <div className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4 text-base-blue font-bold">
                    <Wand2 className="w-5 h-5" />
                    Agentic Forge
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm text-slate-400">Describe your creature</label>
                        <button
                            onClick={() => {
                                const prompts = [
                                    "A cyberpunk dragon made of neon glass, circuit board scales, glowing blue eyes, 8k resolution",
                                    "A cute baby phoenix resting on a bed of magma, chibi style, vibrant colors",
                                    "A mechanical golem overgrown with moss and ancient runes, forest background, cinematic lighting",
                                    "A spectral wolf made of starlight and nebula clouds, cosmic background, ethereal atmosphere",
                                    "A crystal spider queen with diamond legs, refraction effects, dark cave setting",
                                    "A samurai turtle with jade armor and a water katana, ukiyo-e art style",
                                    "A steampunk owl with brass gears and clockwork wings, victorian era background"
                                ];
                                const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                                setPrompt(randomPrompt);
                            }}
                            className="text-xs text-base-blue hover:text-blue-400 flex items-center gap-1 transition-colors"
                            disabled={status === 'generating' || status === 'minting'}
                        >
                            <Sparkles className="w-3 h-3" />
                            Surprise Me
                        </button>
                    </div>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A ghost-type samurai warrior with blue flames..."
                        className="input-field h-32 resize-none w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-base-blue focus:outline-none"
                        disabled={status === 'generating' || status === 'minting'}
                    />
                </div>

                <button
                    onClick={onGenerate}
                    disabled={!prompt || status === 'generating' || status === 'minting'}
                    className={`btn-primary w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${status === 'generating' ? 'bg-slate-700 cursor-wait' : 'bg-base-blue hover:bg-blue-600'
                        }`}
                >
                    {status === 'generating' ? (
                        <>
                            <Sparkles className="w-5 h-5 animate-spin" />
                            Forging Asset...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Asset
                        </>
                    )}
                </button>
            </div>


            {/* Instructions / Lore */}
            <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/20 text-sm text-blue-200">
                <p className="mb-2 font-bold">How it works:</p>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>AI analyzes lore & visual traits</li>
                    <li>Oracle assigns RWA market valuation</li>
                    <li>Mint to Base as an autonomous agent</li>
                </ul>
            </div>

            {
                data && status !== 'minted' && (
                    <ActionPanel
                        status={isMinting ? 'minting' : status}
                        onMint={onMint}
                        onLaunch={() => alert("Launching Agent on CreatorBid...")}
                    />
                )
            }
        </div >
    );
};

export default AgenticForge;



import { useState, useEffect } from 'react'
import { WagmiConfig, useAccount, useWriteContract } from 'wagmi'
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { parseEther } from 'viem'
import { config } from './wagmi'
import { POKECRAFT_ADDRESS, POKECRAFT_ABI } from './contracts'
import '@rainbow-me/rainbowkit/styles.css'
import './App.css'
import Toast from './components/Toast'
import SkeletonCard from './components/SkeletonCard'
import AgenticForge from './components/AgenticForge'
import TradingCard from './components/TradingCard'
import { api } from './services/api'

const queryClient = new QueryClient()

// ... (keep existing imports)

function PokeCraftApp() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending: isMintingTransaction, isSuccess: isMintSuccess } = useWriteContract();

  const [status, setStatus] = useState('idle'); // idle, generating, generated, minting, minted
  const [generatedPokemon, setGeneratedPokemon] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [prompt, setPrompt] = useState('');

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (isMintSuccess && generatedPokemon && status === 'minting') {
      finishMinting();
    }
  }, [isMintSuccess]);

  const fetchGallery = async () => {
    try {
      const data = await api.fetchGallery();
      if (data.success) {
        setGallery(data.pokemon);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setStatus('generating');
    setGeneratedPokemon(null); // Clear previous result to show skeleton

    try {
      const data = await api.generatePokemon();
      console.log("Generation API response:", data);
      if (data.success) {
        setGeneratedPokemon({
          ...data.traits,
          image: data.imageUrl,
          valuation: Math.floor(Math.random() * (5000 - 500) + 500),
          grade: Math.random() > 0.5 ? "Gem Mint 10" : "Pristine 10",
          metadata: data.metadata,
          tokenURI: data.tokenURI
        });
        setStatus('generated');
        showToast("Asset Generated Successfully!", "success");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setStatus('idle');
      showToast("Generation failed. Please try again.", "error");
    }
  };

  const handleMint = async () => {
    console.log("handleMint called");
    if (!address) {
      showToast("Please connect your wallet first.", "error");
      return;
    }
    console.log("Generated Pokemon:", generatedPokemon);
    if (!generatedPokemon || !generatedPokemon.tokenURI) {
      console.error("Missing tokenURI for minting");
      return;
    }

    setStatus('minting');
    try {
      console.log("Calling writeContract with URI:", generatedPokemon.tokenURI);
      writeContract({
        address: POKECRAFT_ADDRESS,
        abi: POKECRAFT_ABI,
        functionName: 'mint',
        args: [generatedPokemon.tokenURI],
        value: parseEther('0.001'),
      });
      showToast("Confirm transaction in wallet...", "info");
    } catch (error) {
      console.error("Mint transaction failed:", error);
      setStatus('generated');
      showToast("Mint transaction failed.", "error");
    }
  };

  const finishMinting = async () => {
    try {
      await api.recordMint({
        tokenId: Date.now(),
        ownerAddress: address,
        metadata: generatedPokemon.metadata,
        traits: generatedPokemon
      });

      setStatus('minted');
      fetchGallery();
      showToast("Successfully Minted on Base!", "success");
    } catch (error) {
      console.error("Failed to record mint:", error);
      showToast("Mint recorded locally failed, but on-chain is fine.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans relative">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-base-blue rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">PokeCraft <span className="text-base-blue">Creator</span></h1>
          </div>
          <div className="flex gap-4">
            <ConnectButton />
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-400">Agent Active</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AgenticForge
            prompt={prompt}
            setPrompt={setPrompt}
            status={status}
            onGenerate={handleGenerate}
            onMint={handleMint}
            data={generatedPokemon}
            isMinting={isMintingTransaction}
          />

          {/* Right side preview */}
          <div className="flex flex-col items-center justify-center">
            {status === 'generating' ? (
              <SkeletonCard />
            ) : generatedPokemon ? (
              <TradingCard data={generatedPokemon} />
            ) : (
              <div className="w-full max-w-sm aspect-[3/4] glass-panel flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-slate-800 rounded-xl">
                <p>Your creation will appear here</p>
              </div>
            )}
          </div>
        </main>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Community Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((mon) => (
                <TradingCard key={mon.id} data={{
                  name: mon.name,
                  type: mon.type,
                  rarity: mon.tier,
                  image: mon.image_url,
                  valuation: mon.hp * 10, // Mock derived val
                  grade: "Mint"
                }} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// Initialize QueryClient moved to top

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <PokeCraftApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App;

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
    appName: 'PokeCraft Creator',
    projectId: '3a8170812b534d0ff9d794f19a901d64',
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http(),
    },
    ssr: false,
});

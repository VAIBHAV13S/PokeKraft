import axios from 'axios';

// Use the deployed backend URL in production, fallback to localhost in development
const API_URL = import.meta.env.PROD 
  ? 'https://poke-kraft-xgu2.vercel.app/api'
  : 'http://localhost:3000/api';

export const api = {
    generatePokemon: async () => {
        const response = await axios.post(`${API_URL}/generate`);
        return response.data;
    },

    recordMint: async (data) => {
        const response = await axios.post(`${API_URL}/mint`, data);
        return response.data;
    },

    fetchGallery: async () => {
        const response = await axios.get(`${API_URL}/gallery`);
        return response.data;
    }
};

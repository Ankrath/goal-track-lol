const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

console.log('Current environment:', import.meta.env.MODE);
console.log('API URL being used:', config.apiUrl);

export default config;

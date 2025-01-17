const config = {
  apiUrl: import.meta.env.VITE_API_URL,
};

console.log('Current environment:', import.meta.env.MODE);
console.log('API URL being used:', config.apiUrl);
console.log('Raw env variable:', import.meta.env.VITE_API_URL);

export default config;

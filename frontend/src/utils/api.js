const config = {
    apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://your-backend-url.onrender.com' : 'http://localhost:3000')
}

export default config
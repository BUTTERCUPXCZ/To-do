import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import employeeRoutes from '../routes/employee.route.js'
import cors from 'cors'


const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000

// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-frontend-url.onrender.com'
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})



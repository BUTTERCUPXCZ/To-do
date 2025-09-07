import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import employeeRoutes from '../routes/employee.route.js'
import cors from 'cors'


const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000


app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})



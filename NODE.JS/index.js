import express from 'express';
import { connectDB } from './lib/connect.js';
// import User from './models/user.js';
import handeler from './routes/index.js'
import cors from 'cors'
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())

console.log(process.env.DATABASE_URL)
app.use('/api',handeler);
app.listen(port,()=>{ // IMPORTENT!! this part need to be last!
    connectDB();
    console.log(`server running at http://localhost:${port}`);
    
})

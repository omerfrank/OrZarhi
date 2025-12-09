import express from 'express';
import { connectDB } from './lib/connect.js';
import handler from './routes/index.js'
import cors from 'cors'
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json())

console.log(process.env.DATABASE_URL)
app.use('/api',handler);
app.listen(port,()=>{ // IMPORTANT!! this part need to be last!
    connectDB();
    console.log(`server running at http://localhost:${port}`);
    
})

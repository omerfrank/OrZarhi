import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser'; // Add this import
import { connectDB } from './lib/connect.js';
import handler from './routes/index.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true // Required for cookies to work
}));

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true,
        secure: false, 
        sameSite: 'lax'
    }
}));

console.log(process.env.DATABASE_URL);
app.use('/api', handler);

app.listen(port, () => {
    connectDB();
    console.log(`server running at http://localhost:${port}`);
});
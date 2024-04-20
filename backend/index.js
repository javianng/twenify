import express from 'express';
import auth from './routes/auth.js';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use('/', auth);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

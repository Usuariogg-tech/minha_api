import express from 'express';
import rotasDeUsuarios from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/usuarios', rotasDeUsuarios); 

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
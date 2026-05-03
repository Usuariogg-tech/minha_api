import express from 'express';
import rotasDeUsuarios from './routes.js';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: "*", // Libera para qualquer porta do seu computador durante o teste
  methods: ["GET", "POST"],
  credentials: true
}));

app.post("/login", 
    (req, res) => { 
        const { 
            email, 
            password 
} = req.body;  
if (
    email === "teste@teste.com" && 
    password === "123"
) { 
    res.json({ 
        success: true, 
        token: "fake-jwt-token" 
}); 
} else {
     res.json({
         success: false 
        }); 
    } 
});


app.use(
    '/usuarios', 
    rotasDeUsuarios
); 

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
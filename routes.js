import { Router } from 'express';
import { 
    listarUsuarios, 
    criarUsuario, 
    deletarUsuario, 
    buscarUsuarioPorId 
} from './controladores/users.controllers.js';

import pool from './db.js'; 

const routes = Router();

// 1. Rota para solicitar o código (O React chama quando clica em "Enviar")
routes.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica se o usuário existe na sua tabela (ajuste 'usuarios' para o nome da sua tabela)
        const userCheck = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "E-mail não encontrado." });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60000); // 15 minutos

        // Salva o código temporário
        await pool.query(
            'INSERT INTO password_recoveries (email, code, expires_at) VALUES ($1, $2, $3)',
            [email, code, expiresAt]
        );

        // LOG para teste (substitua por serviço de SMS/Email depois)
        console.log(`CÓDIGO ENVIADO PARA ${email}: ${code}`);

        res.status(200).json({ message: "Código enviado!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao processar solicitação" });
    }
});

// 2. Rota para validar o código (O React chama após o usuário digitar os 6 números)
routes.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM password_recoveries WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()',
            [email, code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Código inválido ou expirado." });
        }

        // Sucesso: Invalidamos o código para não ser usado de novo
        await pool.query('UPDATE password_recoveries SET used = TRUE WHERE id = $1', [result.rows[0].id]);

        res.status(200).json({ message: "Código validado!" });
    } catch (err) {
        res.status(500).json({ error: "Erro na validação" });
    }
});

routes.get('/', listarUsuarios);
routes.post('/', criarUsuario);
routes.get('/:id', buscarUsuarioPorId);
routes.delete('/:id', deletarUsuario);

export default routes;
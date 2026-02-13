import pool from '../db.js';


const executarQuery = async (res, query, params = []) => {
    try {
        const resultado = await pool.query(query, params);
        return resultado;
    } catch (error) {
        console.error("Erro na Database:", error);
        res.status(500).json({ erro: "Erro interno no servidor" });
        return null; // Indica que algo deu errado
    }
};

export const listarUsuarios = async (req, res) => {
    const resu = await executarQuery(res, 'SELECT * FROM usuarios');
    if (resu) res.status(200).json(resu.rows);
};

export const criarUsuario = async (req, res) => {
    const { nome, email } = req.body;
    const resu = await executarQuery(res, 
        'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *', 
        [nome, email]
    );
    if (resu) res.status(201).json(resu.rows[0]);
};

export const buscarUsuarioPorId = async (req, res) => {
    const resu = await executarQuery(res, 'SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (!resu) return;
    
    resu.rows.length === 0 
        ? res.status(404).json({ erro: "Usuário não encontrado" }) 
        : res.json(resu.rows[0]);
};

export const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    const resu = await executarQuery(res, 
        'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING *', 
        [nome, email, id]
    );
    if (resu) res.json(resu.rows[0]);
};

export const deletarUsuario = async (req, res) => {
    const resu = await executarQuery(res, 'DELETE FROM usuarios WHERE id = $1 RETURNING *', [req.params.id]);
    if (!resu) return;

    resu.rowCount === 0 
        ? res.status(404).json({ erro: "Usuário não encontrado" }) 
        : res.status(200).json({ mensagem: "Deletado com sucesso!" });
};
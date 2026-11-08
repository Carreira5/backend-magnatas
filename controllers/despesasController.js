const banco = require('../config/banco');

const listar = async (req, res) => {
    try {
        const query = `
            SELECT d.id, d.tipo, d.descricao, d.valor, d.data_registro, u.nome as morador 
            FROM despesas d 
            LEFT JOIN usuarios u ON d.morador_id = u.id 
            ORDER BY d.data_registro DESC
        `;
        const [despesas] = await banco.query(query);
        res.status(200).json(despesas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar despesas.' });
    }
};

const criar = async (req, res) => {
    try {
        const { tipo, descricao, valor } = req.body;
        const morador_id = req.usuario.id; 

        if (!tipo || !descricao || !valor) {
            return res.status(400).json({ erro: 'Preencha todos os campos da despesa.' });
        }

        const query = 'INSERT INTO despesas (tipo, descricao, valor, morador_id) VALUES (?, ?, ?, ?)';
        await banco.query(query, [tipo, descricao, valor, morador_id]);

        res.status(201).json({ mensagem: 'Despesa registrada com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao registrar despesa.' });
    }
};

module.exports = { listar, criar };
const banco = require('../config/banco');

const listar = async (req, res) => {
    try {
        // Busca os avisos e junta com o nome do autor que postou
        const query = `
            SELECT a.id, a.titulo, a.mensagem, a.criado_em, u.nome as autor 
            FROM avisos a 
            JOIN usuarios u ON a.autor_id = u.id 
            ORDER BY a.criado_em DESC
        `;
        const [avisos] = await banco.query(query);
        res.status(200).json(avisos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar avisos.' });
    }
};

const criar = async (req, res) => {
    try {
        const { titulo, mensagem } = req.body;
        // Pega o ID do usuário que o nosso middleware (segurança) extraiu do Token
        const autor_id = req.usuario.id; 

        if (!titulo || !mensagem) {
            return res.status(400).json({ erro: 'Título e mensagem são obrigatórios.' });
        }

        const query = 'INSERT INTO avisos (titulo, mensagem, autor_id) VALUES (?, ?, ?)';
        await banco.query(query, [titulo, mensagem, autor_id]);

        res.status(201).json({ mensagem: 'Aviso criado com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao criar aviso.' });
    }
};

module.exports = { listar, criar };
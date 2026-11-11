const banco = require('../config/banco');

// 1. CARREGA O DROPDOWN DA FAXINA (Só moradores aprovados e admin)
const listarTodos = async (req, res) => {
    try {
        const [usuarios] = await banco.query('SELECT id, nome, apelido FROM usuarios WHERE perfil = "morador" OR perfil = "admin"');
        res.status(200).json(usuarios);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
};

// 2. NOVA: CARREGA A FILA DE ESPERA (Só visitantes)
const listarPendentes = async (req, res) => {
    try {
        const [pendentes] = await banco.query('SELECT id, nome, apelido, email FROM usuarios WHERE perfil = "visitante"');
        res.status(200).json(pendentes);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar pendentes.' });
    }
};

// 3. NOVA: APROVA O MORADOR
const aprovarMorador = async (req, res) => {
    try {
        const { id } = req.params;
        await banco.query('UPDATE usuarios SET perfil = "morador" WHERE id = ?', [id]);
        res.status(200).json({ mensagem: 'Usuário aprovado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao aprovar usuário.' });
    }
};
const recusarMorador = async (req, res) => {
    try {
        await banco.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        res.status(200).json({ mensagem: 'Solicitação recusada e apagada.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao recusar visitante.' });
    }
};

module.exports = { listarTodos, listarPendentes, aprovarMorador, recusarMorador};
const banco = require('../config/banco');
const bcrypt = require('bcrypt');

const registar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // validação de campos vazios
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        // gera o hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // insere usuário no banco de dados (forçando perfil admin no momento)
        const query = 'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)';
        await banco.query(query, [nome, email, senhaHash, 'admin']);

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

module.exports = { registar };
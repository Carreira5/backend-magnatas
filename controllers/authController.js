const banco = require('../config/banco');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // MUDANÇA: Quem se cadastrar por fora nasce como 'visitante', preso na sala de espera
        const query = 'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)';
        await banco.query(query, [nome, email, senhaHash, 'visitante']);

        res.status(201).json({ mensagem: 'Cadastro em análise! Aguarde aprovação de um morador.' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Preencha email e senha.' });
        }

        const [linhas] = await banco.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (linhas.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });
        }

        const usuario = linhas[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
        
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });
        }

        // 🛑 O SEGURANÇA DA DISCOTECA ENTRA AQUI 🛑
        if (usuario.perfil === 'visitante') {
            return res.status(403).json({ erro: 'Acesso bloqueado: Sua conta ainda está em análise. Aguarde a aprovação.' });
        }

        // Se passou, gera o Token
        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil }, 
            process.env.CHAVE_JWT, 
            { expiresIn: '24h' } 
        );

        res.status(200).json({
            mensagem: 'Login efetuado com sucesso!',
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                perfil: usuario.perfil
            }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno durante o login.' });
    }
};

module.exports = { registar, login };
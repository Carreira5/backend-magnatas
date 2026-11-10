const banco = require('../config/banco');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrar = async (req, res) => {
    try {
        // 1. Agora o backend "puxa" o apelido que foi digitado no front-end
        const { nome, apelido, email, senha } = req.body; 

        const [existente] = await banco.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) {
            return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
        }

        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        // 2. A MÁGICA DA AUTOMAÇÃO: Salva o apelido e crava o perfil 'visitante' direto no banco!
        await banco.query(
            'INSERT INTO usuarios (nome, apelido, email, senha_hash, perfil, status_morador) VALUES (?, ?, ?, ?, ?, ?)', 
            [nome, apelido, email, senha_hash, 'visitante', 'ativo']
        );

        res.status(201).json({ mensagem: 'Cadastro em análise! Redirecionando...' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro no servidor ao registrar.' });
    }
};

// Certifique-se de que no final do arquivo as duas funções estão sendo exportadas:
// module.exports = { login, registrar };

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

module.exports = { registrar, login };
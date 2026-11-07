const banco = require('../config/banco');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Adicionamos a biblioteca do Token

// --- Função de Registro (Já estava pronta) ---
const registar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const query = 'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)';
        await banco.query(query, [nome, email, senhaHash, 'admin']);

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

// --- NOVA Função de Login ---
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Preencha email e senha.' });
        }

        // 1. Busca o usuário no banco pelo email
        const [linhas] = await banco.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        // Se o array estiver vazio, o usuário não existe
        if (linhas.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });
        }

        const usuario = linhas[0];

        // 2. Compara a senha digitada com o hash salvo no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
        
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });
        }

        // 3. Gera o Token JWT (A chave de acesso do usuário)
        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil }, 
            process.env.CHAVE_JWT, 
            { expiresIn: '24h' } // O token expira em 1 dia
        );

        // Devolve o token e os dados básicos (sem a senha)
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

// Exportamos as duas funções agora
module.exports = { registar, login };
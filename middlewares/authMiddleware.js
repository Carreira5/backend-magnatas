const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // O token vem escondido no cabeçalho (header) da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Testa se a pulseira é verdadeira usando a nossa palavra-passe secreta do .env
        const verificado = jwt.verify(token, process.env.CHAVE_JWT);
        
        // Guarda as informações do usuário (id, perfil) para usarmos na rota depois
        req.usuario = verificado; 
        
        // Tudo certo, libera a passagem (next)
        next(); 
    } catch (erro) {
        res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;
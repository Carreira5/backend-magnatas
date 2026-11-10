const apenasAdmin = (req, res, next) => {
    // Tenta ler os dados do token (seja como req.usuario ou req.user)
    const usuarioLogado = req.usuario || req.user;

    // Verifica se a pessoa não está logada ou se o perfil NÃO é admin
    if (!usuarioLogado || usuarioLogado.perfil !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Ação exclusiva para Administradores.' });
    }
    
    // Se for admin, a porta abre e a rota continua!
    next(); 
};

module.exports = apenasAdmin;
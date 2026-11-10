const bcrypt = require('bcrypt');
const banco = require('./config/banco'); // Conecta ao seu banco de dados

async function criarAdmin() {
    // 1. SEUS DADOS: Pode alterar o que está entre aspas se quiser!
    const nome = 'Filipe Bertucci Carreira';
    const apelido = 'TD';
    const email = 'filipe.carreira@unesp.br'; 
    const senha = 'Magnatas05'; 

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // 2. INSERE VOCÊ COMO ADMIN E COM O APELIDO
        const query = 'INSERT INTO usuarios (nome, apelido, email, senha_hash, perfil) VALUES (?, ?, ?, ?, ?)';
        await banco.query(query, [nome, apelido, email, senhaHash, 'admin']);
        
        console.log(`✅ SUCESSO! Usuário Mestre criado: O admin ${apelido} já tem acesso!`);
        process.exit();
    } catch (erro) {
        console.log('⚠️ AVISO: Se der erro, é porque esse e-mail já foi criado antes! Pode ir logar.');
        process.exit(1);
    }
}

criarAdmin();
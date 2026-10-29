// Importamos a biblioteca do MySQL
const mysql = require('mysql2/promise');

// Carregamos as senhas do ficheiro .env
require('dotenv').config();

// Criamos a ligação ao banco de dados
const conexao = mysql.createPool({
    host: process.env.DB_SERVIDOR,
    user: process.env.DB_USUARIO,
    password: process.env.DB_SENHA,
    database: process.env.DB_NOME
});

// Testamos se está tudo a funcionar e avisamos no terminal
conexao.getConnection()
    .then(() => {
        console.log("✅ Base de Dados ligada com sucesso!");
    })
    .catch((erro) => {
        console.log("❌ Erro ao ligar à base de dados:", erro.message);
    });

// Exportamos a ligação para usar noutros ficheiros
module.exports = conexao;
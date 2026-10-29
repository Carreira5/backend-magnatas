// 1. Importar as ferramentas
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 2. Criar o servidor
const app = express();

// 3. Configurações para o servidor entender JSON e falar com o HTML
app.use(cors());
app.use(express.json());

// 4. Ligar a base de dados (isto vai ativar aquele aviso verde de sucesso)
const banco = require('./config/banco');

// 5. Uma Rota de Teste para o navegador
app.get('/', (req, res) => {
    res.send('Servidor da República Magnatas a funcionar a 100%!');
});

// 6. Ligar o servidor
const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor a correr na porta ${PORTA}`);
});
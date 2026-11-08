const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// importação das rotas
const rotasAuth = require('./routes/authRoutes');
app.use('/api/auth', rotasAuth); 

const banco = require('./config/banco');

app.get('/', (req, res) => {
    res.send('API da República rodando!');
});

const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});

const rotasAuth = require('./routes/authRoutes');
app.use('/api/auth', rotasAuth); 

//  Rotas do Mural de Avisos
const rotasAvisos = require('./routes/avisosRoutes');
app.use('/api/avisos', rotasAvisos);
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// AQUI ESTÁ O SEU SEGURANÇA! Ninguém mexe nos usuários sem Token.
const verificarToken = require('../middlewares/authMiddleware'); 

// Rota antiga da Faxina (agora usa o listarTodos)
router.get('/', verificarToken, usuariosController.listarTodos);

// Rotas novas do Painel Admin
router.get('/pendentes', verificarToken, usuariosController.listarPendentes);
router.put('/:id/aprovar', verificarToken, usuariosController.aprovarMorador);

module.exports = router;
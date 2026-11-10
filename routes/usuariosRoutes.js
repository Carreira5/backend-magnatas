const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

const apenasAdmin = require('../middlewares/apenasAdmin');

// AQUI ESTÁ O SEU SEGURANÇA! Ninguém mexe nos usuários sem Token.
const verificarToken = require('../middlewares/authMiddleware'); 

// Rota antiga da Faxina (agora usa o listarTodos)
router.get('/', verificarToken, usuariosController.listarTodos);

router.delete('/:id/recusar', verificarToken, apenasAdmin, usuariosController.recusarMorador);
// Rotas novas do Painel Admin
router.get('/pendentes', verificarToken,apenasAdmin,  usuariosController.listarPendentes);
router.put('/:id/aprovar', verificarToken, apenasAdmin,  usuariosController.aprovarMorador);

module.exports = router;
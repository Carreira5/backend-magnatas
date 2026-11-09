const express = require('express');
const router = express.Router();
const avisosController = require('../controllers/avisosController');

// Importamos o nosso middleware de segurança
const verificarToken = require('../middlewares/authMiddleware');

// O "verificarToken" fica no meio: a pessoa só acessa o controller se tiver o Token
router.get('/', verificarToken, avisosController.listar);
router.post('/', verificarToken, avisosController.criar);
router.delete('/:id', verificarToken, avisosController.deletar);

module.exports = router;
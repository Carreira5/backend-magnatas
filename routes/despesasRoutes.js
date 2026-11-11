const express = require('express');
const router = express.Router();
const despesasController = require('../controllers/despesasController');
const verificarToken = require('../middlewares/authMiddleware');
const apenasAdmin = require('../middlewares/apenasAdmin');

router.delete('/zerar', verificarToken, apenasAdmin, despesasController.zerarMes);
router.get('/', verificarToken, despesasController.listar);
router.post('/', verificarToken, despesasController.criar);

module.exports = router;
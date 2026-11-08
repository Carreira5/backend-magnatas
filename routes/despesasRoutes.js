const express = require('express');
const router = express.Router();
const despesasController = require('../controllers/despesasController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/', verificarToken, despesasController.listar);
router.post('/', verificarToken, despesasController.criar);

module.exports = router;
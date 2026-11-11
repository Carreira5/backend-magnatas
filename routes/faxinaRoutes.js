const express = require('express');
const router = express.Router();
const faxinaController = require('../controllers/faxinaController');
const verificarToken = require('../middlewares/authMiddleware');
const apenasAdmin = require('../middlewares/apenasAdmin');

router.delete('/:id', verificarToken, apenasAdmin, faxinaController.apagarTarefa);
router.get('/', verificarToken, faxinaController.listar);
router.post('/', verificarToken, faxinaController.criar);
router.put('/:id/concluir', verificarToken, faxinaController.concluir);

module.exports = router;
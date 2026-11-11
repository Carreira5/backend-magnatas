const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// rotas de autenticação
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

module.exports = router;
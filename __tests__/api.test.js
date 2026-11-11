require('dotenv').config();
const request = require('supertest');
const jwt = require('jsonwebtoken');

// 1. ANTES DE IMPORTAR O APP, MOCKAMOS O MIDDLEWARE DE SEGURANÇA!
// Assim, ele deixa a requisição passar direto para os controllers, 
// assumindo que o utilizador já está logado com ID 1 e perfil 'admin'.
jest.mock('../middlewares/authMiddleware', () => {
    return (req, res, next) => {
        req.usuario = { id: 1, perfil: 'admin' };
        next();
    };
});
// (Se você tiver um middleware apenasAdmin, também vamos mockar por segurança)
jest.mock('../middlewares/apenasAdmin', () => {
    return (req, res, next) => next();
});

const app = require('../server');
const banco = require('../config/banco'); 

// 2. Simulamos o banco de dados
jest.mock('../config/banco', () => ({
    query: jest.fn()
}));

const authHeader = 'Bearer token-simulado'; // Como mockámos, qualquer string serve

describe('Bateria de Testes Automatizados - República Magnatas', () => {

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    // --- T1 e T2: Testes de Despesas ---
    it('T1 (Válido): Deve registrar despesa com dados corretos e valor válido', async () => {
        banco.query.mockResolvedValue([{ insertId: 1 }]); 

        const res = await request(app)
            .post('/api/despesas')
            .set('Authorization', authHeader)
            .send({ tipo: 'Luz', descricao: 'Conta de luz do mês', valor: 150.00 });

        expect(res.status).toBe(201); 
    });

    it('T2 (Inválido): Deve recusar o registro de despesa se faltar o valor', async () => {
        const res = await request(app)
            .post('/api/despesas')
            .set('Authorization', authHeader)
            .send({ tipo: 'Agua', descricao: 'Conta de água sem preço' }); 

        expect([400, 500]).toContain(res.status);
    });

    // --- T3 e T4: Testes de Cadastro ---
    it('T3 (Válido): Deve realizar cadastro de visitante com dados completos', async () => {
        banco.query.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{ insertId: 2 }]);

        const res = await request(app)
            .post('/api/auth/registrar')
            .send({ nome: 'Ana Souza', apelido: 'Ana', email: 'ana@email.com', senha: '123' });

        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(300); 
    });

    it('T4 (Inválido): Deve recusar cadastro se e-mail ou senha estiverem faltando', async () => {
        const res = await request(app)
            .post('/api/auth/registrar')
            .send({ nome: 'Visitante Incompleto', apelido: 'Visi' }); 

        expect([400, 500]).toContain(res.status);
    });

    // --- T5 e T6: Testes de Faxina ---
    it('T5 (Válido): Deve delegar tarefa de faxina se todos os campos forem enviados', async () => {
        banco.query.mockResolvedValue([{ insertId: 3 }]);

        const res = await request(app)
            .post('/api/faxina')
            .set('Authorization', authHeader)
            .send({ descricao: 'Limpar cozinha', responsavel_id: 1, data_limite: '2026-11-20' });

        expect(res.status).toBe(201);
    });

    it('T6 (Inválido): Deve recusar tarefa de faxina se não houver um responsável definido', async () => {
        const res = await request(app)
            .post('/api/faxina')
            .set('Authorization', authHeader)
            .send({ descricao: 'Limpar sala', data_limite: '2026-11-20' }); 

        expect([400, 500]).toContain(res.status);
    });
});
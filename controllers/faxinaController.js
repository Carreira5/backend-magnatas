const banco = require('../config/banco');

const listar = async (req, res) => {
    try {
        const query = `
            SELECT f.id, f.descricao, f.data_limite, f.status, u.nome as responsavel 
            FROM tarefas_faxina f 
            JOIN usuarios u ON f.morador_id = u.id 
            ORDER BY f.data_limite ASC
        `;
        const [tarefas] = await banco.query(query);
        res.status(200).json(tarefas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar escala de faxina.' });
    }
};

const criar = async (req, res) => {
    try {
        const { descricao, data_limite } = req.body;
        const morador_id = req.usuario.id; 

        if (!descricao || !data_limite) {
            return res.status(400).json({ erro: 'Preencha a descrição e a data limite.' });
        }

        const query = 'INSERT INTO tarefas_faxina (descricao, morador_id, data_limite) VALUES (?, ?, ?)';
        await banco.query(query, [descricao, morador_id, data_limite]);

        res.status(201).json({ mensagem: 'Tarefa de faxina criada com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao criar tarefa de faxina.' });
    }
};

module.exports = { listar, criar };
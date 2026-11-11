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
        const { descricao, data_limite, responsavel_id } = req.body;

        if (!descricao || !data_limite || !responsavel_id) {
            return res.status(400).json({ erro: 'Preencha todos os campos.' });
        }

        const query = 'INSERT INTO tarefas_faxina (descricao, morador_id, data_limite, status) VALUES (?, ?, ?, "Pendente")';
        await banco.query(query, [descricao, responsavel_id, data_limite]);

        res.status(201).json({ mensagem: 'Tarefa de faxina delegada com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao criar tarefa de faxina.' });
    }
};

const concluir = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "UPDATE tarefas_faxina SET status = 'concluida' WHERE id = ?";
        
        // O banco guarda o resultado da operação aqui
        const [resultado] = await banco.query(query, [id]);
        
        // Se o banco executou, mas não mudou nenhuma linha (ID não bate)
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: `A tarefa de ID ${id} não foi encontrada no banco de dados.` });
        }
        
        res.status(200).json({ mensagem: 'Tarefa concluída com sucesso!' });
    } catch (erro) {
        console.error('ERRO DETALHADO DO BANCO:', erro);
        // Manda a mensagem exata do erro do MySQL para a tela do site!
        res.status(500).json({ erro: erro.message });
    }
};

const apagarTarefa = async (req, res) => {
    try {
        await banco.query('DELETE FROM tarefas_faxina WHERE id = ?', [req.params.id]);
        res.status(200).json({ mensagem: 'Tarefa apagada.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao apagar tarefa.' });
    }
};
// Adicione 'apagarTarefa' no module.exports


module.exports = { listar, criar, concluir, apagarTarefa };
import express from 'express';
import cors from 'cors';
import sequelize from './config/bd.js';
import Filme from './models/Filme.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/filmes', async (req, res) => {
    try {
        const filmes = await Filme.findAll({ raw: true });
        res.json(filmes);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao consultar filmes' });
    }
});


app.post('/api/filmes', async (req, res) => {
    try {
        const { nome, ano } = req.body;

        if (!nome || !Number.isInteger(Number(ano)) || Number(ano) <= 0) {
            return res.status(400).json({ erro: 'Informe um nome e um ano válido.' });
        }

        const filme = await Filme.create({
            nome,
            ano: Number(ano)
        });

        res.status(201).json(filme);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao cadastrar filme' });
    }
});


app.put('/api/filmes/:id', async (req, res) => {
    try {
        const { nome, ano } = req.body;

        if (!nome || !Number.isInteger(Number(ano)) || Number(ano) <= 0) {
            return res.status(400).json({ erro: 'Informe um nome e um ano válido.' });
        }

        const filme = await Filme.findByPk(req.params.id);

        if (!filme) {
            return res.status(404).json({ erro: 'Filme não encontrado.' });
        }

        await filme.update({
            nome,
            ano: Number(ano)
        });

        res.json(filme);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao editar filme' });
    }
});


app.delete('/api/filmes/:id', async (req, res) => {
    try {
        const filme = await Filme.findByPk(req.params.id);

        if (!filme) {
            return res.status(404).json({ erro: 'Filme não encontrado.' });
        }

        await filme.destroy();

        res.json({ mensagem: 'Filme excluído com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao excluir filme' });
    }
});


sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}).catch((erro) => {
    console.error('Erro ao conectar com o banco:', erro);
});
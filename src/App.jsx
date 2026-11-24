
import { useState, useEffect } from 'react';
import './App.css';
import ListaFilmes from './Components/ListaFilmes';

function App() {
    const [filmes, setFilmes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');

    const [nome, setNome] = useState('');
    const [ano, setAno] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [salvando, setSalvando] = useState(false);

    async function buscarFilmes() {
        try {
            setErro('');

            const resposta = await fetch('http://localhost:3000/api/filmes');

            if (!resposta.ok) {
                throw new Error('Ocorreu um erro ao carregar a lista de filmes.');
            }

            const dados = await resposta.json();
            setFilmes(dados);

        } catch (erro) {
            setErro('Não foi possível carregar a lista de filmes. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarFilmes();
    }, []);

    async function salvarFilme(event) {
        event.preventDefault();

        setSalvando(true);
        setErro('');
        setMensagem('');

        const editando = editandoId !== null;

        try {
            const resposta = await fetch(
                editando
                    ? `http://localhost:3000/api/filmes/${editandoId}`
                    : 'http://localhost:3000/api/filmes',
                {
                    method: editando ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome,
                        ano: Number(ano)
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível salvar as informações do filme.');
            }

            if (editando) {
                setFilmes((listaAtual) =>
                    listaAtual.map((filme) =>
                        filme.id === editandoId ? dados : filme
                    )
                );

                setMensagem('As informações do filme foram atualizadas com sucesso!');
            } else {
                setFilmes((listaAtual) => [...listaAtual, dados]);

                setMensagem('O filme foi cadastrado com sucesso!');
            }

            limparFormulario();

        } catch (erro) {
            setErro(erro.message || 'Não foi possível salvar o filme. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }

    function editarFilme(filme) {
        setNome(filme.nome);
        setAno(String(filme.ano));
        setEditandoId(filme.id);
        setMensagem('');
        setErro('');
    }

    function limparFormulario() {
        setNome('');
        setAno('');
        setEditandoId(null);
    }

    async function excluirFilme(id) {
        const confirmar = window.confirm(
            'Deseja realmente excluir este filme da sua lista?'
        );

        if (!confirmar) {
            return;
        }

        setErro('');
        setMensagem('');

        try {
            const resposta = await fetch(
                `http://localhost:3000/api/filmes/${id}`,
                {
                    method: 'DELETE'
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível excluir o filme.');
            }

            setFilmes((listaAtual) =>
                listaAtual.filter((filme) => filme.id !== id)
            );

            if (editandoId === id) {
                limparFormulario();
            }

            setMensagem('O filme foi removido da sua lista com sucesso!');

        } catch (erro) {
            setErro(erro.message || 'Ocorreu um erro ao excluir o filme. Tente novamente.');
        }
    }

    return (
        <main className="pagina">
            <header className="cabecalho">
                <h1>Minha Lista de Filmes</h1>
                <p>Cadastre e organize seus filmes favoritos em um só lugar!</p>
            </header>

            <section className="formulario">
                <h2>
                    {editandoId !== null ? 'Editar informações do filme' : 'Adicionar novo filme'}
                </h2>

                <form onSubmit={salvarFilme}>
                    <label htmlFor="nome">Nome do filme</label>
                    <input
                        id="nome"
                        type="text"
                        placeholder="Informe o nome do filme"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        required
                    />

                    <label htmlFor="ano">Ano de lançamento</label>
                    <input
                        id="ano"
                        type="number"
                        placeholder="Ex: 2000"
                        value={ano}
                        onChange={(event) => setAno(event.target.value)}
                        min="1"
                        step="1"
                        required
                    />

                    <div className="acoes-formulario">
                        <button
                            type="submit"
                            className="botao-principal"
                            disabled={salvando}
                        >
                            {salvando
                                ? 'Salvando informações...'
                                : editandoId !== null
                                    ? 'Confirmar alterações'
                                    : 'Adicionar filme'}
                        </button>

                        {editandoId !== null && (
                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={limparFormulario}
                            >
                                Cancelar edição
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {mensagem && (
                <p className="mensagem sucesso">{mensagem}</p>
            )}

            <ListaFilmes
                filmes={filmes}
                carregando={carregando}
                erro={erro}
                onEditar={editarFilme}
                onExcluir={excluirFilme}
            />
        </main>
    );
}

export default App;

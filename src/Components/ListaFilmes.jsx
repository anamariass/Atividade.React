import ItemFilme from './ItemFilme';

function ListaFilmes({ filmes, carregando, erro, onEditar, onExcluir }) {
    return (
        <section className="lista">
            <h2>Filmes cadastrados</h2>

            {carregando && <p>Carregando filmes...</p>}

            {!carregando && erro && (
                <p className="mensagem erro">{erro}</p>
            )}

            {!carregando && !erro && filmes.length === 0 && (
                <p>Nenhum filme cadastrado ainda.</p>
            )}

            <div className="filmes">
                {filmes.map((filme) => (
                    <ItemFilme
                        key={filme.id}
                        filme={filme}
                        onEditar={onEditar}
                        onExcluir={onExcluir}
                    />
                ))}
            </div>
        </section>
    );
}

export default ListaFilmes;
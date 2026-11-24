function ItemFilme({ filme, onEditar, onExcluir }) {
    return (
        <article className="cartao-filme">
            <div>
                <h3>{filme.nome}</h3>
                <p>Ano: {filme.ano}</p>
            </div>

            <div className="acoes-filme">
                <button
                    type="button"
                    className="botao-editar"
                    onClick={() => onEditar(filme)}
                >
                    Editar
                </button>

                <button
                    type="button"
                    className="botao-excluir"
                    onClick={() => onExcluir(filme.id)}
                >
                    Excluir
                </button>
            </div>
        </article>
    );
}

export default ItemFilme;
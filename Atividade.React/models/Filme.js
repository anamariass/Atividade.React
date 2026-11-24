
import Sequelize from 'sequelize';
import sequelize from '../config/bd.js';

const Filme = sequelize.define('Filme', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ano: {
        type: Sequelize.INTEGER
    }
});

export default Filme;

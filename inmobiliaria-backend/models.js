const { Sequelize, DataTypes } = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize(
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DATABASE}`, 
    {
        dialect: 'postgres',
        dialectModule: pg,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

const Usuario = sequelize.define('Usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

const Propiedad = sequelize.define('Propiedad', {
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    banos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    superficie: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendedor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechaPublicacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

Usuario.hasMany(Propiedad);
Propiedad.belongsTo(Usuario);

const Evento = sequelize.define('Evento', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

const initDb = async () => {
    await sequelize.sync();
};

module.exports = { Usuario, Propiedad, Evento, initDb };

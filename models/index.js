const Sequelize = require('sequelize') 
const allConfigs = require('../config/sequelize') 
const MoviesModel = require('./movies') 
const DirectorsModel = require('./directors')
const GenresModel = require('./genres')
const JoinModel = require('./joinTables')
const config = allConfigs['development']
const connection = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
})

connection.authenticate()

const Movies = MoviesModel(connection, Sequelize)
const Directors = DirectorsModel(connection, Sequelize)
const Genres = GenresModel(connection, Sequelize)
const JoinTables = JoinModel(connection, Sequelize, Movies, Directors, Genres)

Movies.belongsToMany(Directors, { through: 'JoinTables', foreignKey: 'movieId' })

Movies.belongsToMany(Genres, { through: 'JoinTables', foreignKey: 'movieId' })

Directors.belongsToMany(Movies, { through: 'JoinTables', foreignKey: 'directorId' })

Directors.belongsToMany(Genres, { through: 'JoinTables', foreignKey: 'directorId' })

Genres.belongsToMany(Movies, { through: 'JoinTables', foreignKey: 'genreId' })

Genres.belongsToMany(Directors, { through: 'JoinTables', foreignKey: 'genreId' })

JoinTables.belongsTo(Movies, { foreignKey: 'movieId' })
JoinTables.belongsTo(Directors, { foreignKey: 'directorId' })
JoinTables.belongsTo(Genres, { foreignKey: 'genreId' })
module.exports = {
        Movies,
        Directors,
        Genres,
        Movies,
}
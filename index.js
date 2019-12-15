const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const models = require('./models')
const Op = require('sequelize').Op 

app.get('/movies', async (req, res) => {
        models.Movies.findAll({
        attributes: ["id", "title", "releaseDate", "rating", "runTime"],
        include: [{
            attributes: ['name'],
            model: models.Directors,
            through: { attributes: [] },
        }, {
            attributes: ['name'],
            model: models.Genres,
            through: { attributes: [] },
        }],
     }).then((movies) => {
        res.send(movies)
    })
})

app.get('/movies/:movieId', async (req, res) => {
    const { movieId } = req.params
    const match = await models.Movies.findAll({
        where: { id: movieId },
        attributes: ["id", "title", "releaseDate", "rating", "runTime"],
        include: [{
            attributes: ['id', 'name'],
            model: models.Directors,
            through: { attributes: [] },
        }, {
            attributes: ['name'],
            model: models.Genres,
            through: { attributes: [] },
        }]
    })
    if (match) {
        res.send(match)
    } else {
        res.status(404).send('That is not a valid Movie Id. Please try again.')
    }
})

app.post('/movies', bodyParser.json(), async (req, res) => {
    const { title, directors, releaseDate, rating, runTime, genres } = req.body

    if ( !title || !directors || !releaseDate || !rating || !runTime, !genres) {
        res.status(400).send('The following attributes are required: title, directors, releaseDate, rating, runTime, genres')
    } else {
        models.Movies.create({title, directors, releaseDate, rating, runTime, genres}).then((newMovie) => {
        res.status(201).send(newMovie)
        console.log({newMovie})
        })
    }
})

app.get('/directors/:directorId', async (req, res) => {
    const { directorId } = req.params
    const match = await models.Directors.findAll({
        where: { id: directorId },
        attributes: ['id', 'name'],
        include: [{
            attributes: ["id", "title", "releaseDate", "rating", "runTime"],
            model: models.Movies,
            through: { attributes: [] },
            include: [{ model: models.Genres, 
                         attributes: ['name'], 
                         through: { attributes: [] }}]
        }]
    })
    
    if (match) {
        res.send(match)
    } else {
        res.status(404).send('That is not a valid Director Id. Please try again.')
    }
})

app.get('/genres/:genreName', async (req, res) => {
    const { genreName } = req.params
    const match = await models.Genres.findAll({
        where: { name: genreName },
        attributes: ['id', 'name'],
        include: [{
            attributes: ["id", "title", "releaseDate", "rating", "runTime"],
            model: models.Movies,
            through: { attributes: [] },
            include: [ { model: models.Directors, 
                         attributes: ['id', 'name'], 
                         through: { attributes: [] } } ]
        }]
    })
       if (match) {
        res.send(match)
    } else {
        res.status(404).send('That is not a valid Genre Name. Please try again.')
    }
})

app.all('*', (req, res) => {
    res.send('Are you trying to find a movie: Try again!')
})

app.listen(3000, () => {
    console.log('SUCCESS!')
})
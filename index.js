require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

const Person = require('./models/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :body'))

app.use(express.static('dist'))



app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const date = new Date()
    Person.countDocuments({}).then(count => {
        response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>`

        )
    })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const { id, name, number } = request.body

    const person = {
        id: body.id,
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true },
        { id, name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
        .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })

    }
    /*
    if (Person.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
*/


    const person = new Person({
        //id: Math.floor(Math.random() * 100000000),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'Validation error') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

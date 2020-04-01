require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
    return (
        JSON.stringify(req.body)
    )
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => savedPerson.toJSON())
    .then(formattedPerson => response.send(formattedPerson))
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    let count = 0
    Person.find({})
    .then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} persons</p>`)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person){
            response.json(person.toJSON())
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(person => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const id = request.params.id

    const newPerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, newPerson, {new : true})
    .then(person => {
        response.json(person.toJSON())
    })
})

const unknownEndpoint = ((request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
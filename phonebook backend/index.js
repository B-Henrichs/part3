// imports express and declares it as app variable
const express = require('express')
const app = express()

// imports secret info from .env file
require('dotenv').config()

// imports mongoose and number(person) function
const Number = require('./models/number')

// import cors and use
const cors = require('cors')
app.use(cors())

// informs express which format(I think)
app.use(express.json()) 
app.use(express.static('build'))

/*

// imports morgan
const morgan = require('morgan')

//  I think morgan has been replaced with 
// another debugger
// creates custom morgan token that has weird
// decleration syntax required to function
// *note* the body is generated off the request and
// not the response
morgan.token("post", (req, res) => {
  const { body } = req;
  return JSON.stringify(body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

*/

  // handles requests to server 
  // @ /persons
  // added map method from answers page
  // seemed to function before
  app.get('/api/persons', (request, response) => {
    Number.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
  })
})

  // info page
  app.get('/info', (request, response,) => {
    
     const date= new Date()
    response.send(`<p>Phonebook has info for  people<p> <br/> <div>${date}(Pacific Standard Time)`)
  })


  // specific entrys
  app.get('/api/persons/:id', (request, response, next) => {
    Number.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  

// handles "post" requests to server
  
app.post('/api/persons', (request, response) => {
  const body = request.body
  

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }else if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  
  const person = new Number({
    name: body.name,
    number: body.number || false
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

// handles delete requests
  app.delete('/api/persons/:id', (request, response, next) => {
    Number.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Number.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
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
    } 
  
    next(error)
  }
  
  app.use(errorHandler)
  

  const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
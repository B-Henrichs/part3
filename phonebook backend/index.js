// imports express and declares it as app variable
const express = require('express')
const app = express()

// informs express which format(I think)
app.use(express.json()) 

// imports morgan
const morgan = require('morgan')
// creates custom morgan token that has weird
// decleration syntax required to function
// *note* the body is generated of the request and
// not the response
morgan.token("post", (req, res) => {
  const { body } = req;
  return JSON.stringify(body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


//import cors and use
const cors = require('cors')

app.use(cors())

//   "the database"
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "bob",
        "number": "867 5309",
        "id": 4
      }
  ]
//   these hand reqests to the server
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  //info page
  app.get('/info', (request, response) => {
     const numberOfPeople= (persons.length)+1
     const date= new Date()
    response.send(`<p>Phonebook has info for ${numberOfPeople} people<p> <br/> <div>${date}(Pacific Standard Time)`)
  })


  //specific entrys
  app.get('/api/persons/:id', (request, response) => {
    const id =  Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  // handles ID generation for the post function
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }


  // handles "post" requests to server
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const isNameExist = persons.filter(
      (item) => item.name.toLocaleLowerCase() === body.name.toLowerCase()
    ).length;

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }else if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }else if (isNameExist ){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    const person = {
      name: body.name,
      number: body.number || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  

  const PORT = process.env.PORT || 80
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
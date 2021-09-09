const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')

app.use(cors())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]




app.get("/", (req, res) => {
})
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
  try {
    const id = request.params.id
    console.log(id)
    let person = persons.find(person => {
      return toString(person.id) === toString(id)
    })
    console.log("PERSON", person)
    response.json(person)
  } catch (error) {
    console.log("ERRROR", error)
  }

})
app.delete('/api/persons/:id', (request, response) => {
  try {
    const id = request.params.id
    console.log(id)
    let person = persons.find(person => {
      return toString(person.id) === toString(id)
    })
    response.status(204).end()
  } catch (error) {
    console.log("ERROR", error)
  }

})
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const personName = body.name;
  const personNumber = body.number;


  function hasDuplicates(newElement) {
    let object = persons.find(element => element.name === newElement);
    console.log("OBJECT ", object)
    if (object == undefined) {
      return false
    }
    if (Object.keys(object).length !== 0) {
      return true
    }
    return false
  }
  if (personName === "") {
    response.json({ error: "name or number is empty" })
  } else if (hasDuplicates(personName)) {
    response.json({ error: "name is alreaded added" })
  }
  return response.send(JSON.stringify(body))
})
app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people ${new Date()}`)

})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
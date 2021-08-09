const http = require('http')
const express = require('express')
const app = express()

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

app.get('/api/persons', (request, response) => {
  response.send(JSON.stringify(persons))
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
    console.log("ERRROR", error) 
  }
 
})
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

app.post("/api/persons", (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
  function hasDuplicates (newElement) {
    let object = persons.find(element => element === newElement);
    if (Object.keys(object).length !== 0) {
      return true
    }
    return false
  }
  if ( note.number || note.name === "") {

  } else if (hasDuplicates(note.name)) {

  }
})
app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people ${new Date()}`)

})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
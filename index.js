const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const mongoose = require("mongoose");

const url = `mongodb+srv://alejogb:${process.argv[2]}@cluster0.yvdek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const phoneNumber = mongoose.model("Note", noteSchema);

if (process.argv.length > 3) {
  const number = new phoneNumber({
    name: process.argv[3],
    number: process.argv[4],
  });
  number.save().then((result) => {
    console.log("RESULT, ", result);
    console.log(
      `Added number: ${result.number} of ${result.name} to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  console.log("Ejecutar find");

  phoneNumber.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((note) => {
      console.log(note.name, " ", note.number);
    });
    mongoose.connection.close();
  });
}

app.use(express.static("build"));

app.get("/", (req, res) => {});
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  try {
    const id = request.params.id;
    console.log(id);
    let person = persons.find((person) => {
      return toString(person.id) === toString(id);
    });
    console.log("PERSON", person);
    response.json(person);
  } catch (error) {
    console.log("ERRROR", error);
  }
});
app.delete("/api/persons/:id", (request, response) => {
  try {
    const id = request.params.id;
    console.log(id);
    let person = persons.find((person) => {
      return toString(person.id) === toString(id);
    });
    response.status(204).end();
  } catch (error) {
    console.log("ERROR", error);
  }
});
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const personName = body.name;
  const personNumber = body.number;

  function hasDuplicates(newElement) {
    let object = persons.find((element) => element.name === newElement);
    console.log("OBJECT ", object);
    if (object == undefined) {
      return false;
    }
    if (Object.keys(object).length !== 0) {
      return true;
    }
    return false;
  }
  if (personName === "") {
    response.json({ error: "name or number is empty" });
  } else if (hasDuplicates(personName)) {
    response.json({ error: "name is alreaded added" });
  }
  return response.send(JSON.stringify(body));
});
app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people ${new Date()}`
  );
});

app.listen(process.env.PORT || 5000);
console.log(`Server running on port ${5000}`);
